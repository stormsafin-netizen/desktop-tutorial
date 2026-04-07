import { requireAuth, AuthError } from '@/lib/auth-adapter';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(request: Request) {
  try {
    const user = await requireAuth(request);
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') ?? '20', 10)));
    const offset = (page - 1) * limit;

    const { data, error, count } = await supabaseAdmin
      .from('validation_records')
      .select('id, filename, status, overall_result, page_count, created_at', { count: 'exact' })
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw new Error(error.message);
    return Response.json({ records: data ?? [], total: count ?? 0, page, limit });
  } catch (err) {
    if (err instanceof AuthError) {
      return Response.json({ error: err.message }, { status: err.status });
    }
    return Response.json({ error: '記録の取得に失敗しました' }, { status: 500 });
  }
}
