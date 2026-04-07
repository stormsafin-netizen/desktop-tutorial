// eslint-disable-next-line @typescript-eslint/no-require-imports
const { login } = require('../../../../auth/auth');

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    if (!email || !password) {
      return Response.json({ error: 'メールアドレスとパスワードを入力してください' }, { status: 400 });
    }
    const result = await login(email, password);
    return Response.json({
      user: { id: result.user.id, username: result.user.username, email: result.user.email },
      token: result.token,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'ログインに失敗しました';
    return Response.json({ error: message }, { status: 401 });
  }
}
