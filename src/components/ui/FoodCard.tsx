import type { HTMLAttributes, ReactNode } from 'react';

import { Icon } from '@/components/foundation/Icon';
import { cn } from '@/lib/cn';

export interface FoodCardProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** 제목 — 16px bold (design.pen Food Card 인스턴스의 heading-lg → font-size-300 오버라이드) */
  title: string;
  /** 위치 텍스트 — label-md + 16px map-pin 아이콘 */
  location: string;
  /**
   * 이미지 영역 — 디자인 기준 154×96(8:5) 비율을 유지하며 그리드 칸 폭에 맞춰 늘어납니다.
   * 생략하면 media-placeholder 배경만 보입니다.
   */
  media?: ReactNode;
}

/**
 * design.pen `01 Main Page`의 `Food Card / *` 인스턴스(Card / Default의 축소형).
 * cornerRadius 8, border-default 1px, shadow(0 8 24 / shadow-card),
 * 미디어(8:5) + 본문(padding [0,20,20,20], gap 10) 구조입니다.
 */
export function FoodCard({ title, location, media, className, ...rest }: FoodCardProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-4 overflow-hidden rounded-lg border border-border-default bg-background-card',
        'shadow-[0_8px_24px_var(--color-shadow-card)]',
        className,
      )}
      {...rest}
    >
      <div className="aspect-[8/5] w-full shrink-0 overflow-hidden bg-background-media-placeholder">
        {media}
      </div>
      <div className="flex flex-col gap-2.5 px-5 pb-5">
        <span className="text-heading-sm font-bold text-text-default">{title}</span>
        <div className="flex items-center gap-1">
          <Icon name="map-pin" size={16} className="shrink-0 text-icon-muted" />
          <span className="text-label-md text-text-muted">{location}</span>
        </div>
      </div>
    </div>
  );
}
