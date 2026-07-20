import type { TextareaHTMLAttributes } from 'react';

import { cn } from '@/lib/cn';

export type TextareaState = 'default' | 'focused' | 'disabled' | 'error';

export const textareaStates: TextareaState[] = ['default', 'focused', 'disabled', 'error'];

/** Textarea Box 배경 + 테두리 — design.pen `Textarea / <state>` */
const boxStateStyles: Record<TextareaState, string> = {
  default: 'bg-background-card border border-border-default',
  focused: 'bg-background-card border-2 border-border-brand',
  disabled: 'bg-background-disabled border border-border-default',
  error: 'bg-background-card border border-border-error-strong',
};

export interface TextareaProps
  extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'rows' | 'value'> {
  /** 상단 레이블 — label-lg */
  label: string;
  /** 하단 힌트 — label-md. error가 true면 errorText로 대체됩니다. */
  helperText?: string;
  /** error 상태에서 힌트를 대체하는 메시지 — label-md */
  errorText?: string;
  value?: string;
  /** 지정하면 하단 우측에 `현재/최대` 글자수 카운터를 표시합니다. */
  maxLength?: number;
  /** 디자인 상태 강제용 — CSS :focus가 아니라 prop으로 포커스 링을 적용합니다. */
  focused?: boolean;
  error?: boolean;
}

/**
 * design.pen `Component / Textarea`.
 * 상태(default·focused·disabled·error) 4종. 박스는 96px 고정(body-lg 3줄 + 상하 12px 패딩)이며
 * 내용이 넘치면 세로 스크롤됩니다.
 */
export function Textarea({
  label,
  helperText,
  errorText,
  value,
  maxLength,
  focused = false,
  error = false,
  disabled = false,
  className,
  ...rest
}: TextareaProps) {
  // 상태 우선순위: disabled > error > focused > default
  const state: TextareaState = disabled
    ? 'disabled'
    : error
      ? 'error'
      : focused
        ? 'focused'
        : 'default';

  const message = error ? (errorText ?? helperText) : helperText;
  const showCounter = typeof maxLength === 'number';

  return (
    <label className={cn('flex flex-col gap-1.5', className)}>
      <span className="text-label-lg text-text-default">{label}</span>

      {/* Textarea Box — 3줄 고정 높이 */}
      <span className={cn('block h-24 rounded-md p-3', boxStateStyles[state])}>
        <textarea
          rows={3}
          value={value}
          maxLength={maxLength}
          disabled={disabled}
          aria-invalid={error || undefined}
          className={cn(
            'h-full w-full resize-none overflow-y-auto bg-transparent text-body-lg outline-none',
            'placeholder:text-text-placeholder',
            disabled ? 'cursor-not-allowed text-text-muted' : 'text-text-default',
          )}
          {...rest}
        />
      </span>

      {(message || showCounter) && (
        <span className="flex items-center justify-between gap-2">
          <span className={cn('text-label-md', error ? 'text-text-error' : 'text-text-muted')}>
            {message}
          </span>
          {showCounter && (
            <span className="shrink-0 text-label-md text-text-muted">
              {value?.length ?? 0}/{maxLength}
            </span>
          )}
        </span>
      )}
    </label>
  );
}
