// Generates src/styles/tokens.css and src/tokens/colors.ts from design.pen variables.
const fs = require('fs');
const path = require('path');

const V = {
  'color-alpha-black-0': '#00000000',
  'color-alpha-black-13': '#00000022',
  'color-alpha-black-20': '#A23A1833',
  'color-alpha-black-30': '#0000004D',
  'color-alpha-black-4': '#4D24100A',
  'color-alpha-black-5': '#2D1A100D',
  'color-alpha-black-50': '#00000080',
  'color-alpha-black-54': '#0000008A',
  'color-alpha-black-72': '#000000B8',
  'color-alpha-black-9': '#4B2A180D',
  'color-alpha-black-95': '#000000F2',
  'color-alpha-white-0': '#FFFFFF00',
  'color-alpha-white-10': '#FFFFFF1A',
  'color-alpha-white-27': '#FFFFFF44',
  'color-alpha-white-60': '#FFFFFF99',
  'color-amber-50': '#FFF8E6',
  'color-amber-100': '#FFEFC2',
  'color-amber-200': '#FFD980',
  'color-amber-300': '#FEC84B',
  'color-amber-400': '#F4A61D',
  'color-amber-500': '#D98200',
  'color-amber-600': '#B86400',
  'color-amber-700': '#8F4A00',
  'color-amber-800': '#713B07',
  'color-amber-900': '#5A320A',
  'color-amber-950': '#301804',
  'color-background-brand': '$color-brand-500',
  'color-background-brand-selected': '$color-brand-50',
  'color-background-brand-subtle': '$color-brand-50',
  'color-background-card': '$color-neutral-50',
  'color-background-default': '$color-neutral-50',
  'color-background-disabled': '$color-neutral-300',
  'color-background-error': '$color-red-600',
  'color-background-error-subtle': '$color-red-50',
  'color-background-info': '$color-teal-600',
  'color-background-info-subtle': '$color-teal-50',
  'color-background-inverse': '$color-neutral-900',
  'color-background-media-placeholder': '$color-brand-100',
  'color-background-muted': '$color-neutral-200',
  'color-background-screen': '$color-neutral-50',
  'color-background-screen-warm': '$color-brand-50',
  'color-background-scrim': '$color-alpha-black-50',
  'color-background-success': '$color-sage-600',
  'color-background-success-subtle': '$color-sage-50',
  'color-background-surface': '$color-neutral-100',
  'color-background-transparent': '$color-alpha-white-0',
  'color-background-warning': '$color-amber-500',
  'color-background-warning-subtle': '$color-amber-50',
  'color-border-brand': '$color-brand-300',
  'color-border-default': '$color-neutral-200',
  'color-border-error': '$color-red-200',
  'color-border-error-strong': '$color-red-600',
  'color-border-info': '$color-teal-300',
  'color-border-strong': '$color-neutral-300',
  'color-border-success': '$color-sage-300',
  'color-border-warning': '$color-amber-300',
  'color-brand-50': '#FFF4ED',
  'color-brand-100': '#FFE4D5',
  'color-brand-200': '#FFC5A8',
  'color-brand-300': '#FF9D73',
  'color-brand-400': '#FF7A47',
  'color-brand-500': '#FF6B35',
  'color-brand-600': '#E84F1E',
  'color-brand-700': '#BF3B16',
  'color-brand-800': '#993218',
  'color-brand-900': '#7C2E19',
  'color-brand-950': '#431407',
  'color-icon-brand': '$color-brand-500',
  'color-icon-default': '$color-neutral-900',
  'color-icon-error': '$color-red-600',
  'color-icon-inverse': '$color-neutral-50',
  'color-icon-muted': '$color-neutral-400',
  'color-neutral-50': '#FFFDF7',
  'color-neutral-100': '#F7F1E8',
  'color-neutral-200': '#E9E2DA',
  'color-neutral-300': '#CFC4B8',
  'color-neutral-400': '#A99E93',
  'color-neutral-500': '#79736D',
  'color-neutral-600': '#635E56',
  'color-neutral-700': '#4B463F',
  'color-neutral-800': '#2F2B26',
  'color-neutral-900': '#1F1F1F',
  'color-neutral-950': '#11100E',
  'color-overlay-hero-mark-muted': '$color-alpha-white-60',
  'color-overlay-photo-bottom-end': '$color-alpha-black-54',
  'color-overlay-photo-bottom-mid': '$color-alpha-black-30',
  'color-overlay-photo-bottom-start': '$color-alpha-black-0',
  'color-overlay-photo-dark-high': '$color-alpha-black-72',
  'color-overlay-photo-dark-low': '$color-alpha-black-13',
  'color-overlay-photo-dark-solid': '$color-alpha-black-95',
  'color-overlay-photo-light-mid': '$color-alpha-white-10',
  'color-overlay-photo-light-start': '$color-alpha-white-27',
  'color-red-50': '#FEF2F2',
  'color-red-100': '#FEE2E2',
  'color-red-200': '#FECACA',
  'color-red-300': '#FCA5A5',
  'color-red-400': '#F87171',
  'color-red-500': '#EF4444',
  'color-red-600': '#DC2626',
  'color-red-700': '#B91C1C',
  'color-red-800': '#991B1B',
  'color-red-900': '#7F1D1D',
  'color-red-950': '#450A0A',
  'color-sage-50': '#F2F8F3',
  'color-sage-100': '#DDEBDD',
  'color-sage-200': '#BDD8C0',
  'color-sage-300': '#93BD99',
  'color-sage-400': '#6EA376',
  'color-sage-500': '#5F8B68',
  'color-sage-600': '#516B58',
  'color-sage-700': '#3F5646',
  'color-sage-800': '#314237',
  'color-sage-900': '#26342C',
  'color-sage-950': '#132019',
  'color-shadow-brand': '$color-alpha-black-20',
  'color-shadow-card': '$color-alpha-black-9',
  'color-shadow-header': '$color-alpha-black-4',
  'color-shadow-soft': '$color-alpha-black-5',
  'color-teal-50': '#ECFDF9',
  'color-teal-100': '#CCFBF1',
  'color-teal-200': '#99F6E4',
  'color-teal-300': '#5EEAD4',
  'color-teal-400': '#2DD4BF',
  'color-teal-500': '#2A9D8F',
  'color-teal-600': '#0F8176',
  'color-teal-700': '#0F665F',
  'color-teal-800': '#11524D',
  'color-teal-900': '#13423F',
  'color-teal-950': '#062725',
  'color-text-brand': '$color-brand-700',
  'color-text-default': '$color-neutral-900',
  'color-text-error': '$color-red-600',
  'color-text-info': '$color-teal-700',
  'color-text-inverse': '$color-neutral-50',
  'color-text-muted': '$color-neutral-600',
  'color-text-on-brand': '$color-neutral-50',
  'color-text-on-error': '$color-neutral-50',
  'color-text-on-info': '$color-neutral-50',
  'color-text-on-success': '$color-neutral-50',
  'color-text-on-warning': '$color-neutral-950',
  'color-text-placeholder': '$color-neutral-500',
  'color-text-subtle': '$color-neutral-500',
  'color-text-success': '$color-sage-700',
  'color-text-warning': '$color-amber-800',
};

const FAMILIES = [
  ['brand', 'Brand / Orange'],
  ['neutral', 'Neutral / Warm Paper'],
  ['amber', 'Warning / Amber'],
  ['sage', 'Success / Sage'],
  ['teal', 'Info / Teal'],
  ['red', 'Error / Red'],
  ['alpha-white', 'Overlay / White Alpha'],
  ['alpha-black', 'Overlay / Black Alpha'],
];

const SEMANTIC_GROUPS = [
  ['text', 'Text'],
  ['background', 'Background'],
  ['border', 'Border'],
  ['icon', 'Icon'],
  ['overlay', 'Overlay'],
  ['shadow', 'Shadow'],
];

// ---- WCAG contrast vs neutral-50 (팔레트 대비 요건 검증용) -------------
function srgbToLinear(c) {
  const s = c / 255;
  return s <= 0.04045 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
}
function relativeLuminance(hex) {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
  return 0.2126 * srgbToLinear(r) + 0.7152 * srgbToLinear(g) + 0.0722 * srgbToLinear(b);
}
function contrastRatio(hexA, hexB) {
  const [la, lb] = [relativeLuminance(hexA), relativeLuminance(hexB)];
  const [hi, lo] = la > lb ? [la, lb] : [lb, la];
  return (hi + 0.05) / (lo + 0.05);
}
const NEUTRAL_50 = V['color-neutral-50'];

function shadesOf(prefix) {
  return Object.entries(V)
    .filter(([k]) => {
      const rest = k.replace(`color-${prefix}-`, '');
      return k.startsWith(`color-${prefix}-`) && /^\d+$/.test(rest);
    })
    .map(([k, v]) => ({ step: k.replace(`color-${prefix}-`, ''), token: k, hex: v }))
    .sort((a, b) => Number(a.step) - Number(b.step));
}

function semanticOf(category) {
  return Object.entries(V)
    .filter(([k, v]) => k.startsWith(`color-${category}-`) && String(v).startsWith('$'))
    .map(([k, v]) => {
      const ref = String(v).slice(1);
      const hex = V[ref];
      if (typeof hex !== 'string' || hex.startsWith('$')) throw new Error(`Unresolved ref for ${k}: ${v}`);
      return { token: k, ref, hex };
    })
    .sort((a, b) => a.token.localeCompare(b.token));
}

// sanity: every variable is either a primitive in a family or a known semantic
{
  const covered = new Set();
  for (const [prefix] of FAMILIES) shadesOf(prefix).forEach((s) => covered.add(s.token));
  for (const [cat] of SEMANTIC_GROUPS) semanticOf(cat).forEach((s) => covered.add(s.token));
  const missed = Object.keys(V).filter((k) => !covered.has(k));
  if (missed.length) throw new Error(`Uncovered variables: ${missed.join(', ')}`);
}

const TYPE_SCALE = [
  ['display-lg', '800', 'bold', 'tight'],
  ['display-md', '700', 'bold', 'tight'],
  ['display-sm', '600', 'bold', 'tight'],
  ['heading-lg', '500', 'bold', 'tight'],
  ['heading-md', '400', 'bold', 'tight'],
  ['heading-sm', '300', 'semibold', 'tight'],
  ['body-lg', '300', 'regular', 'normal'],
  ['body-md', '200', 'regular', 'normal'],
  ['label-lg', '200', 'semibold', 'normal'],
  ['label-md', '100', 'regular', 'normal'],
];
const FONT_SIZES = { 100: 12, 200: 14, 300: 16, 400: 20, 500: 24, 600: 28, 700: 32, 800: 36, 900: 40 };
const FONT_WEIGHTS = { regular: 400, semibold: 600, bold: 700 };
const LINE_HEIGHTS = { tight: 1.2, normal: 1.4 };
const SPACING = [8, 12, 16, 20, 24, 32];

// ---------------------------------------------------------------- tokens.css
let css = `/*
 * Design tokens — generated from design.pen (Pencil MCP handoff).
 * design.pen variables가 소스 오브 트루스입니다. 값을 직접 수정하지 마세요.
 */

@font-face {
  font-family: "Pretendard Variable";
  src: url("/fonts/PretendardVariable.woff2") format("woff2-variations");
  font-weight: 45 920;
  font-style: normal;
  font-display: swap;
}

/* ── Typography · Spacing primitives ─────────────────────────────── */
:root {
  --font-family: "Pretendard Variable", -apple-system, BlinkMacSystemFont, system-ui, "Apple SD Gothic Neo", sans-serif;

`;
for (const [step, px] of Object.entries(FONT_SIZES)) css += `  --font-size-${step}: ${px}px;\n`;
css += '\n';
for (const [name, w] of Object.entries(FONT_WEIGHTS)) css += `  --font-weight-${name}: ${w};\n`;
css += '\n';
for (const [name, lh] of Object.entries(LINE_HEIGHTS)) css += `  --font-line-height-${name}: ${lh};\n`;
css += `  --font-letter-spacing: -0.02em; /* 공통 자간 -2% */\n\n`;
for (const px of SPACING) css += `  --spacing-${px}: ${px}px;\n`;
css += `}

/* ── Primitive color tokens ──────────────────────────────────────── */
@theme {
`;
for (const [prefix, label] of FAMILIES) {
  css += `  /* ${label} */\n`;
  for (const s of shadesOf(prefix)) css += `  --${s.token}: ${s.hex};\n`;
  css += '\n';
}
css = css.replace(/\n$/, '');
css += `}

/* ── Semantic color tokens (프리미티브 참조 전용) · Type scale ───── */
@theme inline {
  --font-sans: var(--font-family);

`;
for (const [cat, label] of SEMANTIC_GROUPS) {
  css += `  /* ${label} */\n`;
  for (const s of semanticOf(cat)) css += `  --${s.token}: var(--${s.ref});\n`;
  css += '\n';
}
css += `  /* Type scale — text-display-lg … text-label-md 유틸리티 생성 */\n`;
for (const [name, size, weight, lh] of TYPE_SCALE) {
  css += `  --text-${name}: var(--font-size-${size}); /* ${FONT_SIZES[size]}px */\n`;
  css += `  --text-${name}--line-height: var(--font-line-height-${lh});\n`;
  css += `  --text-${name}--font-weight: var(--font-weight-${weight});\n`;
  css += `  --text-${name}--letter-spacing: var(--font-letter-spacing);\n`;
}
css += `}\n`;

// ---------------------------------------------------------------- colors.ts
const palettes = FAMILIES.map(([prefix, name]) => {
  const alpha = prefix.startsWith('alpha');
  return {
    name,
    prefix,
    alpha,
    shades: shadesOf(prefix).map((s) => ({
      step: s.step,
      token: s.token,
      cssVar: `--${s.token}`,
      hex: s.hex,
      // 알파 컬러는 합성 결과에 따라 대비가 달라지므로 산출하지 않음
      contrastOnNeutral50: alpha ? null : Math.round(contrastRatio(s.hex, NEUTRAL_50) * 100) / 100,
    })),
  };
});

// 가이드 요건: 각 팔레트는 neutral-50 대비 3:1과 4.5:1을 만족하는 단계를 포함해야 함
const contrastReport = palettes
  .filter((p) => !p.alpha)
  .map((p) => {
    const ratios = p.shades.map((s) => s.contrastOnNeutral50);
    const aaLarge = p.shades.filter((s, i) => ratios[i] >= 3).map((s) => s.step);
    const aa = p.shades.filter((s, i) => ratios[i] >= 4.5).map((s) => s.step);
    return { prefix: p.prefix, aaLargeFrom: aaLarge[0], aaFrom: aa[0], pass: aaLarge.length > 0 && aa.length > 0 };
  });
const semanticGroups = SEMANTIC_GROUPS.map(([cat, name]) => ({
  name,
  tokens: semanticOf(cat).map((s) => ({ token: s.token, cssVar: `--${s.token}`, ref: s.ref, hex: s.hex })),
}));

let ts = `/**
 * Color token manifest — generated from design.pen (Pencil MCP handoff).
 * 실제 스타일 값은 src/styles/tokens.css 의 CSS 커스텀 프로퍼티가 소스입니다.
 */

export interface ColorShade {
  step: string;
  token: string;
  cssVar: string;
  hex: string;
  /** color-neutral-50 위에 올렸을 때의 WCAG 대비율. 알파 팔레트는 null */
  contrastOnNeutral50: number | null;
}

export interface ColorPalette {
  name: string;
  prefix: string;
  /** 알파(반투명) 팔레트 여부 — 스와치 렌더 시 체커보드 배경 필요 */
  alpha: boolean;
  shades: ColorShade[];
}

export interface SemanticColorToken {
  token: string;
  cssVar: string;
  /** 참조하는 프리미티브 토큰 이름 */
  ref: string;
  hex: string;
}

export interface SemanticColorGroup {
  name: string;
  tokens: SemanticColorToken[];
}

export const primitivePalettes: ColorPalette[] = ${JSON.stringify(palettes, null, 2)};

export const semanticColorGroups: SemanticColorGroup[] = ${JSON.stringify(semanticGroups, null, 2)};
`;

const root = process.argv[2];
if (!root) throw new Error('usage: node gen-tokens.cjs <project-root>');
fs.mkdirSync(path.join(root, 'src/styles'), { recursive: true });
fs.mkdirSync(path.join(root, 'src/tokens'), { recursive: true });
fs.writeFileSync(path.join(root, 'src/styles/tokens.css'), css);
fs.writeFileSync(path.join(root, 'src/tokens/colors.ts'), ts);
console.log('written: src/styles/tokens.css, src/tokens/colors.ts');
console.log(`palettes: ${palettes.map((p) => `${p.prefix}(${p.shades.length})`).join(', ')}`);
console.log(`semantic: ${semanticGroups.map((g) => `${g.name}(${g.tokens.length})`).join(', ')}`);
console.log('contrast vs neutral-50:');
for (const r of contrastReport) {
  console.log(`  ${r.pass ? 'PASS' : 'FAIL'} ${r.prefix}: 3:1 from ${r.aaLargeFrom ?? '—'}, 4.5:1 from ${r.aaFrom ?? '—'}`);
}
