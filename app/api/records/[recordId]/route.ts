import { requireAuth, AuthError } from '@/lib/auth-adapter';
import { supabaseAdmin } from '@/lib/supabase';
import { getSignedUrl } from '@/lib/storage';

export async function GET(
  request: Request,
  { params }: { params: { recordId: string } },
) {
  try {
    const user = await requireAuth(request);
    const { recordId } = params;

    const { data, error } = await supabaseAdmin
      .from('validation_records')
      .select('*')
      .eq('id', recordId)
      .eq('user_id', user.id) // ownership check
      .single();

    if (error || !data) {
      return Response.json({ error: '記録が見つかりません' }, { status: 404 });
    }

    // Attach a fresh signed URL for downloading the original PDF
    const signedUrl = await getSignedUrl(data.storage_path).catch(() => null);
    return Response.json({ ...data, signedUrl });
  } catch (err) {
    if (err instanceof AuthError) {
      return Response.json({ error: err.message }, { status: err.status });
    }
    return Response.json({ error: '記録の取得に失敗しました' }, { status: 500 });
  }
}
