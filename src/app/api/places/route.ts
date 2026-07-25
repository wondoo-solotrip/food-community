import type { NextRequest } from 'next/server';

import { isMultipart, readFiles, readFormData, readNumber, readString } from '@/lib/api/form';
import { badRequest, handleRoute, jsonOk } from '@/lib/api/response';
import { requireUser } from '@/lib/auth';
import { createPlace, listPlaces, listPlacesByUser } from '@/lib/places';

/** GET /api/places — 전체 목록. `?mine=true` 면 로그인 사용자의 게시글만. */
export async function GET(request: NextRequest) {
  return handleRoute(async () => {
    const mine = request.nextUrl.searchParams.get('mine') === 'true';

    if (mine) {
      const user = await requireUser();
      return jsonOk({ places: await listPlacesByUser(user.id) });
    }

    return jsonOk({ places: await listPlaces() });
  });
}

/**
 * POST /api/places — 맛집 게시글 등록.
 * 사진이 1장 이상 필수이므로 multipart/form-data 로만 받는다.
 * 필드: `title`, `content`, `images` n개, 그리고 지도 정보(`name`, `address`, `lat`, `lng`).
 * 지도 정보는 네 값을 모두 보내야 하며, 비면 `createPlace` 가 400 으로 막는다.
 */
export async function POST(request: NextRequest) {
  return handleRoute(async () => {
    const user = await requireUser();

    if (!isMultipart(request)) {
      throw badRequest('사진을 포함해 multipart/form-data 로 요청해주세요.');
    }

    const form = await readFormData(request);
    const place = await createPlace(user.id, {
      title: readString(form, 'title') ?? '',
      content: readString(form, 'content') ?? '',
      images: readFiles(form, 'images') ?? [],
      location: {
        name: readString(form, 'name'),
        address: readString(form, 'address'),
        lat: readNumber(form, 'lat'),
        lng: readNumber(form, 'lng'),
      },
    });

    return jsonOk({ place }, 201);
  });
}
