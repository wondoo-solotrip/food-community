import type { ButtonHTMLAttributes, ReactNode } from 'react';

import { Icon } from '@/components/foundation/Icon';
import { cn } from '@/lib/cn';

export type SelectSize = 'sm' | 'md' | 'lg';
export type SelectState = 'default' | 'focused' | 'disabled' | 'error';

export const selectSizes: SelectSize[] = ['sm', 'md', 'lg'];
export const selectStates: SelectState[] = ['default', 'focused', 'disabled', 'error'];

/** Select Box 높이 · 좌우 패딩 — design.pen `Select / <size> / <state>` */
const boxSizeStyles: Record<SelectSize, string> = {
  sm: 'h-8 px-2.5',
  md: 'h-10 px-3',
  lg: 'h-12 px-3',
};

/** sm은 16px, md·lg는 20px chevron-down */
const iconSizes: Record<SelectSize, 16 | 20> = { sm: 16, md: 20, lg: 20 };

/** focused는 패널이 열려 있는 동안 유지되는 2px 브랜드 테두리입니다. */
const boxStateStyles: Record<SelectState, string> = {
  default: 'bg-background-card border border-border-default',
  focused: 'bg-background-card border-2 border-border-brand',
  disabled: 'bg-background-disabled border border-border-default',
  error: 'bg-background-card border border-border-error-strong',
};

export interface SelectProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  size?: SelectSize;
  /** 상단 레이블 — label-lg */
  label: string;
  /** 선택된 값. 없으면 placeholder가 노출됩니다. */
  value?: string;
  placeholder?: string;
  /** 하단 힌트 — label-md. error가 true면 errorText로 대체됩니다. */
  helperText?: string;
  /** error 상태에서 힌트를 대체하는 메시지 — label-md */
  errorText?: string;
  /** 패널이 열린 상태(= focused). 열려 있는 동안 브랜드 테두리가 유지됩니다. */
  open?: boolean;
  error?: boolean;
  /** 열렸을 때 Select Box 아래에 붙는 SelectItem 목록 */
  children?: ReactNode;
}

/**
 * design.pen `Component / Select`.
 * 사이즈(sm 32 / md 40 / lg 48) × 상태(default·focused·disabled·error).
 * open(=focused)이면 Open Select Panel이 Select Box 바로 아래에 열립니다(데스크톱 기준).
 */
export function Select({
  size = 'md',
  label,
  value,
  placeholder = '선택하세요',
  helperText,
  errorText,
  open = false,
  error = false,
  disabled = false,
  className,
  children,
  type = 'button',
  ...rest
}: SelectProps) {
  // 상태 우선순위: disabled > error > focused(open) > default
  const state: SelectState = disabled ? 'disabled' : error ? 'error' : open ? 'focused' : 'default';

  const message = error ? (errorText ?? helperText) : helperText;
  const iconColor = disabled ? 'text-icon-muted' : 'text-icon-default';

  const valueColor = disabled
    ? 'text-text-muted'
    : value
      ? 'text-text-default'
      : 'text-text-placeholder';

  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <span className="text-label-lg text-text-default">{label}</span>

      {/* Select Box */}
      <button
        type={type}
        aria-label={label}
        aria-haspopup="listbox"
        aria-expanded={open}
        disabled={disabled}
        className={cn(
          'flex items-center gap-2 rounded-md text-left',
          boxSizeStyles[size],
          boxStateStyles[state],
          disabled ? 'cursor-not-allowed' : 'cursor-pointer',
        )}
        {...rest}
      >
        <span className={cn('min-w-0 flex-1 truncate text-body-lg', valueColor)}>
          {value ?? placeholder}
        </span>
        <Icon name="chevron-down" size={iconSizes[size]} className={iconColor} />
      </button>

      {/* Open Select Panel */}
      {open && children && (
        <div
          role="listbox"
          aria-label={label}
          className="flex flex-col overflow-hidden rounded-md border border-border-default bg-background-card"
        >
          {children}
        </div>
      )}

      {message && (
        <span className={cn('text-label-md', error ? 'text-text-error' : 'text-text-muted')}>
          {message}
        </span>
      )}
    </div>
  );
}
