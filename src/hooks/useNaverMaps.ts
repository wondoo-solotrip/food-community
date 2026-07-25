'use client';

import { useEffect, useState } from 'react';

/**
 * 네이버 지도 JS API(`maps.js`) 로더.
 *
 * 스크립트는 브라우저가 직접 받아야 하므로 클라이언트 키(`ncpKeyId`)를 URL 에 실어 로드한다.
 * 이 키는 Supabase 비밀값과 성격이 달라 노출돼도 되며(실제 보안은 네이버 콘솔의 도메인 제한),
 * 그래서 예외적으로 `NEXT_PUBLIC_` 접두사를 쓴다.
 *
 * - 키가 없으면 네트워크 요청 없이 `missing-key` 로 끝낸다(개발 중 안내 문구 노출용).
 * - 스크립트는 페이지 전체에서 한 번만 로드하도록 모듈 단위 Promise 로 공유한다.
 */
export type NaverMapsStatus = 'loading' | 'ready' | 'error' | 'missing-key';

const SCRIPT_ID = 'naver-maps-sdk';
const clientId = process.env.NEXT_PUBLIC_NAVER_MAP_CLIENT_ID;

let loadPromise: Promise<void> | null = null;

function loadNaverMaps(): Promise<void> {
  if (typeof window === 'undefined') return Promise.reject(new Error('SSR 환경'));
  if (window.naver?.maps) return Promise.resolve();
  if (loadPromise) return loadPromise;

  loadPromise = new Promise<void>((resolve, reject) => {
    const existing = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;
    const script = existing ?? document.createElement('script');

    const onError = () => reject(new Error('네이버 지도 스크립트 로드 실패'));
    script.addEventListener('load', () => resolve());
    script.addEventListener('error', onError);

    if (!existing) {
      script.id = SCRIPT_ID;
      script.async = true;
      script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${clientId}`;
      document.head.appendChild(script);
    } else if (window.naver?.maps) {
      resolve();
    }
  });

  // 다음 시도에서 재로드할 수 있도록 실패 시 캐시를 비운다.
  loadPromise.catch(() => {
    loadPromise = null;
  });

  return loadPromise;
}

export function useNaverMaps(): NaverMapsStatus {
  const [status, setStatus] = useState<NaverMapsStatus>(() =>
    clientId ? 'loading' : 'missing-key',
  );

  useEffect(() => {
    if (!clientId) {
      setStatus('missing-key');
      return;
    }

    let active = true;
    loadNaverMaps()
      .then(() => active && setStatus('ready'))
      .catch(() => active && setStatus('error'));

    return () => {
      active = false;
    };
  }, []);

  return status;
}
