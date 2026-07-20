import type { InputHTMLAttributes } from 'react';

import { Icon } from '@/components/foundation/Icon';
import type { IconName } from '@/components/foundation/Icon';
import { cn } from '@/lib/cn';

export type TextFieldType = 'text' | 'password';
export type TextFieldSize = 'sm' | 'md' | 'lg';
export type TextFieldState = 'default' | 'focused' | 'disabled' | 'error';

export const textFieldTypes: TextFieldType[] = ['text', 'password'];
export const textFieldSizes: TextFieldSize[] = ['sm', 'md', 'lg'];
export const textFieldStates: TextFieldState[] = ['default', 'focused', 'disabled', 'error'];

/** Input Box 높이 · 좌우 패딩 — design.pen `Text Field / <type> / <size> / <state>` */
const boxSizeStyles: Record<TextFieldSize, string> = {
  sm: 'h-8 px-2.5',
  md: 'h-10 px-3',
  lg: 'h-12 px-3',
};

/** sm은 16px, md·lg는 20px 아이콘 */
const iconSizes: Record<TextFieldSize, 16 | 20> = { sm: 16, md: 20, lg: 20 };

/** Input Box 배경 + 테두리. focused만 2px 브랜드 테두리를 씁니다. */
const boxStateStyles: Record<TextFieldState, string> = {
  default: 'bg-background-card border border-border-default',
  focused: 'bg-background-card border-2 border-border-brand',
  disabled: 'bg-background-disabled border border-border-default',
  error: 'bg-background-card border border-border-error-strong',
};

export interface TextFieldProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'> {
  type?: TextFieldType;
  size?: TextFieldSize;
  /** 상단 레이블 — label-lg */
  label: string;
  /** 하단 힌트 — label-md. error가 true면 errorText로 대체됩니다. */
  helperText?: string;
  /** error 상태에서 힌트를 대체하는 메시지 — label-md */
  errorText?: string;
  /** 입력 텍스트 좌측 아이콘 */
  leadingIcon?: IconName;
  /** 입력 텍스트 우측 아이콘 */
  trailingIcon?: IconName;
  /** 디자인 상태 강제용 — CSS :focus가 아니라 prop으로 포커스 링을 적용합니다. */
  focused?: boolean;
  error?: boolean;
}

/**
 * design.pen `Component / Text Field`.
 * 타입(text·password) × 상태(default·focused·disabled·error) × 사이즈(sm 32 / md 40 / lg 48).
 */
export function TextField({
  type = 'text',
  size = 'md',
  label,
  helperText,
  errorText,
  leadingIcon,
  trailingIcon,
  focused = false,
  error = false,
  disabled = false,
  className,
  ...rest
}: TextFieldProps) {
  // 상태 우선순위: disabled > error > focused > default
  const state: TextFieldState = disabled
    ? 'disabled'
    : error
      ? 'error'
      : focused
        ? 'focused'
        : 'default';

  const iconColor = disabled ? 'text-icon-muted' : 'text-icon-default';
  const message = error ? (errorText ?? helperText) : helperText;

  return (
    <label className={cn('flex flex-col gap-1.5', className)}>
      <span className="text-label-lg text-text-default">{label}</span>

      {/* Input Box */}
      <span
        className={cn(
          'flex items-center gap-2 rounded-md',
          boxSizeStyles[size],
          boxStateStyles[state],
        )}
      >
        {leadingIcon && <Icon name={leadingIcon} size={iconSizes[size]} className={iconColor} />}
        <input
          type={type}
          disabled={disabled}
          aria-invalid={error || undefined}
          className={cn(
            'min-w-0 flex-1 bg-transparent text-body-lg outline-none',
            'placeholder:text-text-placeholder',
            disabled ? 'cursor-not-allowed text-text-muted' : 'text-text-default',
          )}
          {...rest}
        />
        {trailingIcon && <Icon name={trailingIcon} size={iconSizes[size]} className={iconColor} />}
      </span>

      {message && (
        <span className={cn('text-label-md', error ? 'text-text-error' : 'text-text-muted')}>
          {message}
        </span>
      )}
    </label>
  );
}
