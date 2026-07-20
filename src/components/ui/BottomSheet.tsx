import type { HTMLAttributes, ReactNode } from 'react';

import { cn } from '@/lib/cn';

export interface BottomSheetProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** false면 아무것도 렌더하지 않습니다. 렌더 자체는 prop으로 제어됩니다. */
  open?: boolean;
  /** 콘텐츠 영역 제목 — heading-sm. 생략 가능합니다. */
  title?: string;
  /** 콘텐츠 영역 설명 — body-md. 생략 가능합니다. */
  description?: string;
  /** 시트 하단 콘텐츠 (메뉴 아이템 등). */
  children?: ReactNode;
  /** 스크림 탭 시 호출됩니다 — 선택 없이 닫힘. */
  onClose?: () => void;
}

/**
 * design.pen `Bottom Sheet / Default`.
 * 배경 스크림 + 하단 고정 패널(가로 전체, 높이 auto, cornerRadius 12/12/0/0, padding [10,20,24,20], gap 18).
 * 스토리북에서 전체 오버레이를 보여주기 위해 fixed/portal 대신 relative 컨테이너 안 absolute 배치를 씁니다.
 */
export function BottomSheet({
  open = true,
  title,
  description,
  children,
  onClose,
  className,
  ...rest
}: BottomSheetProps) {
  if (!open) return null;

  return (
    <div
      className={cn('relative min-h-[520px] w-full overflow-hidden rounded-lg', className)}
      {...rest}
    >
      {/* 배경 스크림 — 탭하면 선택 없이 닫힙니다. */}
      <button
        type="button"
        aria-label="바텀시트 닫기"
        onClick={onClose}
        className="absolute inset-0 cursor-pointer bg-background-scrim"
      />
      {/* Sheet Panel */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="absolute inset-x-0 bottom-0 flex flex-col gap-[18px] rounded-t-xl bg-background-card px-5 pt-2.5 pb-6"
      >
        {/* Drag Handle Area — 높이 20, 44x4 핸들 */}
        <div className="flex h-5 shrink-0 items-center justify-center">
          <div className="h-1 w-11 rounded-sm bg-border-strong" />
        </div>
        {(title || description) && (
          // Content Area — gap 8
          <div className="flex flex-col gap-2">
            {title && <span className="text-heading-sm text-text-default">{title}</span>}
            {description && <span className="text-body-md text-text-muted">{description}</span>}
          </div>
        )}
        {children}
      </div>
    </div>
  );
}
