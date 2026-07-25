import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

import type { Database } from './database.types';
import { supabaseEnv } from './env';

/**
 * middleware 전용 세션 갱신 헬퍼.
 * Server Component 는 쿠키를 쓸 수 없으므로, 만료된 액세스 토큰 갱신과
 * 갱신된 쿠키 기록은 이 곳에서 처리한다.
 *
 * `server-only` 를 import 하지 않는 이유: middleware 번들은 react-server 조건을
 * 사용하지 않아 해당 모듈이 런타임 에러를 던진다.
 */
export async function updateSupabaseSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient<Database>(supabaseEnv.url, supabaseEnv.publishableKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        });
      },
    },
  });

  // getUser() 호출이 만료 토큰 갱신을 트리거한다. 이 줄을 제거하면 세션이 임의로 끊긴다.
  await supabase.auth.getUser();

  return response;
}
