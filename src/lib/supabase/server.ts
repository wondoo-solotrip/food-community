import 'server-only';

import { createServerClient } from '@supabase/ssr';
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
