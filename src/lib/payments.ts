import 'server-only';

import * as PortOne from '@portone/server-sdk';

import { portoneServerEnv } from '@/lib/portone/serverEnv';
import type { Json } from '@/lib/supabase/database.types';
import { supabaseEnv } from '@/lib/supabase/env';
import { createSupabaseAdminClient } from '@/lib/supabase/server';

/**
 * 결제 원장(payment 테이블) 도메인 모듈 — 결제 규칙 SSOT: .claude/rules/payment.md
 *
 * insert-only 원장이다: 행은 수정·삭제하지 않고 결제(PAYMENT)·취소(CANCEL) 행을 쌓기만 한다.
 * transaction_key(= 포트원 paymentId)가 한 결제 건의 그룹 키이고,
 * amount 는 결제 +, 취소 - 부호로 저장한다(DB 제약 payment_amount_sign_check 가 강제).
 * 웹훅 페이로드는 신뢰하지 않는다 — 항상 단건조회 API 응답만 믿고 기록한다.
 */

/** 결제창 customData 로 실어 보내고 단건조회 응답에서 되읽는 값 — 결제 건을 상품·사용자와 잇는다. */
export interface PaymentCustomData {
  productId: string;
  userId: string;
}

type LedgerType = 'PAYMENT' | 'CANCEL';

/** 원장에 기록하는 상태의 결제 건 — PAID(결제) 또는 CANCELLED(전액취소). */
type RecordablePayment = Extract<PortOne.Payment.Payment, { status: 'PAID' | 'CANCELLED' }>;

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function portoneClient() {
  return PortOne.PortOneClient({ secret: portoneServerEnv.apiSecret });
}

/**
 * Standard Webhooks 서명 검증. 서명이 어긋나면 null — 라우트가 400 으로 끊는다.
 * 검증 외 오류(시크릿 미설정 등)는 그대로 던져 5xx → 포트원 재전송으로 이어진다.
 */
export async function verifyPortoneWebhook(
  body: string,
  headers: Record<string, string>,
): Promise<PortOne.Webhook.Webhook | null> {
  try {
    return await PortOne.Webhook.verify(portoneServerEnv.webhookSecret, body, headers);
  } catch (error) {
    if (error instanceof PortOne.Webhook.WebhookVerificationError) {
      console.error('[payments] 웹훅 서명 검증 실패', error.message);
      return null;
    }
    throw error;
  }
}

/**
 * 웹훅이 가리키는 결제 건을 단건조회로 재확인해 원장과 동기화한다(멱등 — 몇 번 불려도 결과가 같다).
 * - PAID → PAYMENT 행 기록
 * - CANCELLED(전액취소) → PAYMENT 행을 먼저 보장한 뒤 CANCEL 행 기록
 *   (취소 웹훅이 결제 웹훅보다 먼저 오거나 결제 웹훅이 유실돼도 원장이 맞도록)
 * - PARTIAL_CANCELLED 는 서비스에 없다 — 기록하지 않고 로그만 남긴다.
 * - READY·FAILED 등 나머지 상태는 원장 대상이 아니라 무시한다.
 */
export async function syncPaymentLedger(paymentId: string): Promise<void> {
  let payment: PortOne.Payment.Payment;
  try {
    payment = await portoneClient().payment.getPayment({ paymentId });
  } catch (error) {
    // 웹훅이 가리키는 결제 건이 포트원에 실제로 없으면(위조 의심) 기록 없이 무시한다.
    if (
      error instanceof PortOne.Payment.GetPaymentError &&
      error.data.type === 'PAYMENT_NOT_FOUND'
    ) {
      console.error('[payments] 웹훅의 결제 건이 포트원에 없습니다', paymentId);
      return;
    }
    throw error;
  }

  switch (payment.status) {
    case 'PAID':
      await recordLedgerRow(payment, 'PAYMENT');
      return;
    case 'CANCELLED':
      await recordLedgerRow(payment, 'PAYMENT');
      await recordLedgerRow(payment, 'CANCEL');
      return;
    case 'PARTIAL_CANCELLED':
      console.error('[payments] 부분취소는 지원하지 않아 기록하지 않습니다', paymentId);
      return;
    default:
      return;
  }
}

/** customData 를 되읽어 형식을 검증한다. 없거나 어긋나면 null — 위조 의심이라 기록하지 않는다. */
function parseCustomData(raw: string | undefined): PaymentCustomData | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as Partial<PaymentCustomData>;
    if (
      typeof parsed.productId === 'string' &&
      UUID_PATTERN.test(parsed.productId) &&
      typeof parsed.userId === 'string' &&
      UUID_PATTERN.test(parsed.userId)
    ) {
      return { productId: parsed.productId, userId: parsed.userId };
    }
  } catch {
    // JSON 이 아니면 아래에서 null 로 처리한다.
  }
  return null;
}

/**
 * 원장 행 1개를 기록한다. 같은 (transaction_key, type) 행이 이미 있으면 웹훅 재전송으로 보고 끝낸다.
 * 인증 결제 금액은 브라우저에서 조작될 수 있어, DB 상품 값과 대조해 다르면 기록하지 않는다.
 */
async function recordLedgerRow(payment: RecordablePayment, type: LedgerType): Promise<void> {
  // transaction_key 컬럼이 uuid 다 — 우리 결제창은 항상 crypto.randomUUID() 로 채번한다.
  if (!UUID_PATTERN.test(payment.id)) {
    console.error('[payments] paymentId 가 UUID 가 아니라 기록하지 않습니다', payment.id);
    return;
  }

  const customData = parseCustomData(payment.customData);
  if (!customData) {
    console.error('[payments] customData 가 없거나 형식이 어긋나 기록하지 않습니다', payment.id);
    return;
  }

  const supabase = createSupabaseAdminClient();

  const { data: product, error: productError } = await supabase
    .from('product')
    .select('id, name, price')
    .eq('id', customData.productId)
    .maybeSingle();
  if (productError) throw productError;
  if (!product) {
    console.error('[payments] customData 의 상품이 없어 기록하지 않습니다', customData.productId);
    return;
  }

  // 금액·화폐·주문명 대조 — 하나라도 다르면 위조 의심이라 기록하지 않는다.
  if (
    payment.currency !== 'KRW' ||
    payment.amount.total !== Number(product.price) ||
    payment.orderName !== product.name
  ) {
    console.error('[payments] 결제 내용이 상품 정보와 달라 기록하지 않습니다', {
      paymentId: payment.id,
      currency: payment.currency,
      amount: payment.amount.total,
      orderName: payment.orderName,
    });
    return;
  }

  // 중복결제 검증 1차 — 이미 기록된 (transaction_key, type) 이면 웹훅 재전송이다.
  const { data: existing, error: existingError } = await supabase
    .from('payment')
    .select('id')
    .eq('transaction_key', payment.id)
    .eq('type', type)
    .maybeSingle();
  if (existingError) throw existingError;
  if (existing) return;

  // 단건조회 응답 원본을 스냅샷으로 남기고, 원장 행이 그 스냅샷을 가리키게 한다.
  const { data: snapshot, error: snapshotError } = await supabase
    .from('payment_snapshot')
    .insert({ value: payment as unknown as Json })
    .select('id')
    .single();
  if (snapshotError) throw snapshotError;

  const { error: insertError } = await supabase.from('payment').insert({
    transaction_key: payment.id,
    type,
    amount: type === 'PAYMENT' ? payment.amount.total : -payment.amount.total,
    product_id: product.id,
    user_id: customData.userId,
    payment_snapshot_id: snapshot.id,
  });
  if (insertError) {
    // 원장 기록에 실패했으니 방금 만든 스냅샷이 고아로 남지 않게 거둬들인다.
    await supabase.from('payment_snapshot').delete().eq('id', snapshot.id);
    // 중복결제 검증 2차 — 동시 수신이 1차 조회를 같이 통과해도 유니크 제약이 막는다(23505 = 이미 기록됨).
    if (insertError.code === '23505') return;
    throw insertError;
  }
}

/**
 * 참여자 수 = 해당 상품의 PAYMENT 행 수 − CANCEL 행 수.
 * (전액취소만 있어 "취소되지 않은 결제 건 수"와 같다.)
 * payment 는 RLS 정책 없이 닫혀 있어 서비스 롤로만 센다. 서비스 키가 없으면
 * 세지 못하니 0 으로 접는다 — 서버가 죽지 않게 하는 네이버 키 방식과 동일.
 */
export async function countParticipants(productId: string): Promise<number> {
  if (!supabaseEnv.serviceRoleKey) {
    console.warn('[payments] SUPABASE_SERVICE_ROLE_KEY 미설정 — 참여자 수를 0 으로 표시합니다.');
    return 0;
  }

  const supabase = createSupabaseAdminClient();
  const countOf = (type: LedgerType) =>
    supabase
      .from('payment')
      .select('id', { count: 'exact', head: true })
      .eq('product_id', productId)
      .eq('type', type);

  const [paid, cancelled] = await Promise.all([countOf('PAYMENT'), countOf('CANCEL')]);
  if (paid.error) throw paid.error;
  if (cancelled.error) throw cancelled.error;

  return (paid.count ?? 0) - (cancelled.count ?? 0);
}
