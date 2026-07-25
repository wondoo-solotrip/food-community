'use client';

import { Suspense, useCallback, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { AppTopNav } from '@/components/app/AppTopNav';
import { NaverMap } from '@/components/app/NaverMap';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { Icon } from '@/components/foundation/Icon';
import { useReverseGeocode } from '@/hooks/useReverseGeocode';
import { cn } from '@/lib/cn';
import { patchPlaceDraft } from '@/lib/placeDraft';
import { parsePlaceSelection, placeSelectionQuery } from '@/lib/placeSelection';

/**
 * design.pen `06 Place Register Page`.
 * 검색 진입점(필드) + 지도(핀고정) + 선택 주소 + "이 위치로 등록하기".
 *
 * 선택 상태(`name`/`addr`/`lat`/`lng`)는 쿼리스트링으로 들고 다닌다.
 * - 검색 결과 선택: 네 값 모두 검색 페이지가 채워서 돌려준다.
 * - 결과 없어 직접 입력: `name` 만 바뀌고 주소/좌표는 직전 값(없으면 서울시청 기본값)이 유지된다.
 *
 * 좌표는 여기서 다시 바뀔 수 있다. 핀은 화면 중앙에 고정돼 있고 지도가 그 아래로 움직이므로,
 * 이동이 멎을 때마다 새 중심 좌표를 리버스 지오코딩해 그 자리의 지번 주소를 보여 준다.
 */
function PlaceRegisterContent() {
  const router = useRouter();
  const params = useSearchParams();

  // 검색 화면을 오갈 때마다 이 페이지는 새로 마운트되므로 쿼리값이 곧 초기 상태다.
  const initial = parsePlaceSelection(params);
  const [center, setCenter] = useState({ lat: initial.lat, lng: initial.lng });
  const hasSelection = initial.name.length > 0;

  const geocoded = useReverseGeocode(center.lat, center.lng);
  // 지도를 아직 안 움직였다면 넘겨받은 주소가 곧 핀 위치의 주소다(첫 조회 전 빈칸 방지).
  const pristine = center.lat === initial.lat && center.lng === initial.lng;
  const address = geocoded.address ?? (pristine ? initial.address : '');

  // 지도가 멎을 때마다 올라온다. 같은 좌표면 상태를 그대로 둬야 조회가 다시 돌지 않는다.
  const handleCenterChange = useCallback((lat: number, lng: number) => {
    setCenter((current) => (current.lat === lat && current.lng === lng ? current : { lat, lng }));
  }, []);

  function openSearch() {
    // 현재 선택값(지도에서 옮긴 좌표 포함)을 넘겨야 직접입력 시 주소/좌표를 그대로 유지할 수 있다.
    const selection = placeSelectionQuery({ name: initial.name, address, ...center });
    router.push(`/register/place/search?${selection}`);
  }

  // 장소명·주소·좌표가 모두 있어야 등록할 수 있다. 주소가 없는 좌표(바다 위 등)는 저장하지 않는다.
  const canSubmit = hasSelection && address.length > 0;

  function submit() {
    if (!canSubmit) return;
    // 고른 장소를 초안에 넣어 두면 게시글 등록 화면이 마운트하면서 그대로 읽어 간다.
    patchPlaceDraft({ location: { name: initial.name, address, ...center } });
    router.push('/register');
  }

  return (
    <div className="flex min-h-dvh flex-1 flex-col bg-background-screen">
      <AppTopNav title="장소 등록" rightIcon="close" rightIconLabel="닫기" rightHref="/register" />

      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-5 pt-2 pb-6">
        {/* Place Search Field — 탭하면 검색 페이지로 이동(DS Text Field 박스 스타일 차용) */}
        <div className="px-5">
          <button
            type="button"
            onClick={openSearch}
            className="flex h-12 w-full items-center gap-2 rounded-md border border-border-default bg-background-card px-3 text-left"
          >
            <Icon name="search" size={20} className="shrink-0 text-icon-muted" />
            <span
              className={cn(
                'min-w-0 flex-1 truncate text-body-lg',
                hasSelection ? 'text-text-default' : 'text-text-placeholder',
              )}
            >
              {hasSelection ? initial.name : '장소 또는 주소 검색'}
            </span>
          </button>
        </div>

        {/* Map — 핀은 중앙 고정, 지도가 그 아래에서 움직인다(핀 위치 = 지도 중심). */}
        <div className="flex flex-col gap-2">
          <div className="relative h-[360px] w-full overflow-hidden border-y border-border-default bg-background-muted">
            <NaverMap
              lat={center.lat}
              lng={center.lng}
              name={hasSelection ? initial.name : undefined}
              zoom={16}
              centerPin
              onCenterChange={handleCenterChange}
              className="size-full"
            />
          </div>
          <div className="flex items-center gap-2 px-5">
            <Icon name="info" size={16} className="shrink-0 text-icon-muted" />
            <span className="text-label-md text-text-subtle">
              지도를 움직여 핀 위치를 조정할 수 있어요.
            </span>
          </div>
        </div>

        {/* Selected Address Display — 핀이 가리키는 좌표의 지번 주소(리버스 지오코딩) */}
        <div className="px-5">
          <div className="flex h-14 items-center gap-3 border-b border-border-default">
            <Icon name="map-pin" size={20} className="shrink-0 text-icon-brand" />
            {address ? (
              <span className="min-w-0 flex-1 truncate text-body-md text-text-default">
                {address}
              </span>
            ) : (
              <span className="min-w-0 flex-1 truncate text-body-md text-text-placeholder">
                {geocoded.status === 'error'
                  ? (geocoded.error ?? '주소를 불러오지 못했습니다.')
                  : geocoded.status === 'loading'
                    ? '주소를 확인하는 중이에요…'
                    : '주소를 찾을 수 없는 위치예요.'}
              </span>
            )}
            {geocoded.status === 'loading' && (
              <Spinner size={16} aria-label="주소 확인 중" className="shrink-0" />
            )}
          </div>
        </div>

        {/* Submit — 장소명·주소·좌표가 모두 갖춰졌을 때만 열린다. */}
        <div className="flex flex-col gap-2 px-5">
          <Button
            variant="primary"
            size="lg"
            label="이 위치로 등록하기"
            leadingIcon="plus"
            className="w-full"
            disabled={!canSubmit}
            onClick={submit}
          />
          {!canSubmit && (
            <span className="text-label-md text-text-subtle">
              {!hasSelection
                ? '장소를 검색해 선택해 주세요.'
                : '주소를 확인할 수 있는 위치로 지도를 옮겨 주세요.'}
            </span>
          )}
        </div>
      </main>
    </div>
  );
}

export default function PlaceRegisterPage() {
  return (
    <Suspense fallback={<div className="min-h-dvh bg-background-screen" />}>
      <PlaceRegisterContent />
    </Suspense>
  );
}
