import { supabaseAdmin } from './supabase';

const BUCKET = 'batch-records';

export async function uploadPdf(
  userId: number,
  recordId: string,
  buffer: Buffer,
  filename: string,
): Promise<string> {
  const path = `${userId}/${recordId}/${filename}`;
  const { error } = await supabaseAdmin.storage
    .from(BUCKET)
    .upload(path, buffer, { contentType: 'application/pdf', upsert: false });

  if (error) throw new Error(`Storage upload failed: ${error.message}`);
  return path;
}

export async function getSignedUrl(storagePath: string): Promise<string> {
  const { data, error } = await supabaseAdmin.storage
    .from(BUCKET)
    .createSignedUrl(storagePath, 3600); // 1 hour

  if (error || !data) throw new Error('Failed to create signed URL');
  return data.signedUrl;
}
