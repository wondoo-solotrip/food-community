import type { ButtonHTMLAttributes } from 'react';

import { Icon } from '@/components/foundation/Icon';
import type { IconName } from '@/components/foundation/Icon';
import { cn } from '@/lib/cn';

export type IconButtonVariant = 'ghost' | 'circle-brand' | 'circle-neutral';

export const iconButtonVariants: IconButtonVariant[] = ['ghost', 'circle-brand', 'circle-neutral'];

/** 배경 + 아이콘 색 조합 — design.pen Component / Icon Button */
const variantStyles: Record<IconButtonVariant, { surface: string; icon: string }> = {
  ghost: { surface: 'bg-background-transparent', icon: 'text-icon-brand' },
  'circle-brand': { surface: 'bg-background-brand', icon: 'text-icon-inverse' },
  'circle-neutral': { surface: 'bg-background-muted', icon: 'text-icon-default' },
};

export interface IconButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  variant?: IconButtonVariant;
  icon: IconName;
  /** 아이콘만 있는 버튼이므로 접근성 레이블은 필수입니다. */
  'aria-label': string;
}

/**
 * design.pen `Component / Icon Button`.
 * 48px 터치 타깃 안에 24px 아이콘이 들어가는 원형 버튼입니다.
 */
export function IconButton({
  variant = 'ghost',
  icon,
  className,
  type = 'button',
  disabled,
  ...rest
}: IconButtonProps) {
  const { surface, icon: iconColor } = variantStyles[variant];

  return (
    <button
      type={type}
      disabled={disabled}
      className={cn(
        'inline-flex size-12 shrink-0 items-center justify-center rounded-full',
        surface,
        disabled ? 'cursor-not-allowed opacity-[0.72]' : 'cursor-pointer',
        className,
      )}
      {...rest}
    >
      <Icon name={icon} size={24} className={iconColor} />
    </button>
  );
}
