'use client';

import { useCallback, useEffect, useState } from 'react';

import { apiFetch } from '@/lib/api/client';
/** 타입 전용 import — 런타임 코드가 없으므로 서버 모듈이 브라우저 번들에 포함되지 않는다. */
import type { Session } from '@/lib/auth';

export interface UseSessionResult {
  session: Session | null;
  /** 첫 조회가 끝나기 전에는 true. 로그인 여부를 판단하기 전 UI 깜빡임을 막는 데 쓴다. */
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  signOut: () => Promise<void>;
}

/**
 * 클라이언트 컴포넌트의 로그인 상태 진입점.
 * Supabase 클라이언트를 쓰지 않고 BFF(`/api/auth/session`)만 호출한다.
 */
export function useSession(): UseSessionResult {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // setState 는 모두 프라미스 콜백 안에서만 호출한다(effect 본문의 동기 setState 금지).
  const refresh = useCallback(
    () =>
      apiFetch<Session>('/api/auth/session')
        .then((next) => {
          setSession(next);
          setError(null);
        })
        .catch((cause: unknown) => {
          setSession({ user: null, profile: null });
          setError(cause instanceof Error ? cause.message : '세션을 확인하지 못했습니다.');
        })
        .finally(() => setLoading(false)),
    [],
  );

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const signOut = useCallback(async () => {
    await apiFetch('/api/auth/session', { method: 'DELETE' });
    setSession({ user: null, profile: null });
  }, []);

  return { session, loading, error, refresh, signOut };
}
