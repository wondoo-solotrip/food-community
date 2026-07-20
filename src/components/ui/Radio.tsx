import type { InputHTMLAttributes, ReactNode } from 'react';

import { cn } from '@/lib/cn';

export type RadioSize = 'sm' | 'md';
export type RadioSelection = 'unselected' | 'selected';
export type RadioState = 'default' | 'disabled';

export const radioSizes: RadioSize[] = ['sm', 'md'];
export const radioSelections: RadioSelection[] = ['unselected', 'selected'];
export const radioStates: RadioState[] = ['default', 'disabled'];

/** Radio Area 지름 — design.pen `Radio / <size> / <selection> / <state>` */
const areaSizeStyles: Record<RadioSize, string> = { sm: 'size-4', md: 'size-5' };

/**
 * 선택 상태는 5px 브랜드 링(inner stroke)으로 표현합니다.
 * 아이코노그래피 아이콘을 쓰지 않고 원의 테두리 두께만으로 그립니다.
 */
const areaSelectionStyles: Record<RadioSelection, string> = {
  unselected: 'border border-border-strong',
  selected: 'border-[5px] border-border-brand',
};

const areaFillStyles: Record<RadioState, string> = {
  default: 'bg-background-card',
  disabled: 'bg-background-disabled',
};

const labelStateStyles: Record<RadioState, string> = {
  default: 'text-text-default',
  disabled: 'text-text-muted',
};

export interface RadioProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'type' | 'checked'> {
  size?: RadioSize;
  selection?: RadioSelection;
  /** 우측 레이블 — body-md, 라디오 영역과 8px 간격 */
  label: string;
}

/**
 * design.pen `Component / Radio`.
 * 사이즈(sm 16 / md 20) × 선택(unselected·selected) × 상태(default·disabled).
 * 단독 사용은 금지되어 있으므로 항상 `RadioGroup` 안에서 사용합니다.
 */
export function Radio({
  size = 'sm',
  selection = 'unselected',
  label,
  disabled = false,
  className,
  ...rest
}: RadioProps) {
  const state: RadioState = disabled ? 'disabled' : 'default';

  return (
    <label
      className={cn(
        'flex h-8 items-center gap-2',
        disabled ? 'cursor-not-allowed' : 'cursor-pointer',
        className,
      )}
    >
      <input
        type="radio"
        checked={selection === 'selected'}
        disabled={disabled}
        readOnly
        className="sr-only"
        {...rest}
      />

      {/* Radio Area */}
      <span
        aria-hidden
        className={cn(
          'box-border shrink-0 rounded-full',
          areaSizeStyles[size],
          areaSelectionStyles[selection],
          areaFillStyles[state],
        )}
      />

      <span className={cn('text-body-md', labelStateStyles[state])}>{label}</span>
    </label>
  );
}

export interface RadioGroupProps {
  /** 그룹 레이블 — label-lg */
  label: string;
  children: ReactNode;
  className?: string;
}

/**
 * design.pen `Default Radio Group` / `Disabled Radio Group`.
 * 라디오는 단독 사용이 금지되어 있어 항상 이 그룹으로 감쌉니다.
 */
export function RadioGroup({ label, children, className }: RadioGroupProps) {
  return (
    <fieldset className={cn('flex flex-col gap-2', className)} role="radiogroup">
      <legend className="text-label-lg text-text-default">{label}</legend>
      {children}
    </fieldset>
  );
}
