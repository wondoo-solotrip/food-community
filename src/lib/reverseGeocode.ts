import 'server-only';

import { ApiError, badRequest } from '@/lib/api/response';
import { naverMapsEnv } from '@/lib/naver/env';

/**
 * 네이버 리버스 지오코딩(좌표 → 주소) 도메인 모듈.
 * 실제 호출은 여기서만 하고, Route Handler(`/api/reverse-geocode`)는 얇게 유지한다.
 *
 * 참고: https://api.ncloud-docs.com/docs/en/application-maps-reversegeocoding
 */
const REVERSE_GEOCODE_ENDPOINT = 'https://maps.apigw.ntruss.com/map-reversegeocode/v2/gc';

/**
 * 지번 주소만 요청한다(`addr`). 도로명(`roadaddr`)은 화면에서 쓰지 않는다.
 * 결과가 여러 개 올 수 있어 아래에서 `name === 'addr'` 인 항목만 골라 쓴다.
 */
const ORDERS = 'addr';

/** 응답 `status.code` — 0: 정상, 3: 해당 좌표에 주소 없음(에러가 아니다). */
const STATUS_OK = 0;
const STATUS_NO_RESULTS = 3;

/** BFF 밖으로 나가는 주소. 클라이언트는 네이버 원본 필드명을 보지 않는다. */
export interface ReverseGeocodedAddress {
  /** 행정구역 + 번지를 합친 지번 주소. 좌표에 주소가 없으면 빈 문자열. */
  address: string;
  /** 행정구역만 (예: `서울특별시 중구 태평로1가`) */
  region: string;
  /** 번지만 (예: `31`, `31-2`, `산 12`). 없으면 빈 문자열. */
  lotNumber: string;
}

interface NaverArea {
  name?: string;
}

interface NaverLand {
  /** `1`: 일반 지번, `2`: 산 지번 */
  type?: string;
  /** 본번 */
  number1?: string;
  /** 부번 */
  number2?: string;
}

interface NaverGcResult {
  /** 요청한 `orders` 중 어떤 결과인지 — `addr` / `roadaddr` / `legalcode` / `admcode` */
  name?: string;
  region?: {
    area1?: NaverArea;
    area2?: NaverArea;
    area3?: NaverArea;
    area4?: NaverArea;
  };
  land?: NaverLand;
}

interface NaverGcBody {
  status?: { code?: number; name?: string; message?: string };
  results?: NaverGcResult[];
}

const failure = () =>
  new ApiError('REVERSE_GEOCODE_FAILED', '주소를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.', 502);

/** 시/도 → 시/군/구 → 읍/면/동 → 리 순으로 이어 붙인다. 비어 있는 단계는 건너뛴다. */
function toRegion(region: NaverGcResult['region']): string {
  return [region?.area1, region?.area2, region?.area3, region?.area4]
    .map((area) => area?.name?.trim() ?? '')
    .filter(Boolean)
    .join(' ');
}

/**
 * 번지 조립 — 본번(`number1`)에 부번(`number2`)이 있으면 `본번-부번`.
 * `type === '2'` 는 산 지번이라 관례대로 `산` 을 앞에 붙인다.
 */
function toLotNumber(land: NaverLand | undefined): string {
  const number1 = land?.number1?.trim();
  if (!number1) return '';

  const number2 = land?.number2?.trim();
  const lot = number2 ? `${number1}-${number2}` : number1;
  return land?.type === '2' ? `산 ${lot}` : lot;
}

/** 위경도 문자열 검증 — 값이 없거나 범위를 벗어나면 400 으로 끊는다. */
function toCoordinate(raw: string | null, limit: number, label: string): number {
  const value = Number(raw);
  if (raw === null || raw.trim() === '' || !Number.isFinite(value) || Math.abs(value) > limit) {
    throw badRequest(`${label} 값이 올바르지 않습니다.`);
  }
  return value;
}

/**
 * 좌표를 지번 주소로 바꾼다.
 *
 * 주소가 없는 좌표(바다 위 등)는 에러가 아니라 빈 주소로 돌려주고, 화면이 안내 문구를 고른다.
 * 네이버 원본 에러/응답은 로그로만 남기고 클라이언트에는 정규화한 메시지를 준다.
 */
export async function reverseGeocodeAddress(
  rawLat: string | null,
  rawLng: string | null,
): Promise<ReverseGeocodedAddress> {
  const lat = toCoordinate(rawLat, 90, '위도');
  const lng = toCoordinate(rawLng, 180, '경도');

  const credentials = naverMapsEnv.credentials;
  if (!credentials) {
    throw new ApiError(
      'REVERSE_GEOCODE_UNAVAILABLE',
      '네이버 지도 REST 키가 설정되지 않았어요. (NAVER_MAP_CLIENT_SECRET)',
      503,
    );
  }

  const url = new URL(REVERSE_GEOCODE_ENDPOINT);
  // coords 는 `경도,위도` 순서다(위도가 먼저가 아니다).
  url.searchParams.set('coords', `${lng},${lat}`);
  url.searchParams.set('orders', ORDERS);
  url.searchParams.set('output', 'json');

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
    console.error('[naver] 리버스 지오코딩 요청 실패', error);
    throw failure();
  }

  if (!response.ok) {
    const detail = await response.text().catch(() => '');
    console.error('[naver] 리버스 지오코딩 응답 오류', response.status, detail);
    throw failure();
  }

  const body = (await response.json().catch(() => null)) as NaverGcBody | null;
  if (!body) {
    console.error('[naver] 리버스 지오코딩 응답 해석 실패');
    throw failure();
  }

  const code = body.status?.code;
  if (code === STATUS_NO_RESULTS) {
    return { address: '', region: '', lotNumber: '' };
  }
  if (code !== STATUS_OK) {
    console.error('[naver] 리버스 지오코딩 상태 오류', body.status);
    throw failure();
  }

  const result = body.results?.find((item) => item.name === 'addr');
  const region = toRegion(result?.region);
  const lotNumber = toLotNumber(result?.land);

  return {
    // 번지는 행정구역 뒤에 붙는다. 둘 중 하나만 있어도 있는 쪽만 내보낸다.
    address: [region, lotNumber].filter(Boolean).join(' '),
    region,
    lotNumber,
  };
}
