/**
 * 장소 선택 상태 — 장소 등록(`/register/place`) ↔ 장소 검색(`/register/place/search`) 사이를
 * 쿼리스트링으로 오간다. 둘은 서로 다른 라우트라 컴포넌트 상태로는 값이 유지되지 않는다.
 *
 * 서버/클라이언트 양쪽에서 쓰는 순수 모듈이라 `server-only` 를 붙이지 않는다.
 */
export interface PlaceSelection {
  /** 검색창에 표시할 이름. 선택한 장소명이거나, 결과가 없어 직접 입력한 단어다. */
  name: string;
  /** 지번 주소(지역검색 `address`) — 주소 영역에 표시한다. */
  address: string;
  /** 위도(WGS84) — 지도 중심 */
  lat: number;
  /** 경도(WGS84) */
  lng: number;
}

/**
 * 아직 아무 장소도 고르지 않았을 때의 기본값 — 서울시청.
 *
 * 검색 결과가 없어 장소명만 직접 입력한 경우에도 주소/좌표는 직전 선택값(없으면 이 기본값)을
 * 그대로 유지한다. 그 뒤 장소 등록 화면에서 지도를 움직이면 좌표와 주소가 함께 갱신된다.
 */
export const DEFAULT_PLACE_SELECTION: PlaceSelection = {
  name: '',
  address: '서울특별시 중구 태평로1가 31',
  lat: 37.5663,
  lng: 126.9779,
};

/** `useSearchParams()`(ReadonlyURLSearchParams)와 `URLSearchParams` 둘 다 받기 위한 최소 형태. */
type ReadableParams = { get(name: string): string | null };

function coordinate(raw: string | null, fallback: number): number {
  const value = Number(raw);
  // 빈 값·문자열은 NaN 또는 0 이 된다. 국내 좌표에 0 은 없으므로 함께 걸러낸다.
  return Number.isFinite(value) && value !== 0 ? value : fallback;
}

export function parsePlaceSelection(params: ReadableParams): PlaceSelection {
  return {
    name: params.get('name')?.trim() || DEFAULT_PLACE_SELECTION.name,
    address: params.get('addr')?.trim() || DEFAULT_PLACE_SELECTION.address,
    lat: coordinate(params.get('lat'), DEFAULT_PLACE_SELECTION.lat),
    lng: coordinate(params.get('lng'), DEFAULT_PLACE_SELECTION.lng),
  };
}

export function placeSelectionQuery(selection: PlaceSelection): string {
  return new URLSearchParams({
    name: selection.name,
    addr: selection.address,
    lat: String(selection.lat),
    lng: String(selection.lng),
  }).toString();
}
