/**
 * Typography token manifest — design.pen (Pencil MCP handoff).
 * 실제 스타일 값은 src/styles/tokens.css 의 CSS 커스텀 프로퍼티가 소스입니다.
 */

export const fontFamily = {
  token: 'font-family',
  cssVar: '--font-family',
  value: 'Pretendard Variable',
  file: '/fonts/PretendardVariable.woff2',
};

export interface NumericToken {
  token: string;
  cssVar: string;
  value: number;
}

export const fontSizes: NumericToken[] = [
  { token: 'font-size-100', cssVar: '--font-size-100', value: 12 },
  { token: 'font-size-200', cssVar: '--font-size-200', value: 14 },
  { token: 'font-size-300', cssVar: '--font-size-300', value: 16 },
  { token: 'font-size-400', cssVar: '--font-size-400', value: 20 },
  { token: 'font-size-500', cssVar: '--font-size-500', value: 24 },
  { token: 'font-size-600', cssVar: '--font-size-600', value: 28 },
  { token: 'font-size-700', cssVar: '--font-size-700', value: 32 },
  { token: 'font-size-800', cssVar: '--font-size-800', value: 36 },
  { token: 'font-size-900', cssVar: '--font-size-900', value: 40 },
];

export const fontWeights: NumericToken[] = [
  { token: 'font-weight-regular', cssVar: '--font-weight-regular', value: 400 },
  { token: 'font-weight-semibold', cssVar: '--font-weight-semibold', value: 600 },
  { token: 'font-weight-bold', cssVar: '--font-weight-bold', value: 700 },
];

export const lineHeights: NumericToken[] = [
  { token: 'font-line-height-tight', cssVar: '--font-line-height-tight', value: 1.2 },
  { token: 'font-line-height-normal', cssVar: '--font-line-height-normal', value: 1.4 },
];

/** 공통 자간 -2% */
export const letterSpacing = { token: 'font-letter-spacing', cssVar: '--font-letter-spacing', value: '-0.02em' };

export interface TypeStyle {
  name: string;
  /** Tailwind 유틸리티 클래스 (tokens.css @theme에서 생성) */
  className: string;
  fontSize: { token: string; px: number };
  fontWeight: { token: string; value: number };
  lineHeight: { token: string; value: number };
}

export const typeScale: TypeStyle[] = [
  { name: 'display-lg', className: 'text-display-lg', fontSize: { token: 'font-size-800', px: 36 }, fontWeight: { token: 'font-weight-bold', value: 700 }, lineHeight: { token: 'font-line-height-tight', value: 1.2 } },
  { name: 'display-md', className: 'text-display-md', fontSize: { token: 'font-size-700', px: 32 }, fontWeight: { token: 'font-weight-bold', value: 700 }, lineHeight: { token: 'font-line-height-tight', value: 1.2 } },
  { name: 'display-sm', className: 'text-display-sm', fontSize: { token: 'font-size-600', px: 28 }, fontWeight: { token: 'font-weight-bold', value: 700 }, lineHeight: { token: 'font-line-height-tight', value: 1.2 } },
  { name: 'heading-lg', className: 'text-heading-lg', fontSize: { token: 'font-size-500', px: 24 }, fontWeight: { token: 'font-weight-bold', value: 700 }, lineHeight: { token: 'font-line-height-tight', value: 1.2 } },
  { name: 'heading-md', className: 'text-heading-md', fontSize: { token: 'font-size-400', px: 20 }, fontWeight: { token: 'font-weight-bold', value: 700 }, lineHeight: { token: 'font-line-height-tight', value: 1.2 } },
  { name: 'heading-sm', className: 'text-heading-sm', fontSize: { token: 'font-size-300', px: 16 }, fontWeight: { token: 'font-weight-semibold', value: 600 }, lineHeight: { token: 'font-line-height-tight', value: 1.2 } },
  { name: 'body-lg', className: 'text-body-lg', fontSize: { token: 'font-size-300', px: 16 }, fontWeight: { token: 'font-weight-regular', value: 400 }, lineHeight: { token: 'font-line-height-normal', value: 1.4 } },
  { name: 'body-md', className: 'text-body-md', fontSize: { token: 'font-size-200', px: 14 }, fontWeight: { token: 'font-weight-regular', value: 400 }, lineHeight: { token: 'font-line-height-normal', value: 1.4 } },
  { name: 'label-lg', className: 'text-label-lg', fontSize: { token: 'font-size-200', px: 14 }, fontWeight: { token: 'font-weight-semibold', value: 600 }, lineHeight: { token: 'font-line-height-normal', value: 1.4 } },
  { name: 'label-md', className: 'text-label-md', fontSize: { token: 'font-size-100', px: 12 }, fontWeight: { token: 'font-weight-regular', value: 400 }, lineHeight: { token: 'font-line-height-normal', value: 1.4 } },
];
