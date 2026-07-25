import 'server-only';

import { ApiError, badRequest, notFound } from '@/lib/api/response';
import { supabaseEnv } from '@/lib/supabase/env';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { publicStorageUrl } from '@/lib/supabase/storage';

/** 맛집 사진. 클라이언트는 Storage 경로 대신 id(수정용) 와 조립된 주소만 본다. */
export interface PlaceImage {
  id: string;
  url: string;
}

/**
 * 게시글에 붙는 지도 정보. 네 값은 항상 함께 있거나 함께 없다.
 * (DB 의 `place_map_location_complete` 제약과 같은 규칙이다)
 */
export interface PlaceLocation {
  /** 장소명 — 지역검색에서 고른 이름이거나 직접 입력한 이름 (`place.name`) */
  name: string;
  /** 지번 주소 — 핀 좌표를 리버스 지오코딩한 값 (`place.address`) */
  address: string;
  /** 위도(WGS84) — 핀 좌표 (`place.lat`) */
  lat: number;
  /** 경도(WGS84) — 핀 좌표 (`place.lng`) */
  lng: number;
}

/** BFF 밖으로 나가는 맛집 도메인 모델. DB 컬럼명이 아닌 이 형태만 클라이언트가 본다. */
export interface Place {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  userId: string;
  images: PlaceImage[];
  /** 지도 정보. 지도 연동 이전에 등록된 글만 null 이고, 새로 등록·수정한 글은 항상 채워져 있다. */
  location: PlaceLocation | null;
}

/**
 * 검증 전의 지도 정보. 폼/JSON 에서 값이 빠지거나 숫자로 읽히지 않을 수 있어 전부 optional 이다.
 * `normalizePlaceLocation` 이 네 값을 모두 확인한 뒤에야 `PlaceLocation` 이 된다.
 */
export interface PlaceLocationInput {
  name?: string;
  address?: string;
  lat?: number;
  lng?: number;
}

export interface CreatePlaceInput {
  title: string;
  content: string;
  /** 최소 1장. 업로드는 서버가 수행하고 DB 에는 파일 경로만 남는다. */
  images: File[];
  /** 필수. 네 값(장소명·주소·좌표) 중 하나라도 비면 등록이 거절된다. */
  location: PlaceLocationInput;
}

/**
 * 맛집 수정 입력. 넘어온 필드만 반영한다(부분 수정).
 * `keepImageIds` / `images` 중 하나라도 오면 사진 목록은 `유지 + 신규` 로 완전히 교체된다.
 * (= `keepImageIds` 없이 `images` 만 보내면 기존 사진은 전부 삭제된다)
 *
 * `location` 은 보내면 네 값을 모두 채워야 하고, 위치가 없는 글(지도 연동 이전 글)을 고칠 때는 필수다.
 */
export interface UpdatePlaceInput {
  title?: string;
  content?: string;
  keepImageIds?: string[];
  images?: File[];
  location?: PlaceLocationInput;
}

const CONTENT_MIN_LENGTH = 10;
/** 등록 화면(`/register`)의 `0/3` 카운터와 같은 제한 */
const IMAGE_MIN_COUNT = 1;
const IMAGE_MAX_COUNT = 3;
const IMAGE_MAX_BYTES = 5 * 1024 * 1024;
/** 허용 이미지 타입 → 저장 확장자. uuid 파일명에 붙일 확장자를 여기서만 결정한다. */
const IMAGE_EXTENSIONS: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
};

const PLACE_SELECT =
  'id, title, content, name, address, lat, lng, created_at, user_id, place_image(id, image_path, created_at)';

type PlaceImageRow = {
  id: string;
  image_path: string;
  created_at: string;
};

type PlaceRow = {
  id: string;
  title: string;
  content: string;
  name: string | null;
  address: string;
  lat: number | null;
  lng: number | null;
  created_at: string;
  user_id: string;
  place_image: PlaceImageRow[];
};

/** 주소는 DB 에 저장하지 않는다. 경로만 저장하고 `SUPABASE_STORAGE_URL` 기준으로 조립한다. */
function toPlaceImage(row: PlaceImageRow): PlaceImage {
  return { id: row.id, url: publicStorageUrl(supabaseEnv.storageBucket, row.image_path) };
}

/**
 * 네 값이 모두 있을 때만 지도 정보로 인정한다.
 * 지도 연동 이전에 등록된 글은 좌표·장소명이 없고 주소가 `등록 대기중` 이라 null 이 된다.
 */
function toPlaceLocation(row: PlaceRow): PlaceLocation | null {
  if (!row.name || !row.address || row.lat === null || row.lng === null) return null;

  return { name: row.name, address: row.address, lat: Number(row.lat), lng: Number(row.lng) };
}

function toPlace(row: PlaceRow): Place {
  const images = [...(row.place_image ?? [])].sort((a, b) =>
    a.created_at === b.created_at ? a.id.localeCompare(b.id) : a.created_at.localeCompare(b.created_at),
  );

  return {
    id: row.id,
    title: row.title,
    content: row.content,
    createdAt: row.created_at,
    userId: row.user_id,
    images: images.map(toPlaceImage),
    location: toPlaceLocation(row),
  };
}

function fail(scope: string, error: unknown): never {
  console.error(`[places] ${scope} 실패`, error);
  throw new ApiError('PLACES_QUERY_FAILED', '맛집 정보를 불러오지 못했습니다.', 500);
}

function normalizeTitle(title: string): string {
  const trimmed = title.trim();
  if (!trimmed) throw badRequest('제목을 입력해주세요.');
  return trimmed;
}

function normalizeContent(content: string): string {
  const trimmed = content.trim();
  if (!trimmed) throw badRequest('내용을 입력해주세요.');
  if (trimmed.length < CONTENT_MIN_LENGTH) {
    throw badRequest(`내용은 ${CONTENT_MIN_LENGTH}자 이상 입력해주세요.`);
  }
  return trimmed;
}

/**
 * 좌표 한 축 검증. 0 은 국내 좌표에 없으므로, 값이 빠졌을 때 생기는 `Number('') === 0` 과 함께 걸러낸다.
 * (`limit` 는 위도 90 / 경도 180)
 */
function normalizeCoordinate(value: number | undefined, limit: number): number {
  if (value === undefined || !Number.isFinite(value) || value === 0 || Math.abs(value) > limit) {
    throw badRequest('지도에서 위치를 선택해주세요.');
  }
  return value;
}

/**
 * 지도 정보 검증. 장소명·주소·위도·경도가 **모두** 있어야 통과한다.
 * 하나라도 비면 등록/수정이 거절되므로, 저장된 글은 항상 지도에 세울 수 있다.
 * DB 의 `place_map_location_complete` 제약과 같은 규칙을 앱에서 먼저 걸러 안내 문구를 준다.
 */
function normalizePlaceLocation(input: PlaceLocationInput): PlaceLocation {
  const name = input.name?.trim() ?? '';
  if (!name) throw badRequest('장소명을 입력해주세요.');

  const address = input.address?.trim() ?? '';
  // 바다 위처럼 지번 주소가 없는 좌표는 리버스 지오코딩이 빈 주소를 준다. 그대로 저장하지 않는다.
  if (!address) throw badRequest('주소를 확인할 수 있는 위치를 선택해주세요.');

  return {
    name,
    address,
    lat: normalizeCoordinate(input.lat, 90),
    lng: normalizeCoordinate(input.lng, 180),
  };
}

/** 등록·수정 후 남게 될 사진 장수 검증. 게시글은 항상 사진 1장 이상을 유지한다. */
function assertImageCount(count: number): void {
  if (count < IMAGE_MIN_COUNT) throw badRequest(`사진을 ${IMAGE_MIN_COUNT}장 이상 등록해주세요.`);
  if (count > IMAGE_MAX_COUNT) {
    throw badRequest(`사진은 최대 ${IMAGE_MAX_COUNT}장까지 등록할 수 있습니다.`);
  }
}

/**
 * 사진을 `place-image` 버킷에 uuidv4 이름으로 올리고 저장 경로들을 돌려준다.
 * 업로드는 로그인 사용자의 세션으로 수행되므로 Storage RLS 가 그대로 적용된다.
 * 중간에 실패하면 이미 올린 파일까지 정리해 고아 파일을 남기지 않는다.
 */
async function uploadPlaceImages(images: File[]): Promise<string[]> {
  const supabase = await createSupabaseServerClient();
  const uploaded: string[] = [];

  try {
    for (const image of images) {
      const extension = IMAGE_EXTENSIONS[image.type];
      if (!extension) throw badRequest('JPG, PNG, WEBP, GIF 이미지만 업로드할 수 있습니다.');
      if (image.size === 0) throw badRequest('이미지 파일이 비어 있습니다.');
      if (image.size > IMAGE_MAX_BYTES) throw badRequest('이미지는 5MB 이하만 업로드할 수 있습니다.');

      const path = `${crypto.randomUUID()}.${extension}`;
      const { error } = await supabase.storage
        .from(supabaseEnv.storageBucket)
        .upload(path, image, { contentType: image.type, upsert: false });

      if (error) {
        console.error('[places] 이미지 업로드 실패', error);
        throw new ApiError('PLACE_IMAGE_UPLOAD_FAILED', '이미지를 업로드하지 못했습니다.', 502);
      }

      uploaded.push(path);
    }
  } catch (error) {
    await removePlaceImages(uploaded);
    throw error;
  }

  return uploaded;
}

/** 롤백·교체 후 남은 파일 정리. 실패해도 요청 자체는 성공으로 둔다(로그만 남긴다). */
async function removePlaceImages(paths: string[]): Promise<void> {
  if (!paths.length) return;

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.storage.from(supabaseEnv.storageBucket).remove(paths);

  if (error) console.error('[places] 이미지 삭제 실패', error);
}

/**
 * 소프트 삭제된 글은 어떤 조회에도 걸리지 않는다.
 * RLS(`place_select_active`)에서도 막지만, 쿼리 레벨에서도 의도를 드러낸다.
 */
async function getPlaceRow(id: string): Promise<PlaceRow> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from('place')
    .select(PLACE_SELECT)
    .eq('id', id)
    .is('deleted_at', null)
    .maybeSingle();

  if (error) fail('getPlace', error);
  if (!data) throw notFound('맛집 게시글을 찾을 수 없습니다.');

  return data as PlaceRow;
}

export async function listPlaces(): Promise<Place[]> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from('place')
    .select(PLACE_SELECT)
    .is('deleted_at', null)
    .order('created_at', { ascending: false });

  if (error) fail('listPlaces', error);

  return (data as PlaceRow[]).map(toPlace);
}

export async function listPlacesByUser(userId: string): Promise<Place[]> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from('place')
    .select(PLACE_SELECT)
    .eq('user_id', userId)
    .is('deleted_at', null)
    .order('created_at', { ascending: false });

  if (error) fail('listPlacesByUser', error);

  return (data as PlaceRow[]).map(toPlace);
}

export async function getPlace(id: string): Promise<Place> {
  return toPlace(await getPlaceRow(id));
}

/**
 * 맛집 등록. 제목·내용(10자 이상)·사진 1장 이상·지도 정보(장소명·주소·좌표)가 모두 필수다.
 * 검증은 업로드보다 먼저 끝내서, 값이 모자란 요청 때문에 Storage 에 파일이 올라가지 않게 한다.
 */
export async function createPlace(userId: string, input: CreatePlaceInput): Promise<Place> {
  const title = normalizeTitle(input.title);
  const content = normalizeContent(input.content);
  const location = normalizePlaceLocation(input.location);
  assertImageCount(input.images.length);

  const imagePaths = await uploadPlaceImages(input.images);
  const supabase = await createSupabaseServerClient();

  const { data: created, error } = await supabase
    .from('place')
    .insert({
      title,
      content,
      user_id: userId,
      name: location.name,
      address: location.address,
      lat: location.lat,
      lng: location.lng,
    })
    .select('id')
    .single();

  if (error || !created) {
    // 게시글이 만들어지지 않았으면 방금 올린 파일은 고아가 되므로 되돌린다.
    await removePlaceImages(imagePaths);
    fail('createPlace', error);
  }

  const { error: imageError } = await supabase
    .from('place_image')
    .insert(imagePaths.map((image_path) => ({ place_id: created.id, image_path })));

  if (imageError) {
    // 사진 없는 게시글은 남기지 않는다. 행과 파일 모두 되돌린다.
    await supabase.from('place').delete().eq('id', created.id);
    await removePlaceImages(imagePaths);
    fail('createPlace(images)', imageError);
  }

  return getPlace(created.id);
}

/**
 * 맛집 수정. 본인 게시글만 수정할 수 있고, 사진을 교체해도 최소 1장은 남아야 한다.
 *
 * 지도 정보는 필수값이라 두 가지를 함께 지킨다.
 * - `location` 을 보내면 네 값(장소명·주소·좌표)을 모두 채워야 한다(부분 수정 불가).
 * - 위치가 없는 글(지도 연동 이전 글)은 `location` 없이 고칠 수 없다 — 수정하는 김에 채우게 한다.
 */
export async function updatePlace(
  userId: string,
  id: string,
  input: UpdatePlaceInput,
): Promise<Place> {
  const current = await getPlaceRow(id);
  if (current.user_id !== userId) {
    throw new ApiError('FORBIDDEN', '내가 등록한 맛집만 수정할 수 있습니다.', 403);
  }

  const title = input.title === undefined ? undefined : normalizeTitle(input.title);
  const content = input.content === undefined ? undefined : normalizeContent(input.content);
  const location = input.location === undefined ? undefined : normalizePlaceLocation(input.location);
  const replacesImages = input.keepImageIds !== undefined || input.images !== undefined;

  if (title === undefined && content === undefined && location === undefined && !replacesImages) {
    throw badRequest('변경할 내용이 없습니다.');
  }
  if (location === undefined && toPlaceLocation(current) === null) {
    throw badRequest('장소 정보를 입력해야 수정할 수 있습니다.');
  }

  const keepIds = new Set(input.keepImageIds ?? []);
  const currentImages = current.place_image ?? [];
  let removedImages: PlaceImageRow[] = [];
  let addedPaths: string[] = [];

  if (replacesImages) {
    if ([...keepIds].some((keepId) => !currentImages.some((image) => image.id === keepId))) {
      throw badRequest('이 게시글의 사진이 아닙니다.');
    }

    removedImages = currentImages.filter((image) => !keepIds.has(image.id));
    assertImageCount(keepIds.size + (input.images?.length ?? 0));

    addedPaths = input.images?.length ? await uploadPlaceImages(input.images) : [];
  }

  const supabase = await createSupabaseServerClient();

  if (title !== undefined || content !== undefined || location !== undefined) {
    const { error } = await supabase
      .from('place')
      .update({
        ...(title === undefined ? {} : { title }),
        ...(content === undefined ? {} : { content }),
        // 지도 정보는 네 컬럼을 한 번에 바꾼다(일부만 바뀌면 DB 제약에 걸린다).
        ...(location === undefined
          ? {}
          : {
              name: location.name,
              address: location.address,
              lat: location.lat,
              lng: location.lng,
            }),
      })
      .eq('id', id)
      .eq('user_id', userId);

    if (error) {
      await removePlaceImages(addedPaths);
      fail('updatePlace', error);
    }
  }

  if (addedPaths.length) {
    const { error } = await supabase
      .from('place_image')
      .insert(addedPaths.map((image_path) => ({ place_id: id, image_path })));

    if (error) {
      await removePlaceImages(addedPaths);
      fail('updatePlace(images)', error);
    }
  }

  if (removedImages.length) {
    // 행을 먼저 지운다. 파일 삭제가 실패해도 없는 사진을 가리키는 행은 남지 않는다.
    const { error } = await supabase
      .from('place_image')
      .delete()
      .in(
        'id',
        removedImages.map((image) => image.id),
      );

    if (error) fail('updatePlace(removeImages)', error);

    await removePlaceImages(removedImages.map((image) => image.image_path));
  }

  return getPlace(id);
}

/**
 * 맛집 소프트 삭제. 본인 게시글만 삭제할 수 있다.
 * 행과 사진(Storage 파일 포함)은 그대로 두고 `deleted_at` 만 찍어 조회 대상에서 제외한다.
 * 이미 삭제된 글은 조회 단계에서 걸러지므로 404 가 된다.
 *
 * 일반 UPDATE 가 아니라 `soft_delete_place` RPC 를 쓰는 이유:
 * Postgres 는 UPDATE 후의 새 행에도 SELECT 정책을 적용하는데,
 * `place_select_active` 가 `deleted_at is null` 이라 삭제된 새 행이 스스로에게 보이지 않아
 * RLS 위반(42501)이 난다. 조회 차단 정책을 유지하려고 소유자 검증을 함수 안으로 옮겼다.
 */
export async function softDeletePlace(userId: string, id: string): Promise<void> {
  const current = await getPlaceRow(id);
  if (current.user_id !== userId) {
    throw new ApiError('FORBIDDEN', '내가 등록한 맛집만 삭제할 수 있습니다.', 403);
  }

  const supabase = await createSupabaseServerClient();
  const { data: deleted, error } = await supabase.rpc('soft_delete_place', { place_id: id });

  if (error) fail('softDeletePlace', error);
  // 조회와 삭제 사이에 이미 지워진 경우(동시 요청)만 여기에 걸린다.
  if (!deleted) throw notFound('맛집 게시글을 찾을 수 없습니다.');
}
