import type { HTMLAttributes, ReactNode } from 'react';

import { Icon } from '@/components/foundation/Icon';
import { cn } from '@/lib/cn';

import { Button } from './Button';

export interface ModalProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** false면 아무것도 렌더하지 않습니다. 렌더 자체는 prop으로 제어됩니다. */
  open?: boolean;
  /** 헤더 제목 — heading-sm */
  title: string;
  /** 바디 본문 — body-md. `children`을 쓰면 대신 렌더됩니다. */
  description?: string;
  children?: ReactNode;
  /** 닫기 아이콘 · 스크림 탭 시 호출됩니다. */
  onClose?: () => void;
  /** primary 액션 레이블. 없으면 primary 버튼이 빠집니다. */
  primaryLabel?: string;
  onPrimaryClick?: () => void;
  /** secondary 액션 레이블. 없으면 secondary 버튼이 빠집니다. */
  secondaryLabel?: string;
  onSecondaryClick?: () => void;
}

/**
 * design.pen `Modal / Default`.
 * 배경 스크림(background-scrim) + 중앙 다이얼로그(width 480, cornerRadius 8, shadow 0 16 32).
 * 스토리북에서 전체 오버레이를 보여주기 위해 fixed/portal 대신 relative 컨테이너 안 absolute 스크림을 씁니다.
 */
export function Modal({
  open = true,
  title,
  description,
  children,
  onClose,
  primaryLabel,
  onPrimaryClick,
  secondaryLabel,
  onSecondaryClick,
  className,
  ...rest
}: ModalProps) {
  if (!open) return null;

  const hasFooter = Boolean(primaryLabel || secondaryLabel);

  return (
    <div
      className={cn(
        'relative flex min-h-[360px] w-full items-center justify-center overflow-hidden rounded-lg',
        className,
      )}
      {...rest}
    >
      {/* 배경 스크림 — 탭하면 모달이 닫힙니다. */}
      <button
        type="button"
        aria-label="모달 닫기"
        onClick={onClose}
        className="absolute inset-0 cursor-pointer bg-background-scrim"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="relative flex w-[480px] max-w-full flex-col rounded-lg border border-border-default bg-background-card shadow-[0_16px_32px_var(--color-alpha-black-20)]"
      >
        {/* Header — padding [20,20,12,20], 제목 heading-sm + 닫기 아이콘 16px */}
        <div className="flex items-center justify-between gap-2 px-5 pt-5 pb-3">
          <span className="text-heading-sm text-text-default">{title}</span>
          <button
            type="button"
            aria-label="닫기"
            onClick={onClose}
            className="flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-md bg-background-transparent"
          >
            <Icon name="close" size={16} className="text-icon-default" />
          </button>
        </div>
        {/* Body — padding [0,20,20,20], 본문 body-md */}
        <div className="flex flex-col gap-2 px-5 pb-5">
          {children ?? <span className="text-body-md text-text-muted">{description}</span>}
        </div>
        {hasFooter && (
          // Footer — 상단 1px 구분선, 우측 정렬, secondary → primary 순서
          <div className="flex items-center justify-end gap-2 border-t border-border-default px-5 pt-4 pb-5">
            {secondaryLabel && (
              <Button variant="secondary" label={secondaryLabel} onClick={onSecondaryClick} />
            )}
            {primaryLabel && (
              <Button variant="primary" label={primaryLabel} onClick={onPrimaryClick} />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
