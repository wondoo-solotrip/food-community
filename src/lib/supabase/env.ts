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
  /** product.image_path_main / image_path_detail 이 가리키는 Storage 버킷 */
  get productImageBucket() {
    return process.env.SUPABASE_PRODUCT_IMAGE_BUCKET ?? 'product-image';
  },
  /** 공개 오브젝트 주소의 베이스. DB에는 경로만 저장하고 주소는 이 값으로 조립한다. */
  get storagePublicUrl() {
    return process.env.SUPABASE_STORAGE_URL ?? `${this.url}/storage/v1/object/public`;
  },
  /**
   * RLS 를 우회하는 서비스 롤 키. 사용자 세션이 없는 서버 작업(포트원 웹훅의 결제 원장 기록,
   * 참여자 수 집계)에만 쓴다. 미설정이면 null — 호출부가 기능을 접거나 에러로 처리한다.
   */
  get serviceRoleKey() {
    return process.env.SUPABASE_SERVICE_ROLE_KEY ?? null;
  },
};
