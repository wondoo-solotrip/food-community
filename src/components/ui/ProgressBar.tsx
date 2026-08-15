import { cn } from '@/lib/cn';

export interface ProgressBarProps {
  /** 현재 값. 0~max 범위로 잘라서 그립니다. */
  value: number;
  /** 최대값 — 기본 100. */
  max?: number;
  className?: string;
  /** 게이지만 있는 요소이므로 접근성 레이블을 권장합니다. */
  'aria-label'?: string;
}

/**
 * design.pen `11 Paid Event Detail / Payment Bottom Sheet`의 정원 게이지.
 * 높이 6px 트랙(background-muted, rounded-full) 위에 background-brand 채움을 비율만큼 그립니다.
 */
export function ProgressBar({
  value,
  max = 100,
  className,
  'aria-label': ariaLabel,
}: ProgressBarProps) {
  const ratio = max > 0 ? Math.min(Math.max(value / max, 0), 1) : 0;

  return (
    <div
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-label={ariaLabel}
      className={cn('h-1.5 w-full overflow-hidden rounded-full bg-background-muted', className)}
    >
      <div className="h-full rounded-full bg-background-brand" style={{ width: `${ratio * 100}%` }} />
    </div>
  );
}
