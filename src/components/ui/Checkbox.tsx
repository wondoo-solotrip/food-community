import type { InputHTMLAttributes, ReactNode } from 'react';

import { cn } from '@/lib/cn';

export type CheckboxSize = 'sm' | 'md';
export type CheckboxSelection = 'unchecked' | 'checked' | 'indeterminate';
export type CheckboxState = 'default' | 'disabled' | 'error';

export const checkboxSizes: CheckboxSize[] = ['sm', 'md'];
export const checkboxSelections: CheckboxSelection[] = ['unchecked', 'checked', 'indeterminate'];
export const checkboxStates: CheckboxState[] = ['default', 'disabled', 'error'];

/** Check Area 한 변 — design.pen `Checkbox / <size> / <selection> / <state>` */
const areaSizeStyles: Record<CheckboxSize, string> = { sm: 'size-4', md: 'size-5' };

/** 체크 마크 SVG 박스. design.pen path는 sm 8×6.4 / md 10×8로 비례 확대됩니다. */
const markSizeStyles: Record<CheckboxSize, string> = { sm: 'size-3', md: 'size-[15px]' };

/** 인디터미네이트 바 — 높이 2px 고정, 폭만 사이즈별로 다릅니다. */
const barSizeStyles: Record<CheckboxSize, string> = { sm: 'h-0.5 w-2', md: 'h-0.5 w-2.5' };

/** 배경 · 테두리는 (선택 여부 × 상태) 조합으로 결정됩니다. */
const areaStateStyles: Record<CheckboxState, { filled: string; empty: string }> = {
  default: {
    filled: 'bg-background-brand border-border-brand',
    empty: 'bg-background-card border-border-strong',
  },
  disabled: {
    filled: 'bg-background-disabled border-border-brand',
    empty: 'bg-background-disabled border-border-strong',
  },
  error: {
    filled: 'bg-background-brand border-border-error-strong',
    empty: 'bg-background-card border-border-error-strong',
  },
};

const labelStateStyles: Record<CheckboxState, string> = {
  default: 'text-text-default',
  disabled: 'text-text-muted',
  error: 'text-text-error',
};

export interface CheckboxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'type' | 'checked'> {
  size?: CheckboxSize;
  selection?: CheckboxSelection;
  /** 우측 레이블 — body-md, 체크 영역과 8px 간격 */
  label: string;
  error?: boolean;
}

/**
 * design.pen `Component / Checkbox`.
 * 사이즈(sm 16 / md 20) × 선택(unchecked·checked·indeterminate) × 상태(default·disabled·error).
 * 체크 표시는 아이코노그래피를 쓰지 않고 design.pen의 path(`M2 6l3 3 5-7`)와
 * 인디터미네이트 사각형을 그대로 재현합니다.
 */
export function Checkbox({
  size = 'sm',
  selection = 'unchecked',
  label,
  error = false,
  disabled = false,
  className,
  ...rest
}: CheckboxProps) {
  const state: CheckboxState = disabled ? 'disabled' : error ? 'error' : 'default';
  const filled = selection !== 'unchecked';

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
        checked={selection === 'checked'}
        disabled={disabled}
        readOnly
        aria-checked={selection === 'indeterminate' ? 'mixed' : selection === 'checked'}
        aria-invalid={error || undefined}
        className="sr-only"
        {...rest}
      />

      {/* Check Area */}
      <span
        aria-hidden
        className={cn(
          'flex shrink-0 items-center justify-center rounded-sm border',
          areaSizeStyles[size],
          filled ? areaStateStyles[state].filled : areaStateStyles[state].empty,
        )}
      >
        {selection === 'checked' && (
          <svg
            viewBox="0 0 12 12"
            fill="none"
            className={cn(markSizeStyles[size], 'text-icon-inverse')}
          >
            <path
              d="M2 6l3 3 5-7"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
        {selection === 'indeterminate' && (
          <span className={cn('rounded-[1px] bg-icon-inverse', barSizeStyles[size])} />
        )}
      </span>

      <span className={cn('text-body-md', labelStateStyles[state])}>{label}</span>
    </label>
  );
}

export interface CheckboxGroupProps {
  /** 그룹 레이블 — label-lg */
  label: string;
  /** 그룹 전체에 대한 에러 메시지. 개별 체크박스가 아니라 폼 아래에 1번만 표시합니다. */
  errorText?: string;
  children: ReactNode;
  className?: string;
}

/**
 * design.pen `Default Group` / `Error Group`.
 * 체크박스는 단독·그룹 모두 사용 가능하며, 그룹 에러 메시지는 폼 하단에 한 번만 노출됩니다.
 */
export function CheckboxGroup({ label, errorText, children, className }: CheckboxGroupProps) {
  return (
    <fieldset
      className={cn('flex flex-col gap-2', className)}
      aria-invalid={errorText ? true : undefined}
    >
      <legend className="text-label-lg text-text-default">{label}</legend>
      {children}
      {errorText && <p className="text-label-md text-text-error">{errorText}</p>}
    </fieldset>
  );
}
