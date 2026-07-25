import 'server-only';

import { ApiError, badRequest } from '@/lib/api/response';
import { supabaseEnv } from '@/lib/supabase/env';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { publicStorageUrl } from '@/lib/supabase/storage';

/** BFF 밖으로 나가는 프로필 모델. DB 컬럼명(image_path)은 클라이언트가 보지 않는다. */
export interface Profile {
  id: string;
  userId: string;
  nickname: string | null;
  imageUrl: string | null;
  createdAt: string;
}

/** 프로필 수정 입력. 넘어온 필드만 반영한다(부분 수정). */
export interface UpdateProfileInput {
  nickname?: string;
  image?: File;
}

const PROFILE_SELECT = 'id, user_id, nickname, image_path, created_at';

const NICKNAME_MAX_LENGTH = 20;
const IMAGE_MAX_BYTES = 5 * 1024 * 1024;
/** 허용 이미지 타입 → 저장 확장자. uuid 파일명에 붙일 확장자를 여기서만 결정한다. */
const IMAGE_EXTENSIONS: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
};

type ProfileRow = {
  id: string;
  user_id: string;
  nickname: string | null;
  image_path: string | null;
  created_at: string;
};

/** 소셜 로그인 아바타는 절대 URL, 직접 업로드한 이미지는 Storage 경로로 저장된다. */
function toImageUrl(path: string | null): string | null {
  if (!path) return null;
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  return publicStorageUrl(supabaseEnv.profileImageBucket, path);
}

/** Storage 에 실제로 올라간 파일만 삭제 대상이다(소셜 아바타 URL 은 제외). */
function isStoragePath(path: string | null | undefined): path is string {
  return !!path && !path.startsWith('http://') && !path.startsWith('https://');
}

function toProfile(row: ProfileRow): Profile {
  return {
    id: row.id,
    userId: row.user_id,
    nickname: row.nickname,
    imageUrl: toImageUrl(row.image_path),
    createdAt: row.created_at,
  };
}

function fail(scope: string, error: unknown): never {
  console.error(`[profile] ${scope} 실패`, error);
  throw new ApiError('PROFILE_QUERY_FAILED', '프로필 정보를 불러오지 못했습니다.', 500);
}

function normalizeNickname(nickname: string): string {
  const trimmed = nickname.trim();
  if (!trimmed) throw badRequest('닉네임을 입력해주세요.');
  if (trimmed.length > NICKNAME_MAX_LENGTH) {
    throw badRequest(`닉네임은 ${NICKNAME_MAX_LENGTH}자 이하로 입력해주세요.`);
  }
  return trimmed;
}

/**
 * 신규 가입 시 프로필 행은 `on_auth_user_created` 트리거가 생성한다.
 * 트리거 이전에 가입한 계정 등으로 행이 없을 수 있으므로 null 을 허용한다.
 */
export async function getProfile(userId: string): Promise<Profile | null> {
  const row = await getProfileRow(userId);
  return row ? toProfile(row) : null;
}

async function getProfileRow(userId: string): Promise<ProfileRow | null> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from('profile')
    .select(PROFILE_SELECT)
    .eq('user_id', userId)
    .maybeSingle();

  if (error) fail('getProfile', error);

  return (data as ProfileRow | null) ?? null;
}

/**
 * 프로필 이미지를 `profile-image` 버킷에 uuidv4 이름으로 올리고 저장 경로를 돌려준다.
 * 업로드는 로그인 사용자의 세션으로 수행되므로 Storage RLS 가 그대로 적용된다.
 */
async function uploadProfileImage(image: File): Promise<string> {
  const extension = IMAGE_EXTENSIONS[image.type];
  if (!extension) throw badRequest('JPG, PNG, WEBP, GIF 이미지만 업로드할 수 있습니다.');
  if (image.size === 0) throw badRequest('이미지 파일이 비어 있습니다.');
  if (image.size > IMAGE_MAX_BYTES) throw badRequest('이미지는 5MB 이하만 업로드할 수 있습니다.');

  const path = `${crypto.randomUUID()}.${extension}`;
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.storage
    .from(supabaseEnv.profileImageBucket)
    .upload(path, image, { contentType: image.type, upsert: false });

  if (error) {
    console.error('[profile] 이미지 업로드 실패', error);
    throw new ApiError('PROFILE_IMAGE_UPLOAD_FAILED', '이미지를 업로드하지 못했습니다.', 502);
  }

  return path;
}

/** 교체 후 남은 이전 파일 정리. 실패해도 프로필 수정 자체는 성공으로 둔다. */
async function removeProfileImage(path: string): Promise<void> {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.storage.from(supabaseEnv.profileImageBucket).remove([path]);

  if (error) console.error('[profile] 이전 이미지 삭제 실패', error);
}

/**
 * 닉네임 / 프로필 이미지 수정.
 * 이미지는 Storage 에 업로드하고 `profile.image_path` 에는 파일 경로만 저장한다.
 */
export async function updateProfile(userId: string, input: UpdateProfileInput): Promise<Profile> {
  const nickname = input.nickname === undefined ? undefined : normalizeNickname(input.nickname);

  if (nickname === undefined && !input.image) {
    throw badRequest('변경할 내용이 없습니다.');
  }

  const previous = await getProfileRow(userId);
  const imagePath = input.image ? await uploadProfileImage(input.image) : undefined;

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from('profile')
    .upsert(
      {
        user_id: userId,
        ...(nickname === undefined ? {} : { nickname }),
        ...(imagePath === undefined ? {} : { image_path: imagePath }),
      },
      { onConflict: 'user_id' },
    )
    .select(PROFILE_SELECT)
    .single();

  if (error || !data) {
    // 행 갱신에 실패했으면 방금 올린 파일은 고아가 되므로 되돌린다.
    if (imagePath) await removeProfileImage(imagePath);
    fail('updateProfile', error);
  }

  const previousPath = previous?.image_path;
  if (imagePath && isStoragePath(previousPath)) {
    await removeProfileImage(previousPath);
  }

  return toProfile(data as ProfileRow);
}
