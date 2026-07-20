import type { ButtonHTMLAttributes } from 'react';

import { Icon } from '@/components/foundation/Icon';
import { cn } from '@/lib/cn';

export type SelectItemSize = 'sm' | 'md' | 'lg';
export type SelectItemState = 'default' | 'selected' | 'disabled';

export const selectItemSizes: SelectItemSize[] = ['sm', 'md', 'lg'];
export const selectItemStates: SelectItemState[] = ['default', 'selected', 'disabled'];

/** 높이 · 좌우 패딩 — 참조하는 Select의 사이즈를 따릅니다. */
const sizeStyles: Record<SelectItemSize, string> = {
  sm: 'h-8 px-2.5',
  md: 'h-10 px-3',
  lg: 'h-12 px-3',
};

/** sm은 16px, md·lg는 20px 체크 아이콘 */
const iconSizes: Record<SelectItemSize, 16 | 20> = { sm: 16, md: 20, lg: 20 };

const stateStyles: Record<SelectItemState, string> = {
  default: 'bg-background-card text-text-default',
  selected: 'bg-background-card text-text-default',
  disabled: 'bg-background-disabled text-text-muted',
};

export interface SelectItemProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  size?: SelectItemSize;
  /** 좌측 옵션 텍스트 — body-lg */
  label: string;
  selected?: boolean;
}

/**
 * design.pen `Component / Select Item`.
 * 사이즈(sm 32 / md 40 / lg 48) × 상태(default·selected·disabled).
 * selected일 때만 우측에 check 아이콘(icon-brand)이 붙습니다.
 */
export function SelectItem({
  size = 'md',
  label,
  selected = false,
  disabled = false,
  className,
  type = 'button',
  ...rest
}: SelectItemProps) {
  const state: SelectItemState = disabled ? 'disabled' : selected ? 'selected' : 'default';

  return (
    <button
      type={type}
      role="option"
      aria-selected={selected}
      disabled={disabled}
      className={cn(
        'flex w-full items-center gap-2 rounded-sm text-left text-body-lg',
        sizeStyles[size],
        stateStyles[state],
        disabled ? 'cursor-not-allowed' : 'cursor-pointer',
        className,
      )}
      {...rest}
    >
      <span className="min-w-0 flex-1 truncate">{label}</span>
      {selected && !disabled && (
        <Icon name="check" size={iconSizes[size]} className="text-icon-brand" />
      )}
    </button>
  );
}
