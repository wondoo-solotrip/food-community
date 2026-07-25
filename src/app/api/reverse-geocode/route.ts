import type { NextRequest } from 'next/server';

import { handleRoute, jsonOk } from '@/lib/api/response';
import { reverseGeocodeAddress } from '@/lib/reverseGeocode';

/**
 * GET /api/reverse-geocode?lat=&lng= — 좌표를 지번 주소로 바꿔 준다.
 * 인증키(Client Secret)는 서버만 알아야 하므로 브라우저는 항상 이 라우트를 거친다.
 */
export async function GET(request: NextRequest) {
  return handleRoute(async () => {
    const params = request.nextUrl.searchParams;
    return jsonOk(await reverseGeocodeAddress(params.get('lat'), params.get('lng')));
  });
}
