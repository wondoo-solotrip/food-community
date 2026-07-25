import 'server-only';

/**
 * Supabase 관련 환경변수 접근 지점.
 * BFF 원칙상 모든 값은 서버 전용(NEXT_PUBLIC_ 접두사 금지)이며,
 * 빌드 시점이 아닌 실제 사용 시점에 검증하도록 getter로 노출한다.
 */
function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`환경변수 ${name} 가 설정되지 않았습니다. .env.local 을 확인하세요.`);
  }
  return value;
}

export const supabaseEnv = {
  get url() {
    return required('SUPABASE_URL');
  },
  get publishableKey() {
    return required('SUPABASE_PUBLISHABLE_KEY');
  },
  /** place_image.image_path 가 가리키는 Storage 버킷 */
  get storageBucket() {
    return process.env.SUPABASE_STORAGE_BUCKET ?? 'place-image';
  },
  /** profile.image_path 가 가리키는 Storage 버킷 */
  get profileImageBucket() {
    return process.env.SUPABASE_PROFILE_IMAGE_BUCKET ?? 'profile-image';
  },
  /** 공개 오브젝트 주소의 베이스. DB에는 경로만 저장하고 주소는 이 값으로 조립한다. */
  get storagePublicUrl() {
    return process.env.SUPABASE_STORAGE_URL ?? `${this.url}/storage/v1/object/public`;
  },
};
