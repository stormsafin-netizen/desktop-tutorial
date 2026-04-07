import { requireAuth, AuthError } from '@/lib/auth-adapter';
import { uploadPdf } from '@/lib/storage';
import { convertPdfToImages } from '@/lib/pdf';
import { analyzeDocument } from '@/lib/claude';
import { supabaseAdmin } from '@/lib/supabase';
import { randomUUID } from 'crypto';

export const maxDuration = 300; // 5 minutes for large multi-page PDFs

export async function POST(request: Request) {
  let recordId: string | null = null;

  try {
    const user = await requireAuth(request);

    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    if (!file) {
      return Response.json({ error: 'PDFファイルを選択してください' }, { status: 400 });
    }
    if (file.type !== 'application/pdf') {
      return Response.json({ error: 'PDFファイルのみ対応しています' }, { status: 400 });
    }
    const MAX_SIZE = 50 * 1024 * 1024; // 50MB
    if (file.size > MAX_SIZE) {
      return Response.json({ error: 'ファイルサイズは50MB以下にしてください' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    recordId = randomUUID();

    // 1. Upload PDF to Supabase Storage
    const storagePath = await uploadPdf(user.id, recordId, buffer, file.name);

    // 2. Insert a processing record
    await supabaseAdmin.from('validation_records').insert({
      id: recordId,
      user_id: user.id,
      filename: file.name,
      storage_path: storagePath,
      status: 'processing',
    });

    // 3. Convert PDF pages to images
    const pageImages = await convertPdfToImages(buffer);

    // 4. Analyze with Claude
    const results = await analyzeDocument(pageImages);

    // 5. Save completed results
    await supabaseAdmin
      .from('validation_records')
      .update({
        status: 'complete',
        overall_result: results.overall_result,
        results,
        page_count: results.document_metadata.total_pages_analyzed,
        updated_at: new Date().toISOString(),
      })
      .eq('id', recordId);

    return Response.json({ recordId, overallResult: results.overall_result, results }, { status: 201 });
  } catch (err) {
    // Mark record as error if it was created
    if (recordId) {
      await supabaseAdmin
        .from('validation_records')
        .update({
          status: 'error',
          error_message: err instanceof Error ? err.message : '不明なエラー',
          updated_at: new Date().toISOString(),
        })
        .eq('id', recordId);
    }
    if (err instanceof AuthError) {
      return Response.json({ error: err.message }, { status: err.status });
    }
    console.error('Validation error:', err);
    return Response.json(
      { error: err instanceof Error ? err.message : '検証処理中にエラーが発生しました' },
      { status: 500 },
    );
  }
}
