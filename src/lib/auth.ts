import 'server-only';

import { ApiError } from '@/lib/api/response';
import { getProfile, type Profile } from '@/lib/profile';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export interface SessionUser {
  id: string;
  email: string | null;
  name: string | null;
  avatarUrl: string | null;
}

/** 로그인 사용자와 프로필을 함께 담는 세션 스냅샷. 미로그인 시 user 가 null 이다. */
export interface Session {
  user: SessionUser | null;
  profile: Profile | null;
}

/** 현재 로그인 사용자. 미로그인 시 null. */
export async function getCurrentUser(): Promise<SessionUser | null> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  return {
    id: user.id,
    email: user.email ?? null,
    name: (user.user_metadata.full_name as string | undefined) ?? null,
    avatarUrl: (user.user_metadata.avatar_url as string | undefined) ?? null,
  };
}

/** 세션 조회의 단일 진입점. Route Handler 는 이 결과를 그대로 내보낸다. */
export async function getSession(): Promise<Session> {
  const user = await getCurrentUser();
  if (!user) return { user: null, profile: null };

  return { user, profile: await getProfile(user.id) };
}

/** 인증이 필수인 서버 로직에서 사용. 미로그인 시 401 로 정규화된다. */
export async function requireUser(): Promise<SessionUser> {
  const user = await getCurrentUser();
  if (!user) {
    throw new ApiError('UNAUTHORIZED', '로그인이 필요합니다.', 401);
  }
  return user;
}

/**
 * Google OAuth 인가 URL 생성.
 * 브라우저 리다이렉트는 클라이언트가 담당하고, 코드 교환은 서버 콜백 라우트가 처리한다.
 */
export async function createGoogleOAuthUrl(origin: string, next: string): Promise<string> {
  const supabase = await createSupabaseServerClient();
  const callbackUrl = new URL('/api/auth/callback', origin);
  callbackUrl.searchParams.set('next', next);

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: callbackUrl.toString(),
      skipBrowserRedirect: true,
    },
  });

  if (error || !data.url) {
    console.error('[auth] google oauth url 생성 실패', error);
    throw new ApiError('OAUTH_INIT_FAILED', 'Google 로그인을 시작하지 못했습니다.', 502);
  }

  return data.url;
}

/** OAuth 콜백에서 받은 code 를 세션 쿠키로 교환한다. */
export async function exchangeCodeForSession(code: string): Promise<void> {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    console.error('[auth] code 교환 실패', error);
    throw new ApiError('OAUTH_EXCHANGE_FAILED', '로그인 처리에 실패했습니다.', 401);
  }
}

export async function signOut(): Promise<void> {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error('[auth] 로그아웃 실패', error);
    throw new ApiError('SIGN_OUT_FAILED', '로그아웃에 실패했습니다.', 500);
  }
}
