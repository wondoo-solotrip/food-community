import type { HTMLAttributes, ReactNode } from 'react';

import { Icon } from '@/components/foundation/Icon';
import type { IconName } from '@/components/foundation/Icon';
import { cn } from '@/lib/cn';

export interface CardProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** 제목 — heading-lg */
  title: string;
  /** 설명 — body-lg. 생략 가능합니다. */
  description?: string;
  /** 메타 텍스트 — label-md. 생략 가능합니다. */
  meta?: string;
  /** 메타 좌측 16px 아이콘. `meta`가 있을 때만 렌더됩니다. */
  metaIcon?: IconName;
  /**
   * 이미지 영역 — 넘기면 172px 높이의 미디어 영역이 추가되고, 생략하면 영역 자체가 빠집니다.
   * (가이드: "이미지 영역 추가/제외 가능")
   */
  media?: ReactNode;
  /** 액션 영역 — Button 컴포넌트를 넣습니다. 생략 가능합니다. */
  actions?: ReactNode;
  /** 바디 하단에 추가로 들어갈 콘텐츠. */
  children?: ReactNode;
}

/**
 * design.pen `Card / Default`.
 * 가로·세로 auto, cornerRadius 8, border-default 1px, shadow(0 8 24 / shadow-card).
 */
export function Card({
  title,
  description,
  meta,
  metaIcon = 'calendar',
  media,
  actions,
  children,
  className,
  ...rest
}: CardProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-4 overflow-hidden rounded-lg border border-border-default bg-background-card',
        'shadow-[0_8px_24px_var(--color-shadow-card)]',
        className,
      )}
      {...rest}
    >
      {media !== undefined && (
        // Image Area — 높이 172px 고정, 로딩 전에는 media-placeholder 배경이 보입니다.
        <div className="h-[172px] w-full shrink-0 overflow-hidden bg-background-media-placeholder">
          {media}
        </div>
      )}
      {/* Card Body — padding [0,20,20,20], gap 10 */}
      <div className="flex flex-col gap-2.5 px-5 pb-5">
        <span className="text-heading-lg text-text-default">{title}</span>
        {description && <span className="text-body-lg text-text-muted">{description}</span>}
        {meta && (
          // Card Meta Row — 16px 아이콘 + label-md, gap 8
          <div className="flex items-center gap-2">
            <Icon name={metaIcon} size={16} className="shrink-0 text-icon-muted" />
            <span className="text-label-md text-text-muted">{meta}</span>
          </div>
        )}
        {children}
        {actions && <div className="flex items-center gap-2 pt-1.5">{actions}</div>}
      </div>
    </div>
  );
}
