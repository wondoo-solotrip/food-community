import type { CSSProperties } from 'react';

import { cn } from '@/lib/cn';

export type SkeletonType = 'text' | 'rectangle' | 'circle';

export const skeletonTypes: SkeletonType[] = ['text', 'rectangle', 'circle'];

/** design.pen 기준 기본 치수 — 텍스트 행 높이 20 / 사각형 280×120 / 원형 지름 56 */
export const skeletonDefaults = {
  lineHeight: 20,
  lines: 2,
  width: 280,
  height: 120,
  diameter: 56,
} as const;

/** 세 타입 모두 뉴트럴 계열인 background-muted 를 사용합니다. */
const surfaceStyles = 'bg-background-muted';

/** cornerRadius — 텍스트 4 / 사각형 8 / 원형 완전 원 */
const radiusStyles: Record<SkeletonType, string> = {
  text: 'rounded-sm',
  rectangle: 'rounded-lg',
  circle: 'rounded-full',
};

export interface SkeletonProps {
  type?: SkeletonType;
  /**
   * 텍스트형의 행 높이 — 대상 요소의 line height 를 그대로 넣습니다. (기본 20)
   */
  lineHeight?: number;
  /** 텍스트형의 행 수. (기본 2) */
  lines?: number;
  /**
   * 사각형의 너비. 텍스트형에서는 블록 전체 너비로 쓰입니다.
   * 생략하면 부모를 100% 채웁니다.
   */
  width?: number | string;
  /** 사각형의 높이 — 대상 요소의 높이. (기본 120) */
  height?: number | string;
  /** 원형의 지름 — 대상 요소의 지름. (기본 56) */
  diameter?: number;
  /**
   * 로딩 셰이머. design.pen 에는 애니메이션 표현이 없어 정적 렌더가 기본이며,
   * 켜면 Tailwind `animate-pulse` 가 적용됩니다.
   */
  animated?: boolean;
  className?: string;
  /** 스크린리더용 로딩 설명. 지정하면 role="status" 가 붙습니다. */
  'aria-label'?: string;
}

/** 여러 행 중 마지막 행만 짧게 — design.pen 텍스트형의 250 / 360 비율 */
const LAST_LINE_WIDTH = '70%';

/**
 * design.pen `Component / Skeleton`.
 * 타입(텍스트형·사각형·원형) × 상태(없음). 뉴트럴 컬러 로딩 플레이스홀더입니다.
 */
export function Skeleton({
  type = 'text',
  lineHeight = skeletonDefaults.lineHeight,
  lines = skeletonDefaults.lines,
  width,
  height = skeletonDefaults.height,
  diameter = skeletonDefaults.diameter,
  animated = false,
  className,
  'aria-label': ariaLabel,
}: SkeletonProps) {
  // 치수는 호출부가 정하는 동적 값이라 Tailwind 클래스가 아닌 인라인 스타일로 적용합니다.
  const containerStyle: CSSProperties = { width: width ?? '100%' };
  const a11yProps = {
    role: ariaLabel ? ('status' as const) : undefined,
    'aria-label': ariaLabel,
    'aria-hidden': ariaLabel ? undefined : true,
    'aria-busy': ariaLabel ? true : undefined,
  };

  if (type === 'circle') {
    // design.pen `Skeleton / Circle` — 지름 56, cornerRadius 28
    return (
      <div
        {...a11yProps}
        style={{ width: diameter, height: diameter }}
        className={cn(
          'shrink-0',
          surfaceStyles,
          radiusStyles.circle,
          animated && 'animate-pulse',
          className,
        )}
      />
    );
  }

  if (type === 'rectangle') {
    // design.pen `Skeleton / Rectangle` — 280 × 120, cornerRadius 8
    return (
      <div
        {...a11yProps}
        style={{ width: width ?? skeletonDefaults.width, height }}
        className={cn(
          surfaceStyles,
          radiusStyles.rectangle,
          animated && 'animate-pulse',
          className,
        )}
      />
    );
  }

  // design.pen `Skeleton / Text` — 행 높이 20, 행 간격 10, 마지막 행만 짧게
  return (
    <div
      {...a11yProps}
      style={containerStyle}
      className={cn('flex flex-col gap-2.5', animated && 'animate-pulse', className)}
    >
      {Array.from({ length: lines }, (_, index) => (
        <div
          key={index}
          style={{
            height: lineHeight,
            width: index === lines - 1 && lines > 1 ? LAST_LINE_WIDTH : '100%',
          }}
          className={cn(surfaceStyles, radiusStyles.text)}
        />
      ))}
    </div>
  );
}
