import type { IconName } from '@/components/foundation/Icon';
import { cn } from '@/lib/cn';

import { IconButton } from './IconButton';

export type TopNavigationIconTone = 'default' | 'brand';

export const topNavigationIconTones: TopNavigationIconTone[] = ['default', 'brand'];

/**
 * ghost 아이콘 버튼의 기본 아이콘 색이 icon-brand이므로 default 톤만 덮어씁니다.
 * design.pen 기준: 좌측 슬롯은 icon-default, 우측 슬롯은 icon-brand(기본) / icon-default(마이 페이지).
 */
const iconToneStyles: Record<TopNavigationIconTone, string> = {
  default: '[&_svg]:text-icon-default',
  brand: '',
};

interface TopNavigationSlotProps {
  icon?: IconName;
  tone: TopNavigationIconTone;
  label?: string;
  onClick?: () => void;
}

/**
 * design.pen `Icon Button / Ghost` (48x48) 슬롯.
 * 아이콘을 제외해도 제목이 가운데 정렬을 유지하도록 빈 슬롯은 48px 자리를 그대로 차지합니다.
 * (design.pen도 아이콘 노드만 disable하고 버튼 프레임은 남겨둡니다.)
 */
function TopNavigationSlot({ icon, tone, label, onClick }: TopNavigationSlotProps) {
  if (!icon) {
    return <div className="size-12 shrink-0" aria-hidden />;
  }

  return (
    <IconButton
      variant="ghost"
      icon={icon}
      aria-label={label ?? icon}
      onClick={onClick}
      className={iconToneStyles[tone]}
    />
  );
}

export interface TopNavigationProps {
  /** 제목 — heading-sm 타입 스타일로 가운데 정렬됩니다. */
  title: string;
  /** 좌측 아이콘. 생략하면 버튼 없이 48px 자리만 유지됩니다. */
  leftIcon?: IconName;
  leftIconTone?: TopNavigationIconTone;
  /** 아이콘만 있는 버튼이므로 접근성 레이블을 넘기는 것을 권장합니다. */
  leftIconLabel?: string;
  onLeftClick?: () => void;
  /** 우측 아이콘. 생략하면 버튼 없이 48px 자리만 유지됩니다. */
  rightIcon?: IconName;
  rightIconTone?: TopNavigationIconTone;
  rightIconLabel?: string;
  onRightClick?: () => void;
  className?: string;
}

/**
 * design.pen `Component / Top Navigation` (ZQ02b).
 * 높이 56px · 좌우 패딩 4px · background-card · 하단 1px border-default.
 * 좌/우 아이콘 버튼(내부 아이콘 24px)은 추가·제외할 수 있습니다.
 */
export function TopNavigation({
  title,
  leftIcon,
  leftIconTone = 'default',
  leftIconLabel,
  onLeftClick,
  rightIcon,
  rightIconTone = 'brand',
  rightIconLabel,
  onRightClick,
  className,
}: TopNavigationProps) {
  return (
    <header
      className={cn(
        'flex h-14 w-full items-center justify-between border-b border-border-default bg-background-card px-1',
        className,
      )}
    >
      <TopNavigationSlot
        icon={leftIcon}
        tone={leftIconTone}
        label={leftIconLabel}
        onClick={onLeftClick}
      />
      <h1 className="flex-1 truncate text-center text-heading-sm text-text-default">{title}</h1>
      <TopNavigationSlot
        icon={rightIcon}
        tone={rightIconTone}
        label={rightIconLabel}
        onClick={onRightClick}
      />
    </header>
  );
}
