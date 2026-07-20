import type { HTMLAttributes } from 'react';

import { cn } from '@/lib/cn';

export type BadgeVariant = 'neutral' | 'success' | 'error' | 'info' | 'warning';
export type BadgeSize = 'md' | 'lg';

export const badgeVariants: BadgeVariant[] = ['neutral', 'success', 'error', 'info', 'warning'];
export const badgeSizes: BadgeSize[] = ['md', 'lg'];

/** 높이 — design.pen `Badge / <type> / md`(20) · `lg`(24). 좌우 패딩은 두 사이즈 모두 8px. */
const sizeStyles: Record<BadgeSize, string> = {
  md: 'h-5',
  lg: 'h-6',
};

/** 배경 + 온컬러 레이블 조합 — design.pen Badge Type Rows */
const variantStyles: Record<BadgeVariant, string> = {
  neutral: 'bg-background-inverse text-text-inverse',
  success: 'bg-background-success text-text-on-success',
  error: 'bg-background-error text-text-on-error',
  info: 'bg-background-info text-text-on-info',
  warning: 'bg-background-warning text-text-on-warning',
};

export interface BadgeProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'> {
  variant?: BadgeVariant;
  size?: BadgeSize;
  /** 레이블 — 12px semibold(design.pen Badge Label)로 가운데 정렬됩니다. */
  label: string;
}

/**
 * design.pen `Component / Badge`.
 * 타입(neutral·success·error·info·warning) × 사이즈(md 20 / lg 24). 상태는 없습니다.
 */
export function Badge({ variant = 'neutral', size = 'md', label, className, ...rest }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex shrink-0 items-center justify-center rounded-full px-2 text-center text-label-md font-semibold',
        sizeStyles[size],
        variantStyles[variant],
        className,
      )}
      {...rest}
    >
      {label}
    </span>
  );
}
