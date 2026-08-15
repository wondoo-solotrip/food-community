import 'server-only';

import { createServerClient } from '@supabase/ssr';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

import type { Database } from './database.types';
import { supabaseEnv } from './env';

/**
 * Supabase 클라이언트 생성의 단일 지점.
 * Route Handler / Server Action / Server Component 에서만 호출한다.
 * 클라이언트 컴포넌트는 절대 이 모듈을 import 하지 않는다(`server-only` 로 강제).
 */
export async function createSupabaseServerClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(supabaseEnv.url, supabaseEnv.publishableKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // Server Component 에서는 쿠키를 쓸 수 없다. 세션 갱신은 middleware 가 담당한다.
        }
      },
    },
  });
}

/**
 * 서비스 롤 클라이언트 — RLS 를 우회한다.
 * 사용자 세션이 없는 서버 작업(포트원 웹훅의 결제 원장 기록, 참여자 수 집계)에만 쓰고,
 * 요청 사용자의 권한으로 처리할 수 있는 곳에는 절대 쓰지 않는다.
 */
export function createSupabaseAdminClient() {
  const serviceRoleKey = supabaseEnv.serviceRoleKey;
  if (!serviceRoleKey) {
    throw new Error(
      '환경변수 SUPABASE_SERVICE_ROLE_KEY 가 설정되지 않았습니다. .env.local 을 확인하세요.',
    );
  }
  return createClient<Database>(supabaseEnv.url, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
