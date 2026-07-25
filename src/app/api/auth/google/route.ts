import type { NextRequest } from 'next/server';

import { createGoogleOAuthUrl } from '@/lib/auth';
import { handleRoute, jsonOk } from '@/lib/api/response';
import { safeNextPath } from '@/lib/api/redirect';

/** POST /api/auth/google — Google 인가 URL 발급. 실제 리다이렉트는 클라이언트가 수행한다. */
export async function POST(request: NextRequest) {
  return handleRoute(async () => {
    const body = (await request.json().catch(() => ({}))) as { next?: string };
    const next = safeNextPath(body.next);
    const url = await createGoogleOAuthUrl(request.nextUrl.origin, next);

    return jsonOk({ url });
  });
}
