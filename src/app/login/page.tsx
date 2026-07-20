'use client';

import { useRouter } from 'next/navigation';

import { Icon } from '@/components/foundation/Icon';
import { Typography } from '@/components/foundation/Typography';
import { Button } from '@/components/ui/Button';

const PREVIEW_IMAGE_URL =
  'https://images.unsplash.com/photo-1708388464803-d975f7d9a3d5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080';

/** design.pen `04 Login Page` — 브랜드 인트로 + 맛집 프리뷰 + Google 로그인. */
export default function LoginPage() {
  const router = useRouter();

  return (
    <div className="flex min-h-dvh flex-1 flex-col bg-background-screen">
      <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-between gap-6 px-5 pt-2 pb-8">
        {/* Login Intro */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <div className="flex size-9 items-center justify-center rounded-lg bg-background-brand">
              <Icon name="utensils" size={20} className="text-icon-inverse" />
            </div>
            {/* design.pen: 16px bold — heading-sm(600)에서 굵기만 bold로 상향 */}
            <Typography variant="heading-sm" as="span" className="font-bold text-text-brand">
              숨은 맛집
            </Typography>
          </div>
          <Typography variant="display-lg" as="h1">
            구로 근처의 진짜 맛집을 이웃과 나눠요
          </Typography>
          <Typography variant="body-lg" className="text-text-muted">
            광고보다 가까운 사람의 추천을 믿고, 주말에 차로 다녀올 만한 숨은 식당을 발견하세요.
          </Typography>
        </div>

        {/* Login Food Preview */}
        <div className="relative h-[258px] w-full overflow-hidden rounded-lg border border-border-default bg-background-media-placeholder">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${PREVIEW_IMAGE_URL})` }}
          />
          <div className="absolute inset-x-0 bottom-0 h-[140px] bg-linear-to-b from-overlay-photo-bottom-start via-overlay-photo-bottom-mid via-45% to-overlay-photo-bottom-end" />
          <div className="absolute inset-x-4 bottom-8 flex flex-col gap-2">
            {/* design.pen: 12px semibold — label-md(400)에서 굵기만 semibold로 상향 */}
            <span className="text-label-md font-semibold text-alpha-white-60">이번 주말 추천</span>
            <span className="text-heading-lg text-text-inverse">문래, 조용한 저녁 한 끼</span>
          </div>
        </div>

        {/* Login Actions */}
        <div className="flex flex-col gap-3">
          <Button
            variant="primary"
            label="Google로 시작하기"
            className="w-full"
            onClick={() => router.push('/')}
          />
          <p className="text-center text-label-md text-text-subtle">
            계속하면 커뮤니티 이용약관과 개인정보 처리방침에 동의하게 됩니다.
          </p>
        </div>
      </main>
    </div>
  );
}
