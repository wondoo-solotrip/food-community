/**
 * Spacing token manifest — design.pen (Pencil MCP handoff).
 * 실제 스타일 값은 src/styles/tokens.css 의 CSS 커스텀 프로퍼티가 소스입니다.
 */

export interface SpacingToken {
  token: string;
  cssVar: string;
  px: number;
  /** 디자인 가이드에 정의된 용도 */
  usage: string;
}

export const spacingTokens: SpacingToken[] = [
  { token: 'spacing-8', cssVar: '--spacing-8', px: 8, usage: '칩 나열' },
  { token: 'spacing-12', cssVar: '--spacing-12', px: 12, usage: '리스트, 카드 갭' },
  { token: 'spacing-16', cssVar: '--spacing-16', px: 16, usage: '화면 좌우 마진, 카드 갭' },
  { token: 'spacing-20', cssVar: '--spacing-20', px: 20, usage: '-' },
  { token: 'spacing-24', cssVar: '--spacing-24', px: 24, usage: '섹션 구분' },
  { token: 'spacing-32', cssVar: '--spacing-32', px: 32, usage: '큰 섹션 구분, 페이지 상하 여백' },
];
