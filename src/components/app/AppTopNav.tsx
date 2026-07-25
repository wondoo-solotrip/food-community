'use client';

import { useRouter } from 'next/navigation';

import type { IconName } from '@/components/foundation/Icon';
import { TopNavigation } from '@/components/ui/TopNavigation';
import type { TopNavigationIconTone } from '@/components/ui/TopNavigation';

export interface AppTopNavProps {
  title: string;
  leftIcon?: IconName;
  leftIconLabel?: string;
  /** 좌측 아이콘 클릭 시 이동할 경로. 생략하면 뒤로 가기로 동작합니다. */
  leftHref?: string;
  rightIcon?: IconName;
  rightIconTone?: TopNavigationIconTone;
  rightIconLabel?: string;
  rightHref?: string;
  /** 우측 아이콘 클릭 시 이동 전에 실행할 동작(예: 작성 중이던 초안 비우기). */
  onRightClick?: () => void;
}

/** DS TopNavigation에 라우팅만 연결한 앱 셸 래퍼입니다. */
export function AppTopNav({
  title,
  leftIcon,
  leftIconLabel,
  leftHref,
  rightIcon,
  rightIconTone,
  rightIconLabel,
  rightHref,
  onRightClick,
}: AppTopNavProps) {
  const router = useRouter();

  return (
    <header className="sticky top-0 z-10 border-b border-border-default bg-background-card">
      {/* 배경/보더는 풀블리드, 내비 내용은 본문과 동일한 max-w-7xl 제한 */}
      <TopNavigation
        className="mx-auto max-w-7xl border-b-0"
        title={title}
        leftIcon={leftIcon}
        leftIconLabel={leftIconLabel}
        onLeftClick={
          leftIcon ? () => (leftHref ? router.push(leftHref) : router.back()) : undefined
        }
        rightIcon={rightIcon}
        rightIconTone={rightIconTone}
        rightIconLabel={rightIconLabel}
        onRightClick={
          rightIcon && (rightHref || onRightClick)
            ? () => {
                onRightClick?.();
                if (rightHref) router.push(rightHref);
              }
            : undefined
        }
      />
    </header>
  );
}
