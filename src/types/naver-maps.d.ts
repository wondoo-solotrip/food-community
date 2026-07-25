/**
 * 네이버 지도 JS API v3(`maps.js`)의 최소 앰비언트 타입.
 * 스크립트는 런타임에 <script> 로 로드되므로 npm 타입 패키지 없이 여기서 필요한 부분만 선언한다.
 * 전체 API: https://navermaps.github.io/maps.js.ncp/docs/
 */
declare namespace naver.maps {
  class LatLng {
    constructor(lat: number, lng: number);
    lat(): number;
    lng(): number;
  }

  interface MapOptions {
    center?: LatLng;
    zoom?: number;
    /** 지도 우하단 확대/축소 컨트롤 표시 여부 */
    zoomControl?: boolean;
    /** 지도 클릭·드래그 등 조작 허용 여부(false 면 정적 미리보기처럼 동작) */
    draggable?: boolean;
    scrollWheel?: boolean;
    disableDoubleClickZoom?: boolean;
    disableDoubleTapZoom?: boolean;
    pinchZoom?: boolean;
  }

  class Map {
    constructor(element: string | HTMLElement, options?: MapOptions);
    /** 현재 지도 중심. 좌표계가 WGS84 라 `lat()`/`lng()` 를 가진 LatLng 이 돌아온다. */
    getCenter(): LatLng;
    setCenter(latlng: LatLng): void;
    setZoom(zoom: number, effect?: boolean): void;
    destroy(): void;
  }

  interface MarkerOptions {
    position: LatLng;
    map?: Map;
    title?: string;
  }

  class Marker {
    constructor(options: MarkerOptions);
    setPosition(latlng: LatLng): void;
    setMap(map: Map | null): void;
  }

  /** `Event.addListener` 가 돌려주는 해제용 핸들. 내부 구조는 쓰지 않고 그대로 되돌려 준다. */
  interface MapEventListener {
    eventName: string;
  }

  namespace Event {
    /**
     * 지도 이벤트 구독. 지도 이동은 `dragstart`/`dragend`,
     * 이동·확대가 모두 멎은 뒤에는 `idle` 이 한 번 발생한다.
     */
    function addListener(
      target: object,
      eventName: string,
      listener: (...args: never[]) => void,
    ): MapEventListener;
    function removeListener(listener: MapEventListener | MapEventListener[]): void;
  }
}

interface Window {
  naver?: typeof naver;
}
