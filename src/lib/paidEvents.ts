/**
 * design.pen v1.1 마이페이지 결제·취소 내역(13~15)용 목업 데이터.
 * 결제 백엔드가 없어 src/lib/posts.ts 처럼 순수 모듈로 둔다.
 * 결제 취소만 메모리에서 취소 내역으로 옮긴다 — 새로고침하면 초기 상태로 돌아온다.
 * (상품·배너·상세 화면은 `src/lib/products.ts` 의 `product` 테이블 실데이터를 쓴다.)
 */

export interface PaymentRecord {
  id: string;
  /** '2026. 08. 23 (일) · 14:00' */
  dateLabel: string;
  title: string;
  place: string;
  amount: number;
  method: string;
  imageUrl: string;
}

export interface CancellationRecord {
  id: string;
  dateLabel: string;
  title: string;
  method: string;
  refundAmount: number;
  imageUrl: string;
  /** 취소 접수일 — '2026. 07. 12' */
  requestedAtLabel: string;
}

let payments: PaymentRecord[] = [
  {
    id: 'payment-workshop',
    dateLabel: '2026. 08. 23 (일) · 14:00',
    title: '숨은 맛집 발견 워크숍',
    place: '구로 어반라운지 2층',
    amount: 25000,
    method: '카카오페이',
    imageUrl:
      'https://images.unsplash.com/photo-1708388064805-5033b79512f4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
  },
  {
    id: 'payment-brunch',
    dateLabel: '2026. 09. 06 (일) · 11:00',
    title: '아이와 함께하는 브런치 모임',
    place: '고척 패밀리 키친',
    amount: 18000,
    method: '카카오페이',
    imageUrl:
      'https://images.unsplash.com/photo-1583254211338-57f4b21ed0f5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
  },
];

let cancellations: CancellationRecord[] = [
  {
    id: 'cancel-dessert-walk',
    dateLabel: '2026. 07. 19 (일) · 16:00',
    title: '구로 골목 디저트 산책',
    method: '카카오페이',
    refundAmount: 20000,
    imageUrl:
      'https://images.unsplash.com/photo-1631148625910-e48b149a64d4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    requestedAtLabel: '2026. 07. 12',
  },
];

export function listPayments(): PaymentRecord[] {
  return [...payments];
}

export function listCancellations(): CancellationRecord[] {
  return [...cancellations];
}

/** 결제 내역에서 빼서 취소 내역 맨 앞에 넣는다. 접수일은 취소한 날짜다. */
export function cancelPayment(id: string): void {
  const target = payments.find((payment) => payment.id === id);
  if (!target) return;

  const now = new Date();
  const requestedAtLabel = `${now.getFullYear()}. ${String(now.getMonth() + 1).padStart(2, '0')}. ${String(now.getDate()).padStart(2, '0')}`;

  payments = payments.filter((payment) => payment.id !== id);
  cancellations = [
    {
      id: target.id,
      dateLabel: target.dateLabel,
      title: target.title,
      method: target.method,
      refundAmount: target.amount,
      imageUrl: target.imageUrl,
      requestedAtLabel,
    },
    ...cancellations,
  ];
}
