import { ApiError, handleRoute, jsonOk } from '@/lib/api/response';
import { syncPaymentLedger, verifyPortoneWebhook } from '@/lib/payments';

/**
 * POST /api/portone/webhook — 포트원 V2 웹훅 수신점(.claude/rules/payment.md).
 * 서명 검증에 실패하면 400, 처리 중 오류는 5xx 로 끊어 포트원 재전송(최대 5회)을 받는다.
 * 페이로드는 신뢰하지 않는다 — paymentId 만 꺼내고 나머지는 단건조회 API 로 재확인한다.
 */
export async function POST(request: Request) {
  const body = await request.text();

  return handleRoute(async () => {
    const webhook = await verifyPortoneWebhook(body, Object.fromEntries(request.headers));
    if (!webhook) {
      throw new ApiError('WEBHOOK_VERIFICATION_FAILED', '웹훅 서명 검증에 실패했습니다.', 400);
    }

    // 결제 관련 웹훅만 처리한다. 모르는 type·빌링키 웹훅은 에러 없이 무시한다(포트원 가이드).
    if ('data' in webhook && 'paymentId' in webhook.data) {
      await syncPaymentLedger(webhook.data.paymentId);
    }

    return jsonOk({ received: true });
  });
}
