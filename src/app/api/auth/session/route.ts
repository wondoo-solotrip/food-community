import { getSession, signOut } from '@/lib/auth';
import { handleRoute, jsonOk } from '@/lib/api/response';

/** GET /api/auth/session — 현재 로그인 사용자 + 프로필 (미로그인 시 user: null) */
export async function GET() {
  return handleRoute(async () => {
    return jsonOk(await getSession());
  });
}

/** DELETE /api/auth/session — 로그아웃 */
export async function DELETE() {
  return handleRoute(async () => {
    await signOut();
    return jsonOk({ signedOut: true });
  });
}
