import { requireAuth, AuthError } from '@/lib/auth-adapter';

// eslint-disable-next-line @typescript-eslint/no-require-imports
const { changePassword } = require('../../../../auth/auth');

export async function POST(request: Request) {
  try {
    const user = await requireAuth(request);
    const { currentPassword, newPassword } = await request.json();
    if (!currentPassword || !newPassword) {
      return Response.json({ error: '現在のパスワードと新しいパスワードを入力してください' }, { status: 400 });
    }
    const result = await changePassword(user.id, currentPassword, newPassword);
    return Response.json(result);
  } catch (err) {
    if (err instanceof AuthError) {
      return Response.json({ error: err.message }, { status: err.status });
    }
    const message = err instanceof Error ? err.message : 'パスワード変更に失敗しました';
    return Response.json({ error: message }, { status: 400 });
  }
}
