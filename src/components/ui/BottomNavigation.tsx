import { Icon } from '@/components/foundation/Icon';
import type { IconName } from '@/components/foundation/Icon';
import { cn } from '@/lib/cn';

export interface BottomNavigationItem {
  /** 아이템마다 아이콘은 필수입니다 (24px). */
  icon: IconName;
  /** 아이콘 아래 레이블 — showLabels가 false여도 접근성 이름으로 쓰입니다. */
  label: string;
}

export interface BottomNavigationProps {
  /** 2~5개 아이템을 균등 분배합니다. */
  items: BottomNavigationItem[];
  /** 선택된 아이템 인덱스. 범위를 벗어나면 모두 미선택으로 렌더됩니다. */
  selectedIndex?: number;
  /** 아이콘 아래 레이블 표시 여부. */
  showLabels?: boolean;
  onSelect?: (index: number) => void;
  className?: string;
}

/**
 * design.pen `Component / Bottom Navigation` (gQTJv).
 * 높이 56px · background-card · 상단 1px border-default. 아이템은 flex-1로 균등 분배되고
 * 아이콘(24px)과 label-md 레이블이 2px 간격으로 세로 배치됩니다.
 *
 * 선택 표현: design.pen은 선택/미선택 모두 동일한 lucide 아웃라인 글리프를 쓰고 `fill` 토큰만
 * icon-muted ↔ icon-brand로 교체하므로 그대로 따릅니다.
 * 가이드는 "선택 = 필(fill) 아이콘"을 요구하지만, lucide 아웃라인 글리프에 `fill`을 주면
 * 획과 면이 겹쳐 형태를 알아볼 수 없게 되므로(예: home → 단색 덩어리) 적용하지 않았습니다.
 * 실제 필 글리프가 필요하면 아이코노그래피 파운데이션에 필 변형을 먼저 추가해야 합니다.
 */
export function BottomNavigation({
  items,
  selectedIndex = 0,
  showLabels = true,
  onSelect,
  className,
}: BottomNavigationProps) {
  return (
    <nav
      className={cn(
        'flex h-14 w-full border-t border-border-default bg-background-card',
        className,
      )}
    >
      {items.map((item, index) => {
        const selected = index === selectedIndex;

        return (
          <button
            key={item.label}
            type="button"
            aria-label={item.label}
            aria-current={selected ? 'page' : undefined}
            onClick={() => onSelect?.(index)}
            className="flex flex-1 cursor-pointer flex-col items-center justify-center gap-0.5"
          >
            <Icon
              name={item.icon}
              size={24}
              className={selected ? 'text-icon-brand' : 'text-icon-muted'}
            />
            {showLabels && (
              <span
                className={cn(
                  'text-center text-label-md',
                  selected ? 'text-text-brand' : 'text-text-muted',
                )}
              >
                {item.label}
              </span>
            )}
          </button>
        );
      })}
    </nav>
  );
}
