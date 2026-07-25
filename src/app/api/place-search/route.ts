import type { NextRequest } from 'next/server';

import { handleRoute, jsonOk } from '@/lib/api/response';
import { searchLocalPlaces } from '@/lib/placeSearch';

/**
 * GET /api/place-search?query=… — 네이버 지역검색 결과(최대 5건).
 * 인증키는 서버만 알아야 하므로 브라우저는 항상 이 라우트를 거친다.
 */
export async function GET(request: NextRequest) {
  return handleRoute(async () => {
    const query = request.nextUrl.searchParams.get('query') ?? '';
    return jsonOk({ results: await searchLocalPlaces(query) });
  });
}
