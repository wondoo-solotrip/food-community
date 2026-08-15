import Link from 'next/link';

import { AppBottomNav } from '@/components/app/AppBottomNav';
import { WriteFab } from '@/components/app/WriteFab';
import { Typography } from '@/components/foundation/Typography';
import { Empty } from '@/components/ui/Empty';
import { FoodCard } from '@/components/ui/FoodCard';
import { TextField } from '@/components/ui/TextField';
import { listPlaces, type Place } from '@/lib/places';
import { listProducts, type Product } from '@/lib/products';

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

/** 배너 상품 조회가 실패해도 화면 전체를 죽이지 않는다 — 배너만 숨긴다. */
async function loadBannerProduct(): Promise<Product | null> {
  try {
    return (await listProducts())[0] ?? null;
  } catch (error) {
    console.error('[main] 상품 배너 조회 실패', error);
    return null;
  }
}

/** design.pen `01 Main Page` — 모바일 2열 → 태블릿 3열 → 데스크톱 4열(최대 1280px) 카드 그리드. */
export default async function MainPage() {
  const [{ places, failed }, bannerProduct] = await Promise.all([
    loadPlaces(),
    loadBannerProduct(),
  ]);

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

        {/* Paid Event Banner — 최신 공개 상품의 배너 이미지(image_path_main) 한 장을 통짜로 채운다.
            문구·CTA 는 이미지에 포함돼 있다. 원본은 2:1 비율이라 그대로 두되, 넓은 화면에서
            지나치게 커지지 않게 높이를 320px 에서 멈추고 가운데를 남기며 자른다. */}
        {bannerProduct && (
          <Link
            href={`/events/${bannerProduct.id}`}
            aria-label={`${bannerProduct.name} 모임 상세 보기`}
            className="block w-full overflow-hidden rounded-xl bg-brand-100"
          >
            <div
              className="aspect-[2/1] max-h-80 w-full bg-cover bg-center"
              style={{ backgroundImage: `url(${bannerProduct.bannerImageUrl})` }}
            />
          </Link>
        )}

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
