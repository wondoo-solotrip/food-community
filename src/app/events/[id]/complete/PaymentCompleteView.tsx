'use client';

import { useRouter } from 'next/navigation';

import { AppTopNav } from '@/components/app/AppTopNav';
import { Icon } from '@/components/foundation/Icon';
import { Typography } from '@/components/foundation/Typography';
import { Button } from '@/components/ui/Button';

export interface ReceiptRow {
  label: string;
  value: string;
  emphasized?: boolean;
}

/** design.pen `12 Payment Complete Page` — 결제 완료 안내와 영수증 요약. */
export function PaymentCompleteView({
  message,
  receiptRows,
}: {
  /** 완료 안내 첫 줄 — '8월 8일, 요리교실에서 만나요.' */
  message: string;
  receiptRows: ReceiptRow[];
}) {
  const router = useRouter();

  return (
    <div className="flex min-h-dvh flex-1 flex-col bg-background-screen">
      {/* 완료 화면은 뒤로 가기 없이 아래 버튼으로만 이동한다. */}
      <AppTopNav title="결제 완료" />

      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col items-center gap-6 px-5 pt-8 pb-5">
        {/* Payment Success Mark */}
        <div className="flex size-[72px] shrink-0 items-center justify-center rounded-full bg-background-success-subtle">
          <Icon name="check" size={32} className="text-text-success" />
        </div>

        {/* Payment Complete Message */}
        <div className="flex flex-col items-center gap-2">
          <Typography variant="heading-lg" as="h1">
            결제가 완료되었어요
          </Typography>
          <p className="text-center text-body-md text-text-muted">
            {message}
            <br />
            참여 정보는 마이 페이지에서 확인할 수 있어요.
          </p>
        </div>

        {/* Payment Receipt Summary */}
        <dl className="flex w-full flex-col gap-3 rounded-lg bg-background-surface p-4">
          {receiptRows.map(({ label, value, emphasized }) => (
            <div key={label} className="flex items-center justify-between gap-4">
              <dt className="shrink-0 text-body-md text-text-muted">{label}</dt>
              <dd className={`text-body-md text-text-default ${emphasized ? 'font-bold' : ''}`}>
                {value}
              </dd>
            </div>
          ))}
        </dl>

        {/* Payment Complete Actions */}
        <div className="flex w-full flex-col gap-3">
          <Button
            size="lg"
            label="결제 내역 보기"
            trailingIcon="arrow-right"
            className="w-full"
            onClick={() => router.push('/mypage?tab=payments')}
          />
          <Button
            size="lg"
            variant="secondary"
            label="홈으로 돌아가기"
            className="w-full"
            onClick={() => router.push('/')}
          />
        </div>
      </main>
    </div>
  );
}
