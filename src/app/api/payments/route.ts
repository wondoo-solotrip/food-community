import { handleRoute, jsonOk } from '@/lib/api/response';
import { requireUser } from '@/lib/auth';
import { listPaymentHistory } from '@/lib/payments';

/** GET /api/payments — 내 결제 내역(원장 PAYMENT − CANCEL). 로그인 필수. 규칙: .claude/rules/payment.md */
export async function GET() {
  return handleRoute(async () => {
    const user = await requireUser();
    return jsonOk({ payments: await listPaymentHistory(user.id) });
  });
}
