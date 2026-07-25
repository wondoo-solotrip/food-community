import 'server-only';

/**
 * NCP API 게이트웨이 인증 헤더로 나가는 키 쌍. 지역검색·지도 REST 가 같은 형태를 쓴다.
 */
export interface NaverApiCredentials {
  /** `X-NCP-APIGW-API-KEY-ID` 헤더 값 */
  clientId: string;
  /** `X-NCP-APIGW-API-KEY` 헤더 값 */
  clientSecret: string;
}

/**
 * 네이버 지역검색(NCP API Hub) 인증키 접근 지점.
 *
 * 지도 스크립트 키(`NEXT_PUBLIC_NAVER_MAP_CLIENT_ID`)와 달리 이 값은 서버만 알아야 한다.
 * 브라우저가 지역검색 API 를 직접 부르면 키가 그대로 노출되므로 BFF(`/api/place-search`)가 대신 호출한다.
 */
export const naverSearchEnv = {
  /**
   * 인증키 쌍. 하나라도 비어 있으면 null 을 돌려주고, 호출부가 설정 안내 메시지로 바꿔 준다.
   * (지도 컴포넌트의 `missing-key` 폴백과 같은 성격 — 키가 없다고 서버가 500 으로 죽지 않게 한다.)
   */
  get credentials(): NaverApiCredentials | null {
    const clientId = process.env.NAVER_SEARCH_CLIENT_ID;
    const clientSecret = process.env.NAVER_SEARCH_CLIENT_SECRET;
    if (!clientId || !clientSecret) return null;
    return { clientId, clientSecret };
  },
};

/**
 * 네이버 지도 REST API(리버스 지오코딩) 인증키 접근 지점.
 *
 * 브라우저가 로드하는 `maps.js` 와 같은 Maps Application 의 인증 정보지만,
 * REST 호출에는 Client Secret 이 함께 필요하고 이 값은 서버만 알아야 한다.
 * 그래서 좌표→주소 변환은 BFF(`/api/reverse-geocode`)가 대신 호출한다.
 */
export const naverMapsEnv = {
  /**
   * `X-NCP-APIGW-API-KEY-ID` / `X-NCP-APIGW-API-KEY` 헤더로 나갈 키 쌍.
   *
   * Client ID 는 `maps.js` 의 `ncpKeyId` 와 같은 값이라, 서버 전용 변수를 따로 두지 않았으면
   * `NEXT_PUBLIC_NAVER_MAP_CLIENT_ID` 를 그대로 쓴다(공개돼도 되는 쪽이라 문제없다).
   * Secret 이 없으면 null — 호출부가 설정 안내 메시지로 바꿔 준다.
   */
  get credentials(): NaverApiCredentials | null {
    const clientId = process.env.NAVER_MAP_CLIENT_ID || process.env.NEXT_PUBLIC_NAVER_MAP_CLIENT_ID;
    const clientSecret = process.env.NAVER_MAP_CLIENT_SECRET;
    if (!clientId || !clientSecret) return null;
    return { clientId, clientSecret };
  },
};
