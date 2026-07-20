import type { ButtonHTMLAttributes } from 'react';

import { Icon } from '@/components/foundation/Icon';
import type { IconName } from '@/components/foundation/Icon';
import { cn } from '@/lib/cn';

export type ChipSize = 'sm' | 'md';
export type ChipSelection = 'unselected' | 'selected';
export type ChipState = 'default' | 'disabled';

export const chipSizes: ChipSize[] = ['sm', 'md'];
export const chipSelections: ChipSelection[] = ['unselected', 'selected'];
export const chipStates: ChipState[] = ['default', 'disabled'];

/** 높이 — design.pen `Chip / <icon> / <size> / <selection> / <state>` */
const heightStyles: Record<ChipSize, string> = { sm: 'h-6', md: 'h-8' };

/** 좌우 패딩은 좌측 아이콘 유무에 따라 달라집니다. */
const paddingStyles: Record<ChipSize, { withIcon: string; withoutIcon: string }> = {
  sm: { withIcon: 'px-1.5', withoutIcon: 'px-3' },
  md: { withIcon: 'px-2', withoutIcon: 'px-4' },
};

/** 배경 · 테두리 · 텍스트 · 아이콘 — (선택 × 상태) 조합 */
const chipStyles: Record<ChipState, Record<ChipSelection, { surface: string; icon: string }>> = {
  default: {
    unselected: {
      surface: 'bg-background-card border-border-strong text-text-default',
      icon: 'text-icon-brand',
    },
    selected: {
      surface: 'bg-background-brand border-border-brand text-text-on-brand',
      icon: 'text-icon-inverse',
    },
  },
  disabled: {
    unselected: {
      surface: 'bg-background-disabled border-border-strong text-text-muted',
      icon: 'text-icon-muted',
    },
    selected: {
      surface: 'bg-background-disabled border-border-brand text-text-muted',
      icon: 'text-icon-muted',
    },
  },
};

export interface ChipProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  size?: ChipSize;
  selection?: ChipSelection;
  /** 가운데 정렬 레이블 — label-lg */
  label: string;
  /** 좌측 아이콘(16px 고정). 넣으면 좌우 패딩이 줄어듭니다. */
  leadingIcon?: IconName;
}

/**
 * design.pen `Component / Chip`.
 * 사이즈(sm 24 / md 32) × 선택(unselected·selected) × 상태(default·disabled).
 * 좌측 아이콘 유무로 좌우 패딩이 sm 12↔6, md 16↔8 로 바뀝니다.
 */
export function Chip({
  size = 'sm',
  selection = 'unselected',
  label,
  leadingIcon,
  disabled = false,
  className,
  type = 'button',
  ...rest
}: ChipProps) {
  const state: ChipState = disabled ? 'disabled' : 'default';
  const { surface, icon } = chipStyles[state][selection];

  return (
    <button
      type={type}
      disabled={disabled}
      aria-pressed={selection === 'selected'}
      className={cn(
        'inline-flex shrink-0 items-center justify-center gap-1.5 rounded-full border text-center text-label-lg',
        heightStyles[size],
        leadingIcon ? paddingStyles[size].withIcon : paddingStyles[size].withoutIcon,
        surface,
        disabled ? 'cursor-not-allowed' : 'cursor-pointer',
        className,
      )}
      {...rest}
    >
      {leadingIcon && <Icon name={leadingIcon} size={16} className={icon} />}
      <span>{label}</span>
    </button>
  );
}
