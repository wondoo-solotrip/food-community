import * as PortOne from '@portone/browser-sdk/v2';

/** 타입 전용 import — 런타임 코드가 없으므로 서버 모듈이 브라우저 번들에 포함되지 않는다. */
import type { PaymentCustomData } from '@/lib/payments';

import { portoneEnv } from './env';

/**
 * 포트원 V2 결제창 호출 지점 — 결제창은 이 함수를 통해서만 띄운다(.claude/rules/payment.md).
 * 브라우저 SDK 라 클라이언트 컴포넌트에서만 import 한다.
 */

export interface EventPaymentInput {
  productId: string;
  /** 결제자(로그인 사용자) id — 웹훅이 결제 건을 사용자와 이어 원장에 기록하는 데 쓴다. */
  userId: string;
  /** 주문명 — DB 에서 조회한 상품명(`product.name`) */
  orderName: string;
  /** 결제 금액(원) — DB 에서 조회한 상품가(`product.price`). 화면 표기 문자열을 되파싱하지 않는다. */
  totalAmount: number;
}

export type EventPaymentResult =
  | { status: 'paid'; paymentId: string }
  /** redirectUrl 로 페이지가 통째로 넘어가는 흐름(모바일) — 후처리는 완료 페이지 몫이다. */
  | { status: 'redirected' }
  | { status: 'failed'; message: string };

/** 리다이렉트 흐름에서 포트원이 성공 `?paymentId=` · 실패 `?code=&message=` 쿼리를 붙여 보내는 주소. */
function paymentCompleteUrl(productId: string): string {
  return `${window.location.origin}/events/${productId}/complete`;
}

export async function requestEventPayment({
  productId,
  userId,
  orderName,
  totalAmount,
}: EventPaymentInput): Promise<EventPaymentResult> {
  const keys = portoneEnv.paymentKeys;
  if (!keys) {
    return {
      status: 'failed',
      message: '결제 설정이 아직 준비되지 않았어요. 잠시 후 다시 시도해 주세요.',
    };
  }

  try {
    const payment = await PortOne.requestPayment({
      storeId: keys.storeId,
      channelKey: keys.channelKey,
      // 결제 건 ID — 매 시도마다 새로 만든다. 서버 검증·취소 API 도 이 값으로 조회한다.
      paymentId: crypto.randomUUID(),
      orderName,
      totalAmount,
      currency: 'KRW',
      payMethod: 'CARD',
      redirectUrl: paymentCompleteUrl(productId),
      // 웹훅(서버)이 결제 건을 상품·사용자와 잇는 값 — 단건조회 응답의 customData 로 되읽는다.
      customData: { productId, userId } satisfies PaymentCustomData,
    });

    // 반환값 없이 리졸브되면 리다이렉트가 시작된 것 — 화면 상태를 건드리지 않는다.
    if (!payment) return { status: 'redirected' };
    // code 가 있으면 실패다(사용자가 결제창을 닫은 경우 포함).
    if (payment.code !== undefined) {
      return { status: 'failed', message: payment.message ?? '결제에 실패했어요.' };
    }
    return { status: 'paid', paymentId: payment.paymentId };
  } catch (error) {
    console.error('[portone] requestPayment 실패', error);
    return { status: 'failed', message: '결제를 시작하지 못했어요. 잠시 후 다시 시도해 주세요.' };
  }
}
