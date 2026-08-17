import { handleRoute, jsonOk } from '@/lib/api/response';
import { requireUser } from '@/lib/auth';
import { cancelEventPayment } from '@/lib/payments';

/**
 * POST /api/payments/:transactionKey/cancel — 본인 결제 건 전액취소.
 * 포트원 취소 API 는 BFF 인 여기서만 호출한다. 규칙: .claude/rules/payment.md
 */
export async function POST(
  _request: Request,
  { params }: { params: Promise<{ transactionKey: string }> },
) {
  return handleRoute(async () => {
    const user = await requireUser();
    const { transactionKey } = await params;
    await cancelEventPayment(user.id, transactionKey);

    return jsonOk({ transactionKey });
  });
}
