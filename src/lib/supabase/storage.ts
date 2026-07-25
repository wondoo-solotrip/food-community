import 'server-only';

import { supabaseEnv } from './env';

/**
 * Storage 경로 ↔ 공개 URL 변환 지점.
 * DB에는 파일 경로만 저장하고, 주소는 환경변수(`SUPABASE_STORAGE_URL`) 기준으로 조립한다.
 */
export function publicStorageUrl(bucket: string, path: string): string {
  return `${supabaseEnv.storagePublicUrl}/${bucket}/${path}`;
}
