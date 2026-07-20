import { cn } from '@/lib/cn';

export interface TabNavigationProps {
  /** 2개 이상의 탭 레이블. 균등 분배됩니다. */
  items: string[];
  /** 선택된 탭 인덱스. 선택된 탭에만 하단 2px 인디케이터가 표시됩니다. */
  selectedIndex?: number;
  /**
   * design.pen 원본은 탭 1개당 120px 고정 폭(컨테이너 가로 auto)입니다.
   * true로 주면 컨테이너가 가로 전체를 채우고 탭이 flex-1로 균등 분배됩니다.
   */
  fullWidth?: boolean;
  onSelect?: (index: number) => void;
  className?: string;
}

/**
 * design.pen `Component / Tab Navigation` (czOc1).
 * 높이 48px · background-card · 하단 1px border-default.
 * 각 탭은 상단 패딩 12px + label-lg 레이블 슬롯 + 하단 2px 인디케이터로 구성됩니다.
 */
export function TabNavigation({
  items,
  selectedIndex = 0,
  fullWidth = false,
  onSelect,
  className,
}: TabNavigationProps) {
  return (
    <div
      role="tablist"
      className={cn(
        'h-12 border-b border-border-default bg-background-card',
        fullWidth ? 'flex w-full' : 'inline-flex',
        className,
      )}
    >
      {items.map((label, index) => {
        const selected = index === selectedIndex;

        return (
          <button
            key={label}
            type="button"
            role="tab"
            aria-selected={selected}
            onClick={() => onSelect?.(index)}
            className={cn(
              'flex h-full cursor-pointer flex-col items-center justify-between pt-3',
              fullWidth ? 'flex-1' : 'w-[120px]',
            )}
          >
            <span
              className={cn(
                'flex w-full flex-1 items-center justify-center text-center text-label-lg',
                selected ? 'text-text-brand' : 'text-text-muted',
              )}
            >
              {label}
            </span>
            {/* 인디케이터 — 미선택 탭도 2px 자리를 차지해 레이블 위치가 흔들리지 않습니다. */}
            <span
              aria-hidden
              className={cn(
                'h-0.5 w-full',
                selected ? 'bg-background-brand' : 'bg-background-transparent',
              )}
            />
          </button>
        );
      })}
    </div>
  );
}
