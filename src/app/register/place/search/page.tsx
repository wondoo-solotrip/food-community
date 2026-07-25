'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { AppTopNav } from '@/components/app/AppTopNav';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { TextField } from '@/components/ui/TextField';
import { Icon } from '@/components/foundation/Icon';
import { ApiClientError, apiFetch } from '@/lib/api/client';
import type { PlaceSearchResult } from '@/lib/placeSearch';
import { parsePlaceSelection, placeSelectionQuery } from '@/lib/placeSelection';

/** 입력이 멈춘 뒤 검색을 쏘기까지의 대기 시간(ms). 타이핑 중 매 글자 호출을 막는다. */
const SEARCH_DEBOUNCE_MS = 300;

type SearchStatus = 'idle' | 'loading' | 'done' | 'error';

/** 응답이 도착한 검색 1회분. `query` 를 함께 들고 있어야 현재 검색어의 결과인지 판별할 수 있다. */
interface SettledSearch {
  query: string;
  results: PlaceSearchResult[];
  /** 실패 메시지. 성공이면 null 이고, 이때 `results` 가 0개면 결과없음(직접입력) 상태다. */
  error: string | null;
}

/** 네이버 지역검색 API 출처 표기 — #03C75A 는 네이버 브랜드 그린(DS 토큰 아님). */
function NaverAttribution() {
  return (
    <div className="flex items-center gap-[5px]">
      <span className="flex size-[18px] items-center justify-center rounded-[4px] bg-[#03C75A] text-[11px] font-bold text-white">
        N
      </span>
      <span className="text-label-md text-text-subtle">네이버 지역검색</span>
    </div>
  );
}

/** 정보 아이콘 + 안내 문구 한 줄 — 결과/직접입력 하단 도움말 공통. */
function HelperLine({ children }: { children: string }) {
  return (
    <div className="flex items-center gap-2">
      <Icon name="info" size={16} className="shrink-0 text-icon-muted" />
      <span className="text-label-md text-text-subtle">{children}</span>
    </div>
  );
}

/** 아이콘 + 문구만 있는 중앙 안내(초기·로딩·에러 공통). */
function CenterNotice({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-2 pb-16 text-center">
      {children}
    </div>
  );
}

/**
 * design.pen `07 Place Search Results` + `08 Place Search Empty Direct Entry`.
 * 검색어를 BFF(`/api/place-search`)로 보내 네이버 지역검색 결과를 받아오고,
 * 결과 리스트 / 결과없음+직접입력 상태를 오간다.
 *
 * 어느 쪽으로 끝나든 선택값을 쿼리스트링에 실어 장소 등록 화면으로 되돌려 준다.
 * - 결과 선택: 장소명 + 지번주소 + 좌표(mapy→lat, mapx→lng)
 * - 직접 입력: 장소명만 교체하고 주소·좌표는 들어올 때 받은 값을 그대로 유지
 */
function PlaceSearchContent() {
  const router = useRouter();
  const params = useSearchParams();
  // 장소 등록 화면에서 넘겨준 현재 선택값(없으면 기본값). 직접입력 시 주소/좌표의 원본이 된다.
  const current = parsePlaceSelection(params);

  const [query, setQuery] = useState(current.name);
  // 어떤 검색어의 결과인지까지 함께 담아 둔다. 검색어가 앞서 나가면 아래에서 로딩으로 취급해
  // 이전 검색어의 결과가 잠깐 남아 보이는 일이 없다.
  const [settled, setSettled] = useState<SettledSearch | null>(null);
  // 직접입력 필드는 기본적으로 검색어를 따라가고(결과없음 → 바로 직접 등록 유도),
  // 사용자가 직접 고치면 그 값을 유지한다. (override === null 이면 검색어를 그대로 사용)
  const [directNameOverride, setDirectNameOverride] = useState<string | null>(null);

  const trimmed = query.trim();
  const directName = directNameOverride ?? trimmed;

  // 검색어가 멈추면 BFF 로 조회한다. 입력이 이어지면 대기 중이던 요청은 취소한다.
  useEffect(() => {
    if (!trimmed) return;

    const controller = new AbortController();
    const timer = setTimeout(() => {
      apiFetch<{ results: PlaceSearchResult[] }>(
        `/api/place-search?query=${encodeURIComponent(trimmed)}`,
        { signal: controller.signal },
      )
        .then((data) => setSettled({ query: trimmed, results: data.results, error: null }))
        .catch((error: unknown) => {
          if (controller.signal.aborted) return;
          setSettled({
            query: trimmed,
            results: [],
            error: error instanceof ApiClientError ? error.message : '장소를 검색하지 못했습니다.',
          });
        });
    }, SEARCH_DEBOUNCE_MS);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [trimmed]);

  // 현재 검색어의 결과가 아직 없으면(디바운스 대기·요청 중) 로딩이다.
  const matched = settled?.query === trimmed ? settled : null;
  const status: SearchStatus = !trimmed
    ? 'idle'
    : !matched
      ? 'loading'
      : matched.error
        ? 'error'
        : 'done';

  const results = matched?.results ?? [];
  const showResults = status === 'done' && results.length > 0;
  const showEmpty = status === 'done' && results.length === 0;

  /** 결과 선택 — 장소명·지번주소·좌표를 모두 장소 등록 화면으로 돌려준다. */
  function selectPlace(result: PlaceSearchResult) {
    const selection = placeSelectionQuery({
      name: result.name,
      // 지번주소가 기본이지만 비어 오는 항목이 있어, 그때는 기본값으로 떨어지지 않게 도로명으로 채운다.
      address: result.address || result.roadAddress,
      lat: result.lat,
      lng: result.lng,
    });
    // replace 라서 등록 화면에서 뒤로 가면 검색 화면이 아니라 게시글 등록으로 빠진다.
    router.replace(`/register/place?${selection}`);
  }

  /** 직접 입력 — 이름만 바꾸고 주소/좌표는 들어올 때 받은 값을 유지한다. */
  function registerDirect() {
    const name = directName.trim();
    if (!name) return;
    router.replace(`/register/place?${placeSelectionQuery({ ...current, name })}`);
  }

  return (
    <div className="flex min-h-dvh flex-1 flex-col bg-background-screen">
      <AppTopNav
        title="장소 검색"
        leftIcon="chevron-left"
        leftIconLabel="뒤로 가기"
        // 뒤로 갈 때도 선택값을 잃지 않도록 현재 값을 그대로 실어 보낸다.
        leftHref={`/register/place?${placeSelectionQuery(current)}`}
        rightIcon="close"
        rightIconLabel="닫기"
        rightHref="/register"
      />

      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-4 px-5 pt-3 pb-6">
        {/* Focused Search Field — 라벨 없는 검색 바(DS Text Field 박스 스타일 차용) */}
        <div className="flex h-12 items-center gap-2 rounded-md border-2 border-border-brand bg-background-card px-3">
          <Icon name="search" size={20} className="text-icon-brand" />
          <input
            autoFocus
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="장소 또는 주소를 검색하세요"
            aria-label="장소 또는 주소 검색"
            className="min-w-0 flex-1 bg-transparent text-body-lg text-text-default outline-none placeholder:text-text-placeholder [&::-webkit-search-cancel-button]:appearance-none"
          />
          {status === 'loading' && <Spinner size={20} aria-label="검색 중" />}
        </div>

        {/* 초기(검색어 없음) 안내 */}
        {status === 'idle' && (
          <CenterNotice>
            <Icon name="search" size={24} className="text-icon-muted" />
            <span className="text-body-md text-text-subtle">
              장소명 또는 주소를 입력해 검색해 주세요.
            </span>
          </CenterNotice>
        )}

        {/* 검색 중 */}
        {status === 'loading' && (
          <CenterNotice>
            <Spinner size={24} />
            <span className="text-body-md text-text-subtle">장소를 찾는 중이에요…</span>
          </CenterNotice>
        )}

        {/* 검색 실패 — 결과없음(직접입력)과 구분해서 재시도를 유도한다. */}
        {status === 'error' && (
          <CenterNotice>
            <Icon name="info" size={24} className="text-icon-muted" />
            <span className="text-body-md text-text-subtle">
              {matched?.error ?? '장소를 검색하지 못했습니다.'}
            </span>
          </CenterNotice>
        )}

        {/* 결과 있음 */}
        {showResults && (
          <>
            <div className="flex items-center justify-between">
              <span className="text-label-lg text-text-default">검색 결과 {results.length}개</span>
              <NaverAttribution />
            </div>

            <ul className="overflow-hidden rounded-lg border border-border-default bg-background-card">
              {results.map((result) => (
                <li key={result.id}>
                  <button
                    type="button"
                    onClick={() => selectPlace(result)}
                    className="flex h-[76px] w-full items-center gap-3 border-b border-border-default px-3 text-left last:border-b-0 hover:bg-background-surface"
                  >
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-background-brand-subtle">
                      <Icon name="map-pin" size={20} className="text-icon-brand" />
                    </span>
                    <span className="flex min-w-0 flex-1 items-center justify-between gap-3">
                      <span className="flex min-w-0 flex-col gap-1">
                        <span className="truncate text-body-lg font-semibold text-text-default">
                          {result.name}
                        </span>
                        <span className="truncate text-body-md text-text-muted">
                          {result.address}
                        </span>
                      </span>
                      <Icon name="chevron-right" size={20} className="shrink-0 text-icon-muted" />
                    </span>
                  </button>
                </li>
              ))}
            </ul>

            <HelperLine>원하는 장소를 선택하면 지도에서 위치를 확인할 수 있어요.</HelperLine>
          </>
        )}

        {/* 결과 없음 + 직접 입력 */}
        {showEmpty && (
          <>
            <div className="flex justify-end">
              <NaverAttribution />
            </div>

            {/* No Results Empty State — 검색 전용 muted 비주얼(DS Empty 의 inverse 박스와 다름) */}
            <div className="flex flex-col items-center justify-center gap-[18px] rounded-lg border border-border-default bg-background-card p-6">
              <div className="flex size-14 items-center justify-center rounded-lg bg-background-muted">
                <Icon name="search" size={24} className="text-icon-muted" />
              </div>
              <div className="flex flex-col items-center gap-2">
                <span className="text-center text-heading-sm text-text-default">
                  검색 결과가 없어요
                </span>
                <span className="text-center text-body-md text-text-muted">
                  검색어를 다시 확인하거나 아래에서 장소명을 직접 입력해 주세요.
                </span>
              </div>
            </div>

            {/* Direct Place Entry Section */}
            <div className="flex flex-col gap-4 rounded-lg border border-border-brand bg-background-brand-subtle p-4">
              <div className="flex items-center justify-between gap-2">
                <span className="text-label-lg text-text-default">장소명 직접 입력</span>
                <span className="inline-flex h-6 shrink-0 items-center rounded-full bg-background-card px-2.5 text-label-md font-semibold text-text-brand">
                  기본 위치로 등록
                </span>
              </div>
              <TextField
                size="lg"
                label="장소명"
                placeholder="장소명을 입력하세요"
                value={directName}
                onChange={(event) => setDirectNameOverride(event.target.value)}
              />
              <Button
                variant="primary"
                size="lg"
                label="장소명으로 등록하기"
                className="w-full"
                disabled={directName.trim().length === 0}
                onClick={registerDirect}
              />
            </div>

            <HelperLine>직접 입력한 장소는 지도에 표시된 현재 위치를 그대로 사용해요.</HelperLine>
          </>
        )}
      </main>
    </div>
  );
}

export default function PlaceSearchPage() {
  return (
    <Suspense fallback={<div className="min-h-dvh bg-background-screen" />}>
      <PlaceSearchContent />
    </Suspense>
  );
}
