import Link from 'next/link';

import { AppBottomNav } from '@/components/app/AppBottomNav';
import { WriteFab } from '@/components/app/WriteFab';
import { Typography } from '@/components/foundation/Typography';
import { Empty } from '@/components/ui/Empty';
import { FoodCard } from '@/components/ui/FoodCard';
import { TextField } from '@/components/ui/TextField';
import { listPlaces, type Place } from '@/lib/places';

/**
 * 목록은 상세 페이지와 같은 방식으로 읽는다: Server Component 에서 서버 모듈 직접 호출.
 * 조회 실패는 화면 전체를 죽이지 않고 빈 목록 + 안내로 처리한다.
 */
async function loadPlaces(): Promise<{ places: Place[]; failed: boolean }> {
  try {
    return { places: await listPlaces(), failed: false };
  } catch (error) {
    console.error('[main] 맛집 목록 조회 실패', error);
    return { places: [], failed: true };
  }
}

/** design.pen `01 Main Page` — 모바일 2열 → 태블릿 3열 → 데스크톱 4열(최대 1280px) 카드 그리드. */
export default async function MainPage() {
  const { places, failed } = await loadPlaces();

  return (
    <div className="flex min-h-dvh flex-1 flex-col bg-background-screen">
      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 px-5 pt-2 pb-6">
        {/* Main Hero */}
        <div className="flex flex-col gap-3">
          <Typography variant="heading-md" as="h1">
            오늘 뭐 먹을까요?
          </Typography>
          <TextField
            label="검색"
            placeholder="음식, 식당, 레시피 검색"
            leadingIcon="search"
          />
        </div>

        {/* Popular Section */}
        <section className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <Typography variant="heading-md" as="h2">
              인기 게시글
            </Typography>
            <span className="text-label-lg text-text-brand">전체</span>
          </div>

          {places.length === 0 ? (
            <Empty
              visualIcon="utensils"
              title={failed ? '목록을 불러오지 못했어요' : '아직 등록된 맛집이 없어요'}
              description={
                failed
                  ? '잠시 후 다시 시도해 주세요.'
                  : '첫 번째 숨은 맛집을 이웃과 나눠보세요.'
              }
            />
          ) : (
            <div className="grid grid-cols-2 gap-x-3 gap-y-4 md:grid-cols-3 xl:grid-cols-4">
              {places.map((place) => (
                <Link key={place.id} href={`/posts/${place.id}`} className="flex flex-col">
                  {/* 위치가 비어 있는 건 지도 연동 이전에 등록된 글뿐이다. */}
                  <FoodCard
                    className="flex-1"
                    title={place.title}
                    location={place.location?.address ?? '위치 미등록'}
                    media={
                      place.images[0] ? (
                        <div
                          className="size-full bg-cover bg-center"
                          style={{ backgroundImage: `url(${place.images[0].url})` }}
                        />
                      ) : undefined
                    }
                  />
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* Floating Write Shortcut — 디자인상 그리드 하단 좌측 정렬 */}
        <div className="self-start">
          <WriteFab />
        </div>
      </main>

      <AppBottomNav selectedIndex={0} />
    </div>
  );
}
