import type { HTMLAttributes } from 'react';

import { Icon } from '@/components/foundation/Icon';
import type { IconName } from '@/components/foundation/Icon';
import { cn } from '@/lib/cn';

import { Button } from './Button';

export interface EmptyProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** 비주얼 영역 아이콘 — 넘기면 64x64 비주얼 영역이 추가되고, 생략하면 영역 자체가 빠집니다. */
  visualIcon?: IconName;
  /** 제목 — heading-sm */
  title: string;
  /** 설명 — body-md. 생략 가능합니다. */
  description?: string;
  /** primary 액션 레이블. 없으면 primary 버튼이 빠집니다. */
  primaryLabel?: string;
  onPrimaryClick?: () => void;
  /** secondary 액션 레이블. 없으면 secondary 버튼이 빠집니다. */
  secondaryLabel?: string;
  onSecondaryClick?: () => void;
}

/**
 * design.pen `Empty / Default`.
 * 가로·세로 중앙 정렬, gap 18, cornerRadius 8, border-default 1px.
 * 액션은 secondary → primary 순서로 배치됩니다.
 */
export function Empty({
  visualIcon,
  title,
  description,
  primaryLabel,
  onPrimaryClick,
  secondaryLabel,
  onSecondaryClick,
  className,
  ...rest
}: EmptyProps) {
  const hasActions = Boolean(primaryLabel || secondaryLabel);

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-[18px] rounded-lg border border-border-default bg-background-card p-6',
        className,
      )}
      {...rest}
    >
      {visualIcon && (
        // Visual Area — 64x64, cornerRadius 8, background-inverse 위 24px 아이콘
        <div className="flex size-16 shrink-0 items-center justify-center rounded-lg bg-background-inverse">
          <Icon name={visualIcon} size={24} className="text-icon-inverse" />
        </div>
      )}
      {/* Empty Copy — gap 8, 가운데 정렬 */}
      <div className="flex flex-col items-center gap-2">
        <span className="text-center text-heading-sm text-text-default">{title}</span>
        {description && (
          <span className="text-center text-body-md text-text-muted">{description}</span>
        )}
      </div>
      {hasActions && (
        // Actions — secondary 1개 + primary 1개, gap 8
        <div className="flex items-center justify-center gap-2">
          {secondaryLabel && (
            <Button variant="secondary" label={secondaryLabel} onClick={onSecondaryClick} />
          )}
          {primaryLabel && (
            <Button variant="primary" label={primaryLabel} onClick={onPrimaryClick} />
          )}
        </div>
      )}
    </div>
  );
}
