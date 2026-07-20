import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ArrowUpDown,
  Bell,
  Bookmark,
  Calendar,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  CircleX,
  Copy,
  Ellipsis,
  EllipsisVertical,
  Funnel,
  Heart,
  House,
  Image,
  Info,
  LogOut,
  MapPin,
  Menu,
  MessageCircle,
  Pencil,
  Plus,
  RefreshCw,
  Search,
  Settings,
  Share2,
  Star,
  Trash2,
  TriangleAlert,
  User,
  Utensils,
  X,
} from 'lucide-react';
import type { LucideIcon, LucideProps } from 'lucide-react';

/**
 * design.pen `Icon / <name> / <size>` 컴포넌트의 DS 이름 → 루시드 아이콘 매핑.
 * 매핑은 design.pen 아이콘 노드의 `icon` 속성(lucide 글리프 이름)과 1:1로 일치합니다.
 */
const iconComponents = {
  'arrow-left': ArrowLeft,
  'arrow-right': ArrowRight,
  'arrow-up': ArrowUp,
  'arrow-down': ArrowDown,
  'chevron-left': ChevronLeft,
  'chevron-right': ChevronRight,
  'chevron-up': ChevronUp,
  'chevron-down': ChevronDown,
  home: House,
  calendar: Calendar,
  copy: Copy,
  refresh: RefreshCw,
  logout: LogOut,
  close: X,
  menu: Menu,
  search: Search,
  filter: Funnel,
  sort: ArrowUpDown,
  plus: Plus,
  edit: Pencil,
  delete: Trash2,
  bookmark: Bookmark,
  share: Share2,
  'more-horizontal': Ellipsis,
  'more-vertical': EllipsisVertical,
  check: Check,
  info: Info,
  warning: TriangleAlert,
  error: CircleX,
  user: User,
  settings: Settings,
  notification: Bell,
  heart: Heart,
  star: Star,
  comment: MessageCircle,
  image: Image,
  'map-pin': MapPin,
  utensils: Utensils,
} satisfies Record<string, LucideIcon>;

export type IconName = keyof typeof iconComponents;
export type IconSize = 16 | 20 | 24 | 32;

export const iconNames = Object.keys(iconComponents) as IconName[];
export const iconSizes: IconSize[] = [16, 20, 24, 32];

export interface IconProps extends Omit<LucideProps, 'size'> {
  name: IconName;
  size?: IconSize;
}

/**
 * 색상은 currentColor를 따르므로 시맨틱 아이콘 토큰 클래스(text-icon-default,
 * text-icon-brand, text-icon-muted, text-icon-error, text-icon-inverse)로 지정합니다.
 */
export function Icon({ name, size = 24, 'aria-label': ariaLabel, ...rest }: IconProps) {
  const LucideComponent = iconComponents[name];
  return (
    <LucideComponent
      size={size}
      aria-label={ariaLabel}
      aria-hidden={ariaLabel ? undefined : true}
      {...rest}
    />
  );
}
