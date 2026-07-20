import type { InputHTMLAttributes } from 'react';

import { cn } from '@/lib/cn';

export type SwitchSize = 'sm' | 'md';
export type SwitchSelection = 'off' | 'on';
export type SwitchState = 'default' | 'disabled';

export const switchSizes: SwitchSize[] = ['sm', 'md'];
export const switchSelections: SwitchSelection[] = ['off', 'on'];
export const switchStates: SwitchState[] = ['default', 'disabled'];

/** Switch Track — sm 32×16, md 40×20. design.pen `Switch / <size> / <selection> / <state>` */
const trackSizeStyles: Record<SwitchSize, string> = { sm: 'h-4 w-8', md: 'h-5 w-10' };

/** Thumb — 트랙 안쪽 2px 여백. off는 좌측, on은 우측 끝으로 이동합니다. */
const thumbSizeStyles: Record<SwitchSize, string> = { sm: 'size-3', md: 'size-4' };
const thumbOffsetStyles: Record<SwitchSize, Record<SwitchSelection, string>> = {
  sm: { off: 'translate-x-0', on: 'translate-x-4' },
  md: { off: 'translate-x-0', on: 'translate-x-5' },
};

const trackFillStyles: Record<SwitchState, Record<SwitchSelection, string>> = {
  default: { off: 'bg-background-muted', on: 'bg-background-brand' },
  disabled: { off: 'bg-background-disabled', on: 'bg-background-disabled' },
};

const labelStateStyles: Record<SwitchState, string> = {
  default: 'text-text-default',
  disabled: 'text-text-muted',
};

export interface SwitchProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'type' | 'checked'> {
  size?: SwitchSize;
  selection?: SwitchSelection;
  /** 우측 레이블 — body-md, 트랙과 8px 간격 */
  label: string;
}

/**
 * design.pen `Component / Switch`.
 * 사이즈(sm 16·가로 32 / md 20·가로 40) × 선택(off·on) × 상태(default·disabled).
 * 아이코노그래피 아이콘 없이 트랙 + 원형 썸으로만 그립니다. 단독 사용 전용입니다.
 */
export function Switch({
  size = 'sm',
  selection = 'off',
  label,
  disabled = false,
  className,
  ...rest
}: SwitchProps) {
  const state: SwitchState = disabled ? 'disabled' : 'default';

  return (
    <label
      className={cn(
        'flex h-8 items-center gap-2',
        disabled ? 'cursor-not-allowed' : 'cursor-pointer',
        className,
      )}
    >
      <input
        type="checkbox"
        role="switch"
        checked={selection === 'on'}
        disabled={disabled}
        readOnly
        aria-checked={selection === 'on'}
        className="sr-only"
        {...rest}
      />

      {/* Switch Track */}
      <span
        aria-hidden
        className={cn(
          'relative shrink-0 rounded-full',
          trackSizeStyles[size],
          trackFillStyles[state][selection],
        )}
      >
        <span
          className={cn(
            'absolute top-0.5 left-0.5 rounded-full bg-background-card transition-transform',
            thumbSizeStyles[size],
            thumbOffsetStyles[size][selection],
          )}
        />
      </span>

      <span className={cn('text-body-md', labelStateStyles[state])}>{label}</span>
    </label>
  );
}
