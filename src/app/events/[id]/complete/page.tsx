import { notFound, redirect } from 'next/navigation';

import { eventMonthDayLabel, eventScheduleLabel, formatWon } from '@/lib/eventFormat';
import { getProduct } from '@/lib/products';

import { PaymentCompleteView } from './PaymentCompleteView';

/**
 * 결제 완료 — `product` 테이블 실데이터로 영수증 요약을 만든다.
 * 포트원 리다이렉트 흐름의 도착지이기도 하다(.claude/rules/payment.md):
 * 성공은 `?paymentId=`, 실패는 `?code=&message=` 쿼리로 온다.
 * 서버 결제 검증은 아직 없어 결제 기록 없이 상품 정보만 보여준다.
 */
export default async function PaymentCompletePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ code?: string | string[] }>;
}) {
  const { id } = await params;
  const { code } = await searchParams;
  // 결제 실패(사용자가 결제창을 닫은 경우 포함) — 완료 화면 대신 상세로 되돌린다.
  if (code) redirect(`/events/${id}`);

  const product = await getProduct(id).catch(() => null);
  if (!product) notFound();

  return (
    <PaymentCompleteView
      message={`${eventMonthDayLabel(product.eventAt)}, ${product.name}에서 만나요.`}
      receiptRows={[
        { label: '상품', value: product.name },
        { label: '일시', value: eventScheduleLabel(product.eventAt) },
        { label: '장소', value: product.address },
        { label: '결제 금액', value: formatWon(product.price), emphasized: true },
      ]}
    />
  );
}
