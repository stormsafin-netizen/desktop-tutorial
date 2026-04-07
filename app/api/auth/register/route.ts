// eslint-disable-next-line @typescript-eslint/no-require-imports
const { register } = require('../../../../auth/auth');

export async function POST(request: Request) {
  try {
    const { username, email, password } = await request.json();
    if (!username || !email || !password) {
      return Response.json({ error: '全項目を入力してください' }, { status: 400 });
    }
    const result = await register(username, email, password);
    return Response.json(
      { user: { id: result.user.id, username: result.user.username, email: result.user.email }, token: result.token },
      { status: 201 },
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : '登録に失敗しました';
    return Response.json({ error: message }, { status: 400 });
  }
}
