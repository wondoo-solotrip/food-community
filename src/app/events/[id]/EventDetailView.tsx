'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { AppTopNav } from '@/components/app/AppTopNav';
import { Icon } from '@/components/foundation/Icon';
import type { IconName } from '@/components/foundation/Icon';
import { Typography } from '@/components/foundation/Typography';
import { Badge } from '@/components/ui/Badge';
import { BottomSheet } from '@/components/ui/BottomSheet';
import { Button } from '@/components/ui/Button';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Toast } from '@/components/ui/Toast';
import { requestEventPayment } from '@/lib/portone/payment';

/** 서버 페이지가 조립해 내려주는 상세 뷰 모델 — 날짜·금액 표기는 문자열로 끝나 있다. */
export interface EventDetailViewModel {
  id: string;
  title: string;
  description: string;
  /** '2026년 8월 8일 (토) · 오전 10시' */
  dateLabel: string;
  place: string;
  participants: number;
  capacity: number;
  /** '30,000원' */
  priceLabel: string;
  /** 결제창에 넘길 원 단위 금액(`product.price`) — 표기는 priceLabel 이 담당한다. */
  price: number;
  heroImageUrl: string;
  /** 로그인 사용자 id(미로그인 null) — 결제 원장은 user_id 가 필수라 로그인해야 결제할 수 있다. */
  userId: string | null;
}

/** 아이콘 + 한 줄 텍스트 정보 행 — design.pen Event Facts */
function FactRow({ icon, text }: { icon: IconName; text: string }) {
  return (
    <div className="flex items-center gap-3">
      <Icon name={icon} size={20} className="shrink-0 text-icon-brand" />
      <span className="text-body-md text-text-default">{text}</span>
    </div>
  );
}

/** design.pen `10 Paid Event Detail Page` + `11 Payment Bottom Sheet` — 유료 모임 상세와 결제 확인 시트. */
export function EventDetailView({ event }: { event: EventDetailViewModel }) {
  const router = useRouter();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [paying, setPaying] = useState(false);
  const [payError, setPayError] = useState<string | null>(null);

  const remaining = event.capacity - event.participants;

  // 리다이렉트 흐름에서 PG 페이지 뒤로가기로 돌아오면 bfcache 가 paying=true 화면을 복원한다 — 복원 시 풀어 준다.
  useEffect(() => {
    function handlePageShow(e: PageTransitionEvent) {
      if (e.persisted) setPaying(false);
    }
    window.addEventListener('pageshow', handlePageShow);
    return () => window.removeEventListener('pageshow', handlePageShow);
  }, []);

  /** 포트원 결제창 호출(.claude/rules/payment.md). PC 는 반환값, 모바일은 redirectUrl 로 결과가 온다. */
  async function handlePayment() {
    if (paying) return;
    // 결제 원장이 결제 건을 사용자와 이어야 해서(웹훅 customData) 로그인 없이는 결제창을 열지 않는다.
    if (!event.userId) {
      setPayError('로그인 후 결제할 수 있어요.');
      return;
    }
    setPaying(true);
    setPayError(null);

    const result = await requestEventPayment({
      productId: event.id,
      userId: event.userId,
      orderName: event.title,
      totalAmount: event.price,
    });

    // 리다이렉트 흐름이면 페이지가 넘어가는 중 — 상태를 건드리지 않는다.
    if (result.status === 'redirected') return;

    setPaying(false);
    if (result.status === 'failed') {
      setPayError(result.message);
      return;
    }
    router.push(`/events/${event.id}/complete?paymentId=${result.paymentId}`);
  }

  return (
    <div className="flex min-h-dvh flex-1 flex-col bg-background-screen">
      <AppTopNav title="모임 상세" leftIcon="chevron-left" leftIconLabel="뒤로 가기" leftHref="/" />

      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col">
        {/* Event Hero Image — product.image_path_detail(상세용) */}
        <div
          className="h-[284px] w-full bg-background-media-placeholder bg-cover bg-center"
          style={{ backgroundImage: `url(${event.heroImageUrl})` }}
          role="img"
          aria-label={`${event.title} 대표 이미지`}
        />

        {/* Event Detail Body */}
        <div className="flex flex-col gap-4 px-5 pt-5 pb-4">
          {/* DB 에 카테고리 컬럼이 없어 고정 문구를 쓴다. */}
          <Badge variant="neutral" label="이웃 모임" className="w-fit" />
          <Typography variant="heading-lg" as="h1" className="whitespace-pre-line">
            {event.title}
          </Typography>
          <Typography variant="body-md" as="p" className="text-text-muted">
            {event.description}
          </Typography>

          {/* Event Facts */}
          <div className="flex flex-col gap-3 border-y border-border-default py-4">
            <FactRow icon="calendar" text={event.dateLabel} />
            <FactRow icon="home" text={event.place} />
            <FactRow
              icon="user"
              text={`현재 ${event.participants}명 · 최대 ${event.capacity}명`}
            />
          </div>

          {/* Event Price Summary */}
          <div className="flex items-center justify-between">
            <span className="text-body-md text-text-muted">참가비</span>
            <span className="text-heading-md text-text-default">{event.priceLabel}</span>
          </div>
        </div>
      </main>

      {/* Event Detail CTA Bar — 설치 유도 띠가 떠 있으면 그 위로 올라선다. */}
      <div className="sticky bottom-[var(--install-bar-h,0px)] z-10 border-t border-border-default bg-background-card">
        <div className="mx-auto w-full max-w-7xl px-5 py-4">
          <Button
            size="lg"
            label="상품 결제하기"
            trailingIcon="arrow-right"
            className="w-full"
            onClick={() => setSheetOpen(true)}
          />
        </div>
      </div>

      {/* Payment Bottom Sheet — DS BottomSheet 는 컨테이너 기준이라 화면 전체 오버레이로 감싼다. */}
      {sheetOpen && (
        <div className="fixed inset-0 z-50">
          <BottomSheet
            className="h-full"
            onClose={() => {
              setSheetOpen(false);
              setPayError(null);
            }}
          >
            {/* Payment Sheet Header */}
            <div className="flex flex-col gap-2">
              <Typography variant="heading-md" as="h2">
                결제 정보 확인
              </Typography>
              <span className="text-body-md text-text-muted">
                참여 인원과 결제 금액을 확인해 주세요.
              </span>
            </div>

            {/* Payment Product Summary */}
            <div className="flex flex-col gap-3 border-y border-border-default py-4">
              <div className="flex items-center justify-between">
                <span className="text-label-lg text-text-default">{event.title}</span>
                <Badge variant="success" label={`${remaining}자리 남음`} />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-body-md text-text-muted">
                  참여자 {event.participants}명
                </span>
                <span className="text-body-md text-text-muted">최대 {event.capacity}명</span>
              </div>
              <ProgressBar
                value={event.participants}
                max={event.capacity}
                aria-label="정원 현황"
              />
            </div>

            {/* Payment Total Row */}
            <div className="flex items-center justify-between">
              <span className="text-body-md text-text-muted">총 결제 금액</span>
              <span className="text-heading-md text-text-default">{event.priceLabel}</span>
            </div>

            {/* 결제 실패(결제창 닫기 포함) 안내 — mypage 처럼 Toast(error) 를 시트 폭에 맞춰 쓴다. */}
            {payError && (
              <Toast
                type="error"
                message={payError}
                className="sm:w-full!"
                onDismiss={() => setPayError(null)}
              />
            )}

            {/* 정원이 다 차면 결제할 수 없다(PRD v1.1). 성공 시 완료 화면으로 이동한다. */}
            <Button
              size="lg"
              label={paying ? '결제 진행 중…' : `${event.priceLabel} 결제하기`}
              trailingIcon="arrow-right"
              className="w-full"
              disabled={remaining <= 0 || paying}
              onClick={handlePayment}
            />
          </BottomSheet>
        </div>
      )}
    </div>
  );
}
