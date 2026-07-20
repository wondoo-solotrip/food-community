'use client';

import { createContext, useContext } from 'react';
import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from 'react';

import { Icon } from '@/components/foundation/Icon';
import type { IconName, IconSize } from '@/components/foundation/Icon';
import { cn } from '@/lib/cn';

export type MenuItemVariant = 'default' | 'destructive';
export type MenuSize = 'sm' | 'md' | 'lg';

export const menuItemVariants: MenuItemVariant[] = ['default', 'destructive'];
export const menuSizes: MenuSize[] = ['sm', 'md', 'lg'];

/** 메뉴 아이템 사이즈 — design.pen sm(32) · md(40) · lg(48) */
const itemSizeStyles: Record<MenuSize, string> = {
  sm: 'h-8',
  md: 'h-10',
  lg: 'h-12',
};

/** 좌측 아이콘 — sm 16px, md·lg 20px */
const itemIconSize: Record<MenuSize, IconSize> = { sm: 16, md: 20, lg: 20 };

/** 타입별 아이콘 · 레이블 색 (default 상태) */
const itemVariantStyles: Record<MenuItemVariant, { icon: string; label: string }> = {
  default: { icon: 'text-icon-default', label: 'text-text-default' },
  destructive: { icon: 'text-icon-error', label: 'text-text-error' },
};

/** 두 타입 모두 동일한 비활성 표현을 사용합니다. */
const itemDisabledStyles = { icon: 'text-icon-muted', label: 'text-text-placeholder' };

/**
 * 메뉴 아이템은 "참조하는 메뉴의 사이즈를 따름" — Menu가 컨텍스트로 사이즈를 내려줍니다.
 * Menu 밖에서 단독으로 쓰면 md가 기본값입니다.
 */
const MenuSizeContext = createContext<MenuSize>('md');

export interface MenuProps extends HTMLAttributes<HTMLDivElement> {
  /** 하위 MenuItem에 상속되는 사이즈. */
  size?: MenuSize;
  /**
   * 표시 방식. `popover`는 데스크톱 메뉴 버튼 아래 팝오버(테두리 · 그림자 · padding 8),
   * `plain`은 바텀시트 안에 얹히는 목록(테두리 · 그림자 없음).
   */
  surface?: 'popover' | 'plain';
  children?: ReactNode;
}

/**
 * design.pen `Menu / Default`.
 * 가로·세로 auto. 활성화 시 메뉴아이템을 연결하며, 데스크톱은 메뉴 버튼 아래 팝오버,
 * 모바일은 바텀시트 안 목록으로 렌더됩니다.
 */
export function Menu({ size = 'md', surface = 'popover', children, className, ...rest }: MenuProps) {
  return (
    <MenuSizeContext.Provider value={size}>
      <div
        role="menu"
        className={cn(
          'flex flex-col gap-1',
          surface === 'popover' &&
            'rounded-lg border border-border-default bg-background-card p-2 shadow-[0_8px_24px_var(--color-shadow-card)]',
          className,
        )}
        {...rest}
      >
        {children}
      </div>
    </MenuSizeContext.Provider>
  );
}

export interface MenuItemProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  variant?: MenuItemVariant;
  /** 지정하면 Menu의 사이즈를 덮어씁니다. */
  size?: MenuSize;
  /** 레이블 — body-lg */
  label: string;
  /** 좌측 아이콘. 생략 가능합니다. */
  icon?: IconName;
}

/**
 * design.pen `Menu Item / <type> / <state> / <size>`.
 * 타입(default·destructive) × 상태(default·disabled) × 사이즈(sm 32 / md 40 / lg 48).
 */
export function MenuItem({
  variant = 'default',
  size,
  label,
  icon,
  disabled = false,
  className,
  type = 'button',
  ...rest
}: MenuItemProps) {
  const contextSize = useContext(MenuSizeContext);
  const resolvedSize = size ?? contextSize;
  const colors = disabled ? itemDisabledStyles : itemVariantStyles[variant];

  return (
    <button
      type={type}
      role="menuitem"
      disabled={disabled}
      className={cn(
        'flex w-full items-center gap-2.5 rounded-md bg-background-card px-3 text-left',
        itemSizeStyles[resolvedSize],
        disabled ? 'cursor-not-allowed opacity-[0.52]' : 'cursor-pointer',
        className,
      )}
      {...rest}
    >
      {icon && (
        <Icon
          name={icon}
          size={itemIconSize[resolvedSize]}
          className={cn('shrink-0', colors.icon)}
        />
      )}
      <span className={cn('flex-1 truncate text-body-lg', colors.label)}>{label}</span>
    </button>
  );
}
