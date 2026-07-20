import { Icon } from '@/components/foundation/Icon';
import type { IconName } from '@/components/foundation/Icon';
import { cn } from '@/lib/cn';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export const toastTypes: ToastType[] = ['success', 'error', 'info', 'warning'];

/** 배경 · 메시지 색 — design.pen Toast / <Type> 의 fill 토큰 */
const typeStyles: Record<ToastType, string> = {
  success: 'bg-background-success text-text-on-success',
  error: 'bg-background-error text-text-on-error',
  info: 'bg-background-info text-text-on-info',
  warning: 'bg-background-warning text-text-on-warning',
};

/** 좌측 상태 아이콘 — design.pen `Icon / <name> / 20` */
const statusIcons: Record<ToastType, IconName> = {
  success: 'check',
  error: 'error',
  info: 'info',
  warning: 'warning',
};

export interface ToastProps {
  type?: ToastType;
  /** 메시지 — body-md 타입 스타일로 렌더됩니다. */
  message: string;
  /** 우측 닫기 아이콘 표시 여부. */
  dismissible?: boolean;
  /** 닫기 아이콘 클릭 핸들러. */
  onDismiss?: () => void;
  /** 닫기 버튼의 스크린리더 레이블. */
  dismissLabel?: string;
  className?: string;
}

/**
 * design.pen `Component / Toast`.
 * 타입(success·error·info·warning) × 상태(없음).
 * 데스크톱 400px 고정, 모바일은 화면 너비에서 좌우 마진을 뺀 폭으로 확장됩니다.
 */
export function Toast({
  type = 'success',
  message,
  dismissible = true,
  onDismiss,
  dismissLabel = '닫기',
  className,
}: ToastProps) {
  return (
    <div
      role="status"
      aria-live={type === 'error' ? 'assertive' : 'polite'}
      className={cn(
        // padding [14, 16] · gap 12 · cornerRadius 8
        'flex w-full items-center gap-3 rounded-lg px-4 py-[14px] sm:w-[400px]',
        typeStyles[type],
        className,
      )}
    >
      <Icon name={statusIcons[type]} size={20} className="shrink-0 text-icon-default" />
      <span className="flex-1 text-body-md">{message}</span>
      {dismissible && (
        <button
          type="button"
          onClick={onDismiss}
          aria-label={dismissLabel}
          className="shrink-0 cursor-pointer text-icon-default"
        >
          <Icon name="close" size={20} />
        </button>
      )}
    </div>
  );
}
