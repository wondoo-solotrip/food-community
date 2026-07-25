import type { NextRequest } from 'next/server';

import { badRequest, handleRoute, jsonOk } from '@/lib/api/response';
import { requireUser } from '@/lib/auth';
import { getProfile, updateProfile, type UpdateProfileInput } from '@/lib/profile';

/** GET /api/profile — 로그인 사용자의 프로필 */
export async function GET() {
  return handleRoute(async () => {
    const user = await requireUser();
    return jsonOk({ profile: await getProfile(user.id) });
  });
}

/**
 * PATCH /api/profile — 닉네임 / 프로필 이미지 수정.
 * 이미지가 있으면 multipart/form-data(`nickname`, `image`), 없으면 JSON(`{ nickname }`)으로 받는다.
 */
export async function PATCH(request: NextRequest) {
  return handleRoute(async () => {
    const user = await requireUser();
    const input = request.headers.get('content-type')?.includes('multipart/form-data')
      ? await readFormInput(request)
      : await readJsonInput(request);

    return jsonOk({ profile: await updateProfile(user.id, input) });
  });
}

async function readJsonInput(request: NextRequest): Promise<UpdateProfileInput> {
  const body = (await request.json().catch(() => null)) as { nickname?: unknown } | null;

  if (typeof body?.nickname !== 'string') throw badRequest('닉네임을 입력해주세요.');

  return { nickname: body.nickname };
}

async function readFormInput(request: NextRequest): Promise<UpdateProfileInput> {
  const form = await request.formData().catch(() => null);
  if (!form) throw badRequest('요청 형식이 올바르지 않습니다.');

  const nickname = form.get('nickname');
  const image = form.get('image');

  if (nickname !== null && typeof nickname !== 'string') {
    throw badRequest('닉네임을 입력해주세요.');
  }
  if (image !== null && !(image instanceof File)) {
    throw badRequest('이미지 파일이 올바르지 않습니다.');
  }

  return {
    ...(nickname === null ? {} : { nickname }),
    ...(image === null ? {} : { image }),
  };
}
