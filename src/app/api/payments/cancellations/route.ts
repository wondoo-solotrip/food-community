import { handleRoute, jsonOk } from '@/lib/api/response';
import { requireUser } from '@/lib/auth';
import { listCancelHistory } from '@/lib/payments';

/** GET /api/payments/cancellations — 내 취소 내역(원장 CANCEL 행). 로그인 필수. 규칙: .claude/rules/payment.md */
export async function GET() {
  return handleRoute(async () => {
    const user = await requireUser();
    return jsonOk({ cancellations: await listCancelHistory(user.id) });
  });
}
