import { cn } from '@/lib/cn';

export type SpinnerSize = 16 | 20 | 24;

export const spinnerSizes: SpinnerSize[] = [16, 20, 24];

export interface SpinnerProps {
  /** design.pen 기준 사이즈는 md(24)이며, 버튼 내부에서 16/20을 사용합니다. */
  size?: SpinnerSize;
  /** 트랙(배경 링) stroke 클래스. 기본은 background-muted. */
  trackClassName?: string;
  /** 인디케이터(회전 호) stroke 클래스. 기본은 background-brand. */
  indicatorClassName?: string;
  className?: string;
  'aria-label'?: string;
}

/**
 * design.pen `Spinner / md / Brand`.
 * 링 두께는 innerRadius 0.66 → 지름의 17% 입니다. 인디케이터 호는 100도(전체의 약 27.8%).
 */
export function Spinner({
  size = 24,
  trackClassName = 'stroke-background-muted',
  indicatorClassName = 'stroke-background-brand',
  className,
  'aria-label': ariaLabel,
}: SpinnerProps) {
  // viewBox 24 기준: 바깥 반지름 12, 안쪽 반지름 7.92 → 중심선 9.96 / 두께 4.08
  const radius = 9.96;
  const circumference = 2 * Math.PI * radius;
  const arc = circumference * (100 / 360);

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      role={ariaLabel ? 'status' : undefined}
      aria-label={ariaLabel}
      aria-hidden={ariaLabel ? undefined : true}
      className={cn('animate-spin', className)}
    >
      <circle
        cx="12"
        cy="12"
        r={radius}
        strokeWidth="4.08"
        className={trackClassName}
      />
      <circle
        cx="12"
        cy="12"
        r={radius}
        strokeWidth="4.08"
        strokeLinecap="butt"
        strokeDasharray={`${arc} ${circumference - arc}`}
        transform="rotate(20 12 12)"
        className={indicatorClassName}
      />
    </svg>
  );
}
