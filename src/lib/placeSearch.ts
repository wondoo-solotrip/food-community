import 'server-only';

import { ApiError, badRequest } from '@/lib/api/response';
import { naverSearchEnv } from '@/lib/naver/env';

/**
 * 네이버 지역검색(NCP API Hub) 도메인 모듈.
 * 실제 호출은 여기서만 하고, Route Handler(`/api/place-search`)는 얇게 유지한다.
 *
 * 참고: https://api.ncloud-docs.com/docs/naver-api-hub-search-local
 */
const LOCAL_SEARCH_ENDPOINT = 'https://naverapihub.apigw.ntruss.com/search/v1/local';

/** 지역검색은 한 번에 최대 5건까지만 내려준다(API 제한). */
const MAX_DISPLAY = 5;

/** BFF 밖으로 나가는 검색 결과. 클라이언트는 네이버 원본 필드명을 보지 않는다. */
export interface PlaceSearchResult {
  /** 리스트 key 용 식별자. 지역검색은 안정적인 id 를 주지 않아 좌표+순번으로 만든다. */
  id: string;
  /** 장소명 — 원본 `title` 의 `<b>` 강조 태그를 걷어낸 값 */
  name: string;
  /** 지번 주소 — 원본 `address` */
  address: string;
  /** 도로명 주소 — 원본 `roadAddress` */
  roadAddress: string;
  /** 분류(예: `음식점>카페`) */
  category: string;
  /** 위도(WGS84) — 원본 `mapy` 변환값 */
  lat: number;
  /** 경도(WGS84) — 원본 `mapx` 변환값 */
  lng: number;
}

interface NaverLocalItem {
  title?: string;
  link?: string;
  category?: string;
  description?: string;
  telephone?: string;
  address?: string;
  roadAddress?: string;
  mapx?: string;
  mapy?: string;
}

const HTML_ENTITIES: Record<string, string> = {
  '&amp;': '&',
  '&lt;': '<',
  '&gt;': '>',
  '&quot;': '"',
  '&#39;': "'",
  '&apos;': "'",
  '&nbsp;': ' ',
};

/** 지역검색 `title` 은 검색어가 `<b>` 로 감싸진 HTML 조각이라 평문으로 되돌린다. */
function toPlainText(value: string | undefined): string {
  if (!value) return '';
  return value
    .replace(/<[^>]*>/g, '')
    .replace(/&[a-z]+;|&#\d+;/gi, (entity) => HTML_ENTITIES[entity.toLowerCase()] ?? entity)
    .trim();
}

/**
 * `mapx`(경도) / `mapy`(위도) → 지도에서 쓰는 WGS84 실수 좌표.
 *
 * 지역검색은 WGS84 를 1e7 배한 정수 문자열로 준다(예: `"1269779000"` → `126.9779`).
 * 혹시 소수점 형태로 내려오는 경우도 있어 경위도 범위를 벗어날 때만 나눈다.
 */
function toCoordinate(raw: string | undefined): number | null {
  const value = Number(raw);
  if (!Number.isFinite(value) || value === 0) return null;
  return Math.abs(value) > 1000 ? value / 1e7 : value;
}

function toResult(item: NaverLocalItem, index: number): PlaceSearchResult | null {
  const name = toPlainText(item.title);
  const lat = toCoordinate(item.mapy);
  const lng = toCoordinate(item.mapx);
  // 이름이나 좌표가 없으면 지도에 세울 수 없으니 결과에서 뺀다.
  if (!name || lat === null || lng === null) return null;

  return {
    id: `${item.mapx ?? 'x'}-${item.mapy ?? 'y'}-${index}`,
    name,
    address: toPlainText(item.address),
    roadAddress: toPlainText(item.roadAddress),
    category: toPlainText(item.category),
    lat,
    lng,
  };
}

/**
 * 검색어로 주변 장소를 찾는다. 결과가 없으면 빈 배열(에러 아님) — 화면은 직접입력으로 넘어간다.
 * 네이버 원본 에러/응답은 로그로만 남기고 클라이언트에는 정규화한 메시지를 준다.
 */
export async function searchLocalPlaces(query: string): Promise<PlaceSearchResult[]> {
  const keyword = query.trim();
  if (!keyword) throw badRequest('검색어를 입력해 주세요.');

  const credentials = naverSearchEnv.credentials;
  if (!credentials) {
    throw new ApiError(
      'PLACE_SEARCH_UNAVAILABLE',
      '네이버 지역검색 키가 설정되지 않았어요. (NAVER_SEARCH_CLIENT_ID / NAVER_SEARCH_CLIENT_SECRET)',
      503,
    );
  }

  const url = new URL(LOCAL_SEARCH_ENDPOINT);
  url.searchParams.set('query', keyword);
  url.searchParams.set('display', String(MAX_DISPLAY));

  let response: Response;
  try {
    response = await fetch(url, {
      headers: {
        'X-NCP-APIGW-API-KEY-ID': credentials.clientId,
        'X-NCP-APIGW-API-KEY': credentials.clientSecret,
      },
      cache: 'no-store',
    });
  } catch (error) {
    console.error('[naver] 지역검색 요청 실패', error);
    throw new ApiError('PLACE_SEARCH_FAILED', '장소 검색에 실패했습니다. 잠시 후 다시 시도해 주세요.', 502);
  }

  if (!response.ok) {
    const detail = await response.text().catch(() => '');
    console.error('[naver] 지역검색 응답 오류', response.status, detail);
    throw new ApiError('PLACE_SEARCH_FAILED', '장소 검색에 실패했습니다. 잠시 후 다시 시도해 주세요.', 502);
  }

  const body = (await response.json().catch(() => null)) as { items?: NaverLocalItem[] } | null;
  if (!body) {
    console.error('[naver] 지역검색 응답 해석 실패');
    throw new ApiError('PLACE_SEARCH_FAILED', '장소 검색에 실패했습니다. 잠시 후 다시 시도해 주세요.', 502);
  }

  return (body.items ?? [])
    .map(toResult)
    .filter((result): result is PlaceSearchResult => result !== null);
}
