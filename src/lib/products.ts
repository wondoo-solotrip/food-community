import 'server-only';

import { ApiError, notFound } from '@/lib/api/response';
import { countParticipants } from '@/lib/payments';
import { supabaseEnv } from '@/lib/supabase/env';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { publicStorageUrl } from '@/lib/supabase/storage';

/**
 * BFF 밖으로 나가는 유료 상품(강연·모임) 도메인 모델.
 * 상품은 운영진이 DB 에 직접 등록하므로 조회만 있다(PRD v1.1).
 * 공개 상태(`status = 'Public'`)인 상품만 내려간다 — RLS(`product_select_public`)도 같은 규칙이다.
 */
export interface Product {
  id: string;
  name: string;
  description: string;
  /** 모임 일시(ISO). 표기는 화면이 `src/lib/eventFormat.ts` 로 만든다. */
  eventAt: string;
  /** 모임 장소 주소 */
  address: string;
  /** 정원(최대 참여 가능 수) */
  capacity: number;
  price: number;
  /** 현재 참여자 수 — 결제 원장 기준 PAYMENT − CANCEL 행 수(src/lib/payments.ts). */
  participants: number;
  /** 메인 배너용 이미지(`image_path_main`) 조립 주소 */
  bannerImageUrl: string;
  /** 상세 히어로용 이미지(`image_path_detail`) 조립 주소 */
  detailImageUrl: string;
}

const PRODUCT_SELECT =
  'id, name, description, event_at, address, capacity, price, image_path_main, image_path_detail, created_at';

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

type ProductRow = {
  id: string;
  name: string;
  description: string;
  event_at: string;
  address: string;
  capacity: number;
  price: number;
  image_path_main: string;
  image_path_detail: string;
  created_at: string;
};

/** 주소는 DB 에 저장하지 않는다. 경로만 저장하고 `SUPABASE_STORAGE_URL` 기준으로 조립한다. */
function toProduct(row: ProductRow, participants: number): Product {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    eventAt: row.event_at,
    address: row.address,
    capacity: row.capacity,
    price: Number(row.price),
    participants,
    bannerImageUrl: publicStorageUrl(supabaseEnv.productImageBucket, row.image_path_main),
    detailImageUrl: publicStorageUrl(supabaseEnv.productImageBucket, row.image_path_detail),
  };
}

function fail(scope: string, error: unknown): never {
  console.error(`[products] ${scope} 실패`, error);
  throw new ApiError('PRODUCTS_QUERY_FAILED', '상품 정보를 불러오지 못했습니다.', 500);
}

/** 공개 상품 목록. 메인 배너는 이 목록의 첫 상품(최신 등록)을 쓴다. */
export async function listProducts(): Promise<Product[]> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from('product')
    .select(PRODUCT_SELECT)
    .eq('status', 'Public')
    .order('created_at', { ascending: false });

  if (error) fail('listProducts', error);

  // 목록에서는 참여자 수를 쓰지 않아 세지 않는다(상세에서만 센다).
  return (data as ProductRow[]).map((row) => toProduct(row, 0));
}

export async function getProduct(id: string): Promise<Product> {
  // 목업 시절 슬러그 id 등 UUID 가 아닌 값은 DB 까지 가지 않고 404 로 끝낸다.
  if (!UUID_PATTERN.test(id)) throw notFound('상품을 찾을 수 없습니다.');

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from('product')
    .select(PRODUCT_SELECT)
    .eq('id', id)
    .eq('status', 'Public')
    .maybeSingle();

  if (error) fail('getProduct', error);
  if (!data) throw notFound('상품을 찾을 수 없습니다.');

  // 참여자 수는 결제 원장에서 센다(PAYMENT − CANCEL). payment 는 RLS 로 닫혀 있어 서비스 롤이 센다.
  const participants = await countParticipants(id).catch((error) =>
    fail('getProduct(participants)', error),
  );

  return toProduct(data as ProductRow, participants);
}
