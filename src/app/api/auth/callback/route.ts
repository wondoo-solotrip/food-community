import { NextResponse, type NextRequest } from 'next/server';

import { safeNextPath } from '@/lib/api/redirect';
import { exchangeCodeForSession } from '@/lib/auth';

/**
 * GET /api/auth/callback — Supabase OAuth 리다이렉트 수신 지점.
 * 코드 교환과 세션 쿠키 설정은 전부 서버에서 처리한다.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const code = searchParams.get('code');
  const next = safeNextPath(searchParams.get('next'));

  if (!code) {
    return NextResponse.redirect(new URL('/login?error=missing_code', origin));
  }

  try {
    await exchangeCodeForSession(code);
  } catch {
    return NextResponse.redirect(new URL('/login?error=oauth_failed', origin));
  }

  return NextResponse.redirect(new URL(next, origin));
}
