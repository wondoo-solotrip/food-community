import type { HTMLAttributes, ReactNode } from 'react';

import { Icon } from '@/components/foundation/Icon';
import { cn } from '@/lib/cn';

import { Button } from './Button';
import { Spinner } from './Spinner';

export type DropzoneState = 'default' | 'dragover' | 'disabled' | 'error';
export type FileItemState = 'uploading' | 'complete' | 'error';

export const dropzoneStates: DropzoneState[] = ['default', 'dragover', 'disabled', 'error'];
export const fileItemStates: FileItemState[] = ['uploading', 'complete', 'error'];

/** Dropzone 배경 + 테두리 — design.pen `Dropzone / <state>`. dragover만 2px 브랜드 테두리. */
const dropzoneStateStyles: Record<DropzoneState, string> = {
  default: 'bg-background-card border border-border-default',
  dragover: 'bg-background-card border-2 border-border-brand',
  disabled: 'bg-background-disabled border border-border-default',
  error: 'bg-background-card border border-border-error-strong',
};

export interface DropzoneProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  state?: DropzoneState;
  /** 드롭존 안내문구 — body-md */
  guideText?: string;
  /** 파일선택버튼 레이블 — 버튼 사이즈는 sm 고정 */
  buttonLabel?: string;
  onSelectFiles?: () => void;
}

/**
 * design.pen `Dropzone / default·dragover·disabled·error`.
 * 142px 고정 높이, 세로 중앙 정렬로 image 아이콘 · 안내문구 · 파일선택버튼(sm)을 쌓습니다.
 */
export function Dropzone({
  state = 'default',
  guideText,
  buttonLabel = '파일 선택',
  onSelectFiles,
  className,
  ...rest
}: DropzoneProps) {
  const isDisabled = state === 'disabled';
  const text = guideText ?? (isDisabled ? '업로드 비활성화' : '파일을 끌어오거나 선택하세요');

  return (
    <div
      aria-disabled={isDisabled || undefined}
      className={cn(
        'flex h-[142px] flex-col items-center justify-center gap-2.5 rounded-lg p-4',
        dropzoneStateStyles[state],
        className,
      )}
      {...rest}
    >
      <Icon
        name="image"
        size={20}
        className={isDisabled ? 'text-icon-muted' : 'text-icon-brand'}
      />
      <span
        className={cn(
          'text-body-md',
          isDisabled && 'text-text-muted',
          state === 'error' && 'text-text-error',
          !isDisabled && state !== 'error' && 'text-text-default',
        )}
      >
        {text}
      </span>
      <Button size="sm" label={buttonLabel} disabled={isDisabled} onClick={onSelectFiles} />
    </div>
  );
}

export interface FileItemProps extends Omit<HTMLAttributes<HTMLLIElement>, 'children'> {
  state?: FileItemState;
  /** 파일명 — body-md */
  name: string;
  /** 진행률·완료·오류 등 부가 정보 — label-md */
  meta?: string;
  /** 썸네일 이미지 URL. 없으면 background-muted 플레이스홀더가 표시됩니다. */
  thumbnailSrc?: string;
  onRemove?: () => void;
}

/**
 * design.pen `File Item / uploading·complete·error`.
 * 썸네일(40) + 파일 텍스트 + 상태 표시(스피너 / check / error) + 삭제 버튼(32) 구성입니다.
 */
export function FileItem({
  state = 'uploading',
  name,
  meta,
  thumbnailSrc,
  onRemove,
  className,
  ...rest
}: FileItemProps) {
  const isError = state === 'error';
  const textColor = isError ? 'text-text-error' : 'text-text-default';
  const metaColor = isError ? 'text-text-error' : 'text-text-muted';

  return (
    <li
      aria-busy={state === 'uploading' || undefined}
      className={cn(
        'flex h-14 items-center gap-2.5 rounded-md bg-background-card p-2',
        isError ? 'border border-border-error-strong' : 'border border-border-default',
        className,
      )}
      {...rest}
    >
      {/* Thumbnail */}
      <span className="size-10 shrink-0 overflow-hidden rounded-sm bg-background-muted">
        {thumbnailSrc && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={thumbnailSrc} alt="" className="size-full object-cover" />
        )}
      </span>

      {/* File Text */}
      <span className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className={cn('truncate text-body-md', textColor)}>{name}</span>
        {meta && <span className={cn('truncate text-label-md', metaColor)}>{meta}</span>}
      </span>

      {/* 상태 표시 */}
      {state === 'uploading' && <Spinner size={20} aria-label="업로드 중" />}
      {state === 'complete' && <Icon name="check" size={20} className="text-icon-brand" />}
      {state === 'error' && <Icon name="error" size={20} className="text-icon-error" />}

      {/* Delete Icon Button */}
      <button
        type="button"
        aria-label={`${name} 삭제`}
        onClick={onRemove}
        className="inline-flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-full bg-background-transparent"
      >
        <Icon name="close" size={16} className="text-icon-muted" />
      </button>
    </li>
  );
}

export interface FileUploaderProps {
  /** 상단 파일 형식·용량 제한 안내 — label-md */
  limitText?: string;
  dropzoneState?: DropzoneState;
  guideText?: string;
  buttonLabel?: string;
  onSelectFiles?: () => void;
  /** 하단 파일 아이템 리스트 — `FileItem` 들을 넣습니다. */
  children?: ReactNode;
  className?: string;
}

/**
 * design.pen `Component / File Uploader`.
 * 드롭존 + 파일선택버튼 결합 단일형. 상단 제한 안내 → 드롭존 → 파일 아이템 리스트 순서입니다.
 */
export function FileUploader({
  limitText = 'JPG, PNG, PDF · 최대 10MB · 5개까지 업로드 가능',
  dropzoneState = 'default',
  guideText,
  buttonLabel,
  onSelectFiles,
  children,
  className,
}: FileUploaderProps) {
  return (
    <div className={cn('flex flex-col gap-2', className)}>
      {limitText && <p className="text-label-md text-text-muted">{limitText}</p>}
      <Dropzone
        state={dropzoneState}
        guideText={guideText}
        buttonLabel={buttonLabel}
        onSelectFiles={onSelectFiles}
      />
      {children && <ul className="flex flex-col gap-2">{children}</ul>}
    </div>
  );
}
