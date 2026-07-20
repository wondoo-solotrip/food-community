import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { primitivePalettes, semanticColorGroups } from '@/tokens/colors';
import type { ColorShade } from '@/tokens/colors';

import { checkerboard } from './checkerboard';

const meta = {
  title: 'Foundation/Colors',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          '컬러 파운데이션 — 프리미티브 팔레트 8종과 시맨틱 토큰 6그룹. 시맨틱 토큰은 hex를 직접 쓰지 않고 항상 프리미티브 토큰을 참조합니다.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/** neutral-50 배경 기준 WCAG 등급 — 가이드의 3:1 / 4.5:1 요건 확인용 */
function contrastGrade(ratio: number | null) {
  if (ratio === null) return null;
  if (ratio >= 4.5) return { label: 'AA', className: 'bg-sage-100 text-text-success' };
  if (ratio >= 3) return { label: 'AA Lg', className: 'bg-amber-100 text-text-warning' };
  return { label: '—', className: 'bg-background-muted text-text-subtle' };
}

function Swatch({ shade, alpha }: { shade: ColorShade; alpha: boolean }) {
  const grade = contrastGrade(shade.contrastOnNeutral50);
  return (
    <div className="flex w-16 flex-col items-center gap-1">
      <div
        className="h-14 w-full overflow-hidden rounded-md border border-border-default"
        style={alpha ? { background: checkerboard } : undefined}
      >
        <div className="h-full w-full" style={{ backgroundColor: `var(${shade.cssVar})` }} />
      </div>
      <span className="text-label-md font-semibold text-text-default">{shade.step}</span>
      <span className="text-label-md text-text-subtle">{shade.hex}</span>
      {grade && (
        <span
          className={`rounded-sm px-1.5 py-0.5 text-label-md ${grade.className}`}
          title={`color-neutral-50 대비 ${shade.contrastOnNeutral50}:1`}
        >
          {grade.label}
        </span>
      )}
    </div>
  );
}

export const PrimitivePalettes: Story = {
  render: () => (
    <div className="mx-auto flex max-w-5xl flex-col gap-8 py-4">
      <header className="flex flex-col gap-2">
        <h1 className="text-display-md text-text-default">Color / Primitive</h1>
        <p className="text-body-lg text-text-muted">
          팔레트당 11단계(50–950), 알파 팔레트는 투명도 단계로 구성됩니다. 배지는 background-default
          (color-neutral-50) 위에 올렸을 때의 WCAG 등급으로, <strong>AA</strong>는 4.5:1 이상,{' '}
          <strong>AA Lg</strong>는 3:1 이상입니다. 6개 팔레트 모두 두 기준을 만족하는 단계를
          포함합니다.
        </p>
      </header>
      {primitivePalettes.map((palette) => (
        <section
          key={palette.prefix}
          className="rounded-lg border border-border-default bg-background-card p-5"
        >
          <div className="mb-4 flex items-baseline justify-between">
            <h2 className="text-heading-sm text-text-default">{palette.name}</h2>
            <span className="text-label-md text-text-subtle">
              color-{palette.prefix}-{palette.shades[0].step} ~ color-{palette.prefix}-
              {palette.shades[palette.shades.length - 1].step}
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {palette.shades.map((shade) => (
              <Swatch key={shade.token} shade={shade} alpha={palette.alpha} />
            ))}
          </div>
        </section>
      ))}
    </div>
  ),
};

export const SemanticTokens: Story = {
  render: () => (
    <div className="mx-auto flex max-w-5xl flex-col gap-8 py-4">
      <header className="flex flex-col gap-2">
        <h1 className="text-display-md text-text-default">Color / Semantic</h1>
        <p className="text-body-lg text-text-muted">
          용도 중심의 시맨틱 토큰입니다. 모든 값은 프리미티브 토큰 참조로만 정의됩니다.
        </p>
      </header>
      {semanticColorGroups.map((group) => (
        <section key={group.name}>
          <h2 className="mb-3 text-heading-sm text-text-default">{group.name}</h2>
          <div className="grid grid-cols-1 gap-x-8 xl:grid-cols-2">
            {group.tokens.map((token) => (
              <div
                key={token.token}
                className="flex items-center gap-4 border-b border-border-default py-2.5"
              >
                <div
                  className="h-9 w-14 shrink-0 overflow-hidden rounded-md border border-border-default"
                  style={{ background: checkerboard }}
                >
                  <div
                    className="h-full w-full"
                    style={{ backgroundColor: `var(${token.cssVar})` }}
                  />
                </div>
                <span className="min-w-0 flex-1 truncate text-label-lg text-text-default">
                  {token.token}
                </span>
                <span className="text-label-md text-text-subtle">→ {token.ref}</span>
                <span className="w-20 text-right text-label-md text-text-subtle">{token.hex}</span>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  ),
};
