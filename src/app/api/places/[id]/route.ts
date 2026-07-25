import type { NextRequest } from 'next/server';

import {
  isMultipart,
  readFiles,
  readFormData,
  readNumber,
  readString,
  readStrings,
} from '@/lib/api/form';
import { badRequest, handleRoute, jsonOk } from '@/lib/api/response';
import { requireUser } from '@/lib/auth';
import {
  getPlace,
  softDeletePlace,
  updatePlace,
  type PlaceLocationInput,
  type UpdatePlaceInput,
} from '@/lib/places';

/** GET /api/places/:id — 맛집 게시글 상세 */
export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  return handleRoute(async () => {
    const { id } = await params;
    return jsonOk({ place: await getPlace(id) });
  });
}

/**
 * PATCH /api/places/:id — 본인 게시글 수정.
 * 사진을 바꾸면 multipart/form-data(`title`, `content`, `keepImageIds` n개, `images` n개),
 * 글만 고치면 JSON(`{ title?, content?, keepImageIds?, location? }`)으로 받는다.
 *
 * 지도 정보는 양쪽 형식 모두에서 `name`/`address`/`lat`/`lng` 네 값을 함께 보내야 한다
 * (JSON 은 `location` 객체, multipart 는 같은 이름의 필드). 검증은 `updatePlace` 가 한다.
 */
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return handleRoute(async () => {
    const user = await requireUser();
    const { id } = await params;
    const input = isMultipart(request) ? await readFormInput(request) : await readJsonInput(request);

    return jsonOk({ place: await updatePlace(user.id, id, input) });
  });
}

/**
 * DELETE /api/places/:id — 본인 게시글 소프트 삭제.
 * 행은 남기고 `deleted_at` 만 기록하므로 이후 조회에서는 존재하지 않는 글로 취급된다.
 */
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  return handleRoute(async () => {
    const user = await requireUser();
    const { id } = await params;
    await softDeletePlace(user.id, id);

    return jsonOk({ id });
  });
}

async function readJsonInput(request: NextRequest): Promise<UpdatePlaceInput> {
  const body = (await request.json().catch(() => null)) as {
    title?: unknown;
    content?: unknown;
    keepImageIds?: unknown;
    location?: unknown;
  } | null;

  if (!body) throw badRequest('요청 형식이 올바르지 않습니다.');
  if (body.title !== undefined && typeof body.title !== 'string') {
    throw badRequest('제목을 입력해주세요.');
  }
  if (body.content !== undefined && typeof body.content !== 'string') {
    throw badRequest('내용을 입력해주세요.');
  }
  if (
    body.keepImageIds !== undefined &&
    (!Array.isArray(body.keepImageIds) || body.keepImageIds.some((id) => typeof id !== 'string'))
  ) {
    throw badRequest('사진 정보가 올바르지 않습니다.');
  }

  return {
    ...(body.title === undefined ? {} : { title: body.title }),
    ...(body.content === undefined ? {} : { content: body.content }),
    ...(body.keepImageIds === undefined ? {} : { keepImageIds: body.keepImageIds as string[] }),
    ...(body.location === undefined ? {} : { location: toLocationInput(body.location) }),
  };
}

async function readFormInput(request: NextRequest): Promise<UpdatePlaceInput> {
  const form = await readFormData(request);
  const title = readString(form, 'title');
  const content = readString(form, 'content');
  const keepImageIds = readStrings(form, 'keepImageIds');
  const images = readFiles(form, 'images');
  const location: PlaceLocationInput = {
    name: readString(form, 'name'),
    address: readString(form, 'address'),
    lat: readNumber(form, 'lat'),
    lng: readNumber(form, 'lng'),
  };
  // 네 필드 중 하나라도 왔으면 지도 정보를 고치려는 요청이다(모자란 값은 updatePlace 가 막는다).
  const sendsLocation = Object.values(location).some((value) => value !== undefined);

  return {
    ...(title === undefined ? {} : { title }),
    ...(content === undefined ? {} : { content }),
    // 사진을 새로 올렸는데 유지 목록이 없으면 "전부 교체" 의도이므로 빈 배열로 명시한다.
    ...(keepImageIds === undefined && images === undefined ? {} : { keepImageIds: keepImageIds ?? [] }),
    ...(images === undefined ? {} : { images }),
    ...(sendsLocation ? { location } : {}),
  };
}

/** JSON 의 `location` 을 형만 확인해 넘긴다. 값이 모자란지(필수 검증)는 도메인 모듈이 판단한다. */
function toLocationInput(value: unknown): PlaceLocationInput {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    throw badRequest('장소 정보가 올바르지 않습니다.');
  }

  const { name, address, lat, lng } = value as Record<string, unknown>;
  const isText = (field: unknown) => field === undefined || typeof field === 'string';
  const isCoord = (field: unknown) => field === undefined || typeof field === 'number';

  if (!isText(name) || !isText(address) || !isCoord(lat) || !isCoord(lng)) {
    throw badRequest('장소 정보가 올바르지 않습니다.');
  }

  return {
    name: name as string | undefined,
    address: address as string | undefined,
    lat: lat as number | undefined,
    lng: lng as number | undefined,
  };
}
