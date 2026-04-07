// Bridges Next.js API Route Request objects to the existing auth/auth.js module.
// The Express middleware in auth/middleware.js cannot be used directly in Next.js
// App Router API routes, so we replicate the Bearer token extraction here.

// eslint-disable-next-line @typescript-eslint/no-require-imports
const { verifyToken } = require('../auth/auth');

export interface AuthUser {
  id: number;
  username: string;
  email: string;
  password: string;
}

export class AuthError extends Error {
  status: number;
  constructor(message: string, status = 401) {
    super(message);
    this.status = status;
  }
}

export async function requireAuth(request: Request): Promise<AuthUser> {
  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    throw new AuthError('認証トークンがありません');
  }
  const token = authHeader.slice(7);
  try {
    return await verifyToken(token);
  } catch {
    throw new AuthError('無効または期限切れのトークンです');
  }
}
