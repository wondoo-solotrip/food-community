import { notFound } from 'next/navigation';

import { getCurrentUser } from '@/lib/auth';
import { eventDateLabel, formatWon } from '@/lib/eventFormat';
import { getProduct } from '@/lib/products';

import { EventDetailView } from './EventDetailView';

/**
 * 유료 모임 상세 — `product` 테이블 실데이터를 Server Component 에서 읽어
 * 표기까지 끝낸 뷰 모델로 클라이언트 뷰에 넘긴다(시트 열림 상태만 클라이언트 몫).
 */
export default async function PaidEventDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  // 없는 상품·비공개 상품·조회 실패 모두 상세를 그릴 수 없으니 404 로 보낸다.
  // 로그인 사용자는 결제창 customData(결제 원장 기록)에 필요하다 — 미로그인이어도 상세는 보인다.
  const [product, user] = await Promise.all([getProduct(id).catch(() => null), getCurrentUser()]);
  if (!product) notFound();

  return (
    <EventDetailView
      event={{
        id: product.id,
        title: product.name,
        description: product.description,
        dateLabel: eventDateLabel(product.eventAt),
        place: product.address,
        participants: product.participants,
        capacity: product.capacity,
        priceLabel: formatWon(product.price),
        price: product.price,
        heroImageUrl: product.detailImageUrl,
        userId: user?.id ?? null,
      }}
    />
  );
}
