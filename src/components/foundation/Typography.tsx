import type { ElementType, HTMLAttributes } from 'react';

/** design.pen `Typography Component / *` 10종에 대응하는 타입 스케일 */
export type TypographyVariant =
  | 'display-lg'
  | 'display-md'
  | 'display-sm'
  | 'heading-lg'
  | 'heading-md'
  | 'heading-sm'
  | 'body-lg'
  | 'body-md'
  | 'label-lg'
  | 'label-md';

export const typographyVariants: TypographyVariant[] = [
  'display-lg',
  'display-md',
  'display-sm',
  'heading-lg',
  'heading-md',
  'heading-sm',
  'body-lg',
  'body-md',
  'label-lg',
  'label-md',
];

const variantClassName: Record<TypographyVariant, string> = {
  'display-lg': 'text-display-lg',
  'display-md': 'text-display-md',
  'display-sm': 'text-display-sm',
  'heading-lg': 'text-heading-lg',
  'heading-md': 'text-heading-md',
  'heading-sm': 'text-heading-sm',
  'body-lg': 'text-body-lg',
  'body-md': 'text-body-md',
  'label-lg': 'text-label-lg',
  'label-md': 'text-label-md',
};

const defaultElement: Record<TypographyVariant, ElementType> = {
  'display-lg': 'h1',
  'display-md': 'h2',
  'display-sm': 'h3',
  'heading-lg': 'h2',
  'heading-md': 'h3',
  'heading-sm': 'h4',
  'body-lg': 'p',
  'body-md': 'p',
  'label-lg': 'span',
  'label-md': 'span',
};

export interface TypographyProps extends HTMLAttributes<HTMLElement> {
  variant?: TypographyVariant;
  /** 렌더할 HTML 요소 — 생략 시 variant별 기본 요소 사용 */
  as?: ElementType;
}

export function Typography({ variant = 'body-lg', as, className, ...rest }: TypographyProps) {
  const Tag = as ?? defaultElement[variant];
  return <Tag className={[variantClassName[variant], className].filter(Boolean).join(' ')} {...rest} />;
}
