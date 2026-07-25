import type { NextRequest } from 'next/server';

import { updateSupabaseSession } from '@/lib/supabase/session';

/** Next 16 proxy(구 middleware) — 요청마다 Supabase 세션 쿠키를 갱신한다. */
export default async function proxy(request: NextRequest) {
  return updateSupabaseSession(request);
}

export const config = {
  matcher: [
    /*
     * 정적 자산을 제외한 모든 경로에서 세션을 갱신한다.
     * - _next/static, _next/image, favicon, 이미지 파일 제외
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
