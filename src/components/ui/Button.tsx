import type { ButtonHTMLAttributes } from 'react';

import { Icon } from '@/components/foundation/Icon';
import type { IconName } from '@/components/foundation/Icon';
import { cn } from '@/lib/cn';

import { Spinner } from './Spinner';
import type { SpinnerSize } from './Spinner';

export type ButtonVariant = 'primary' | 'secondary' | 'destructive';
export type ButtonSize = 'sm' | 'md' | 'lg';

export const buttonVariants: ButtonVariant[] = ['primary', 'secondary', 'destructive'];
export const buttonSizes: ButtonSize[] = ['sm', 'md', 'lg'];

/** 높이 · 좌우 패딩 · 아이콘 간격 — design.pen Button Type x State Matrix 기준 */
const sizeStyles: Record<ButtonSize, string> = {
  sm: 'h-8 px-3 gap-1.5',
  md: 'h-10 px-4 gap-2',
  lg: 'h-12 px-[18px] gap-2',
};

/** sm은 16px, md·lg는 20px 아이콘 */
const iconSize: Record<ButtonSize, 16 | 20> = { sm: 16, md: 20, lg: 20 };
const spinnerSize: Record<ButtonSize, SpinnerSize> = { sm: 16, md: 20, lg: 20 };

const variantStyles: Record<ButtonVariant, string> = {
  primary: 'bg-background-brand text-text-on-brand',
  secondary: 'bg-background-inverse text-text-inverse',
  destructive: 'bg-background-error text-text-on-error',
};

/** 세 타입 모두 동일한 비활성 표현을 사용합니다. */
const disabledStyles = 'bg-background-disabled text-text-placeholder opacity-[0.72]';

export interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** 레이블 — label-lg 타입 스타일로 렌더됩니다. */
  label: string;
  /** 레이블 좌측 아이콘. loading일 때는 스피너로 대체됩니다. */
  leadingIcon?: IconName;
  /** 레이블 우측 아이콘. */
  trailingIcon?: IconName;
  /** 좌측 아이콘 자리에 스피너를 표시하고 레이블은 유지합니다. */
  loading?: boolean;
}

/**
 * design.pen `Component / Button`.
 * 타입(primary·secondary·destructive) × 상태(default·disabled·loading) × 사이즈(sm·md·lg).
 */
export function Button({
  variant = 'primary',
  size = 'md',
  label,
  leadingIcon,
  trailingIcon,
  loading = false,
  disabled = false,
  className,
  type = 'button',
  ...rest
}: ButtonProps) {
  const isDisabled = disabled || loading;
  // 비활성 아이콘은 icon-muted, 그 외에는 세 타입 모두 icon-inverse
  const iconColor = disabled ? 'text-icon-muted' : 'text-icon-inverse';

  return (
    <button
      type={type}
      disabled={isDisabled}
      aria-busy={loading || undefined}
      className={cn(
        'inline-flex shrink-0 items-center justify-center rounded-md text-label-lg',
        sizeStyles[size],
        disabled ? disabledStyles : variantStyles[variant],
        isDisabled ? 'cursor-not-allowed' : 'cursor-pointer',
        className,
      )}
      {...rest}
    >
      {loading ? (
        <Spinner
          size={spinnerSize[size]}
          trackClassName="stroke-icon-inverse opacity-30"
          indicatorClassName="stroke-icon-inverse"
        />
      ) : (
        leadingIcon && <Icon name={leadingIcon} size={iconSize[size]} className={iconColor} />
      )}
      <span>{label}</span>
      {trailingIcon && !loading && (
        <Icon name={trailingIcon} size={iconSize[size]} className={iconColor} />
      )}
    </button>
  );
}
