import { ArrowUpRight } from 'lucide-react';
import { notFound } from 'next/navigation';

import { AppTopNav } from '@/components/app/AppTopNav';
import { NaverMap } from '@/components/app/NaverMap';
import { Icon } from '@/components/foundation/Icon';
import { Typography } from '@/components/foundation/Typography';
import { getPlace, type PlaceLocation } from '@/lib/places';
import { findPost } from '@/lib/posts';

interface DetailPageProps {
  params: Promise<{ id: string }>;
}

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** 상세에 필요한 만큼만 추린 뷰 모델. 실데이터(place)와 디자인 목업(post)이 함께 들어온다. */
interface DetailView {
  title: string;
  /** 히어로 캡션에 쓰는 위치 문구 — 실데이터는 지번 주소, 목업은 지역명이다. */
  location: string;
  heroUrl?: string;
  mediaClass?: string;
  bodyTitle: string;
  bodyText: string;
  /** 미니 지도에 세울 좌표·장소명. 지도 정보가 없으면(목업 글) null 이라 지도 섹션을 숨긴다. */
  map: PlaceLocation | null;
}

/**
 * 등록된 맛집(UUID)은 `place` 테이블에서, 디자인 목업 카드(슬러그 id)는 `posts` 에서 읽는다.
 * 목업 데이터에는 좌표가 없어 지도 섹션이 붙지 않는다.
 */
async function findDetail(id: string): Promise<DetailView | null> {
  if (UUID_PATTERN.test(id)) {
    const place = await getPlace(id).catch(() => null);
    if (!place) return null;

    return {
      title: place.title,
      // 지도 연동 이전에 등록된 글만 위치가 비어 있다.
      location: place.location?.address ?? '위치 미등록',
      heroUrl: place.images[0]?.url,
      bodyTitle: place.title,
      bodyText: place.content,
      map: place.location,
    };
  }

  const post = findPost(id);
  if (!post) return null;

  return {
    title: post.title,
    location: post.location,
    heroUrl: post.detailImageUrl ?? post.imageUrl,
    mediaClass: post.mediaClass,
    bodyTitle: post.bodyTitle,
    bodyText: post.bodyText,
    map: null,
  };
}

/** design.pen `02 Detail Page` — 히어로 미디어 + 그라데이션 캡션 + 본문. */
export default async function DetailPage({ params }: DetailPageProps) {
  const { id } = await params;
  const detail = await findDetail(id);
  if (!detail) notFound();

  const { heroUrl, map } = detail;
  // 좌표가 없는 글(목업·지도 연동 이전 글)은 지도를 세울 수 없으므로 섹션을 숨긴다.
  const naverMapUrl = map
    ? `https://map.naver.com/p/search/${encodeURIComponent(`${map.name} ${map.address}`)}`
    : '';

  return (
    <div className="flex min-h-dvh flex-1 flex-col bg-background-screen">
      <AppTopNav title="상세 페이지" leftIcon="chevron-left" leftIconLabel="뒤로 가기" leftHref="/" />

      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col">
        {/* Detail Media Block — 하단 그라데이션 오버레이 + 캡션 */}
        <div
          className={`relative h-[452px] w-full overflow-hidden bg-background-media-placeholder ${detail.mediaClass ?? ''}`}
          style={
            heroUrl ? { backgroundImage: `url(${heroUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' } : undefined
          }
        >
          <div className="absolute inset-x-0 bottom-0 h-40 bg-linear-to-b from-overlay-photo-bottom-start via-overlay-photo-bottom-mid to-overlay-photo-bottom-end" />
          <div className="absolute inset-x-5 bottom-8 flex flex-col gap-3">
            <Typography variant="heading-md" as="h1" className="text-text-inverse">
              {detail.title}
            </Typography>
            <div className="flex items-center gap-1.5 text-alpha-white-60">
              <Icon name="map-pin" size={16} />
              <span className="text-body-lg">{detail.location}</span>
            </div>
          </div>
        </div>

        {/* Detail Mini Map Section — design.pen `02 Detail Page` 위치 섹션 */}
        {map && (
          <div className="w-full px-5 pt-5 pb-6">
            <div className="flex w-full max-w-2xl flex-col gap-4">
              {/* Mini Map Header */}
              <div className="flex items-center justify-between gap-2">
                <Typography variant="heading-md" as="h2">
                  위치
                </Typography>
                {/* #03C75A = 네이버 브랜드 그린(DS 토큰 아님) */}
                <a
                  href={naverMapUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex shrink-0 items-center gap-2 text-label-lg text-[#03C75A]"
                >
                  네이버 지도에서 보기
                  <ArrowUpRight size={16} aria-hidden />
                </a>
              </div>

              {/* Naver Map Embed — DB 에 저장된 좌표에 마커를 세운다(등록 화면과 달리 핀은 고정하지 않는다). */}
              <div className="h-40 w-full overflow-hidden rounded-xl border border-border-default bg-background-muted">
                <NaverMap
                  lat={map.lat}
                  lng={map.lng}
                  name={map.name}
                  zoom={16}
                  className="size-full"
                />
              </div>

              {/* Place name + address */}
              <div className="flex flex-col gap-1">
                <span className="text-label-lg text-text-default">{map.name}</span>
                <div className="flex items-center gap-2">
                  <Icon name="map-pin" size={16} className="shrink-0 text-icon-brand" />
                  <span className="text-body-md text-text-muted">{map.address}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Detail Body */}
        <div className="flex flex-col gap-6 px-5 pt-6 pb-8">
          <Typography variant="heading-md" as="h2">
            {detail.bodyTitle}
          </Typography>
          <Typography variant="body-lg" className="max-w-2xl text-text-muted">
            {detail.bodyText}
          </Typography>
        </div>
      </main>
    </div>
  );
}
