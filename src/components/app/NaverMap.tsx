'use client';

import { useEffect, useRef, useState } from 'react';

import { Icon } from '@/components/foundation/Icon';
import { useNaverMaps, type NaverMapsStatus } from '@/hooks/useNaverMaps';
import { cn } from '@/lib/cn';

interface NaverMapProps {
  /** 위도(WGS84) — 지도의 중심 */
  lat: number;
  /** 경도(WGS84) */
  lng: number;
  /** 지도 접근성 라벨로 쓰이는 장소명 */
  name?: string;
  /** 초기 확대 레벨(1~21). 장소 미리보기는 16 정도가 적당하다. */
  zoom?: number;
  /** 장소 좌표에 마커 표시 여부. 기본 true. `centerPin` 을 켜면 무시된다. */
  showMarker?: boolean;
  /**
   * 핀고정 + 지도이동 모드. 핀이 화면 정중앙에 붙박이로 서 있고 지도가 그 아래에서 움직인다.
   * 즉 핀이 가리키는 좌표 = 지도 중심이며, 이동이 멎을 때마다 `onCenterChange` 로 알려준다.
   */
  centerPin?: boolean;
  /** 지도 이동이 멎었을 때의 중심 좌표. 소수점 7자리(≈1cm)로 반올림해 전달한다. */
  onCenterChange?: (lat: number, lng: number) => void;
  /** 지도/폴백 컨테이너에 그대로 얹히는 클래스(크기·테두리 등은 부모가 정한다). */
  className?: string;
}

/** 지도가 되돌려 준 중심과 prop 이 같은 좌표인지 판단하는 허용 오차(≈1cm). */
const COORD_EPSILON = 1e-7;

/** 투영 왕복에서 생기는 끝자리 잡음을 없애 같은 좌표가 계속 같은 값으로 보이게 한다. */
function round(value: number): number {
  return Math.round(value * 1e7) / 1e7;
}

/**
 * 네이버 지도 미리보기.
 *
 * 두 가지 방식이 있다.
 * - 기본(`centerPin` 미사용): 좌표에 네이버 기본 마커(`naver.maps.Marker`)를 꽂는다.
 *   지도를 드래그하면 마커도 그 장소를 그대로 가리킨 채 함께 움직인다.
 * - `centerPin`: 마커 대신 화면 중앙에 핀을 고정하고 지도만 움직인다.
 *   사용자가 지도를 옮겨 위치를 고르는 방식이라, 멈출 때마다 중심 좌표를 부모에게 올려 준다.
 *
 * 스크립트 로딩 중/실패/키없음은 폴백 UI 로 대체하고, 준비되면 지도를 렌더한다.
 */
export function NaverMap({
  lat,
  lng,
  name,
  zoom = 16,
  showMarker = true,
  centerPin = false,
  onCenterChange,
  className,
}: NaverMapProps) {
  const status = useNaverMaps();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<naver.maps.Map | null>(null);
  const markerRef = useRef<naver.maps.Marker | null>(null);
  const [dragging, setDragging] = useState(false);

  // 콜백은 렌더마다 새로 올 수 있으니 ref 로 받아 둔다. 리스너를 다시 걸지 않기 위해서다.
  const onCenterChangeRef = useRef(onCenterChange);
  useEffect(() => {
    onCenterChangeRef.current = onCenterChange;
  }, [onCenterChange]);

  // 스크립트가 준비되면 지도(+마커·리스너)를 한 번 생성하고, 언마운트 시 정리한다.
  useEffect(() => {
    if (status !== 'ready' || !containerRef.current) return;

    const position = new naver.maps.LatLng(lat, lng);
    const map = new naver.maps.Map(containerRef.current, {
      center: position,
      zoom,
      draggable: true,
      scrollWheel: false, // 페이지 스크롤을 가로채지 않도록 휠 확대는 끈다.
    });
    mapRef.current = map;

    if (showMarker && !centerPin) {
      // 아이콘 옵션을 주지 않아 네이버 기본 마커 디자인으로 그려진다.
      markerRef.current = new naver.maps.Marker({ position, map, title: name });
    }

    // `idle` 은 드래그·확대가 모두 멎은 뒤 한 번 발생한다(이동 중 매 프레임 호출을 피한다).
    const listeners = [
      naver.maps.Event.addListener(map, 'idle', () => {
        const center = map.getCenter();
        onCenterChangeRef.current?.(round(center.lat()), round(center.lng()));
      }),
      naver.maps.Event.addListener(map, 'dragstart', () => setDragging(true)),
      naver.maps.Event.addListener(map, 'dragend', () => setDragging(false)),
    ];

    return () => {
      naver.maps.Event.removeListener(listeners);
      markerRef.current?.setMap(null);
      markerRef.current = null;
      map.destroy();
      mapRef.current = null;
    };
    // 좌표/줌 변경은 아래 effect 가 처리하므로 생성은 status 에만 의존한다.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  // 좌표가 밖에서 바뀌면(검색 결과 선택 등) 지도 중심과 마커 위치를 함께 옮긴다.
  useEffect(() => {
    const map = mapRef.current;
    if (status !== 'ready' || !map) return;

    // 방금 드래그해서 올려보낸 좌표가 prop 으로 되돌아온 것이라면 다시 옮기지 않는다.
    // (그대로 setCenter 하면 이동 → idle → 이동이 반복돼 지도가 튄다.)
    const center = map.getCenter();
    if (Math.abs(center.lat() - lat) < COORD_EPSILON && Math.abs(center.lng() - lng) < COORD_EPSILON) {
      return;
    }

    const position = new naver.maps.LatLng(lat, lng);
    map.setCenter(position);
    markerRef.current?.setPosition(position);
  }, [status, lat, lng]);

  if (status !== 'ready') {
    return <NaverMapFallback status={status} className={className} />;
  }

  return (
    <div className={cn('relative', className)}>
      <div
        ref={containerRef}
        className="size-full"
        role="img"
        aria-label={name ? `${name} 위치 지도` : '지도'}
      />
      {centerPin && <CenterPin lifted={dragging} />}
    </div>
  );
}

/**
 * 지도 중앙에 고정된 핀. 지도 위에 얹히기만 하므로 클릭·드래그는 그대로 지도로 통과시킨다.
 * 핀 끝(아래 꼭짓점)이 지도 중심에 닿도록 위로 100% 밀어 올린 뒤, 그림자로 지면을 표시한다.
 */
function CenterPin({ lifted }: { lifted: boolean }) {
  return (
    <div className="pointer-events-none absolute inset-0 z-10">
      {/* 지면 그림자 — 정확한 중심점 표시를 겸한다. 핀이 들리면 살짝 줄어든다. */}
      <span
        className={cn(
          'absolute left-1/2 top-1/2 h-1.5 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-shadow-brand transition-transform duration-150',
          lifted && 'scale-75',
        )}
      />
      <Icon
        name="map-pin"
        size={32}
        className={cn(
          'absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-full text-icon-brand transition-transform duration-150',
          'fill-background-card drop-shadow-[0_2px_4px_var(--color-shadow-brand)]',
          lifted && '-translate-y-[calc(100%+6px)]',
        )}
      />
    </div>
  );
}

function NaverMapFallback({
  status,
  className,
}: {
  status: Exclude<NaverMapsStatus, 'ready'>;
  className?: string;
}) {
  const message =
    status === 'loading'
      ? '지도를 불러오는 중이에요…'
      : status === 'missing-key'
        ? '네이버 지도 키가 설정되지 않았어요. (NEXT_PUBLIC_NAVER_MAP_CLIENT_ID)'
        : '지도를 불러오지 못했어요. 잠시 후 다시 시도해 주세요.';

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-2 px-5 text-center',
        status === 'loading' && 'animate-pulse',
        className,
      )}
    >
      <Icon name="map-pin" size={24} className="text-icon-muted" />
      <span className="text-body-md text-text-subtle">{message}</span>
    </div>
  );
}
