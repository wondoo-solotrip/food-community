'use client';

import { useEffect, useState } from 'react';

import { ApiClientError, apiFetch } from '@/lib/api/client';
import type { ReverseGeocodedAddress } from '@/lib/reverseGeocode';

/**
 * 좌표 → 지번 주소 조회 훅. BFF(`/api/reverse-geocode`)만 호출한다.
 * (`ReverseGeocodedAddress` 는 타입으로만 쓰므로 서버 모듈이 브라우저 번들에 딸려오지 않는다.)
 *
 * 지도를 드래그하는 동안 중심이 계속 바뀌므로 잠깐 멈춘 뒤에만 요청하고,
 * 좌표가 다시 바뀌면 대기 중이던 요청은 취소한다.
 */
const REVERSE_GEOCODE_DEBOUNCE_MS = 300;

export type ReverseGeocodeStatus = 'loading' | 'done' | 'error';

/** 응답이 도착한 조회 1회분. 어느 좌표의 결과인지 함께 들고 있어야 지금 좌표의 결과인지 판별할 수 있다. */
interface SettledLookup {
  key: string;
  /** 조회된 지번 주소. 주소가 없는 좌표면 빈 문자열. */
  address: string;
  /** 실패 메시지. 성공이면 null. */
  error: string | null;
}

export interface ReverseGeocodeState {
  /** 지금 좌표의 주소. 아직 결과가 없거나 실패했으면 null, 주소가 없는 좌표면 빈 문자열. */
  address: string | null;
  status: ReverseGeocodeStatus;
  /** 실패 메시지(status 가 `error` 일 때만). */
  error: string | null;
}

const coordKey = (lat: number, lng: number) => `${lat},${lng}`;

export function useReverseGeocode(lat: number, lng: number): ReverseGeocodeState {
  const [settled, setSettled] = useState<SettledLookup | null>(null);

  useEffect(() => {
    const key = coordKey(lat, lng);
    const controller = new AbortController();

    const timer = setTimeout(() => {
      apiFetch<ReverseGeocodedAddress>(`/api/reverse-geocode?lat=${lat}&lng=${lng}`, {
        signal: controller.signal,
      })
        .then((data) => setSettled({ key, address: data.address, error: null }))
        .catch((error: unknown) => {
          if (controller.signal.aborted) return;
          setSettled({
            key,
            address: '',
            error: error instanceof ApiClientError ? error.message : '주소를 불러오지 못했습니다.',
          });
        });
    }, REVERSE_GEOCODE_DEBOUNCE_MS);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [lat, lng]);

  // 지금 좌표의 결과가 아직 없으면(디바운스 대기·요청 중) 로딩이다.
  const matched = settled?.key === coordKey(lat, lng) ? settled : null;

  return {
    address: matched && !matched.error ? matched.address : null,
    status: !matched ? 'loading' : matched.error ? 'error' : 'done',
    error: matched?.error ?? null,
  };
}
