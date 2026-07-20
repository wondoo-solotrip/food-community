import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { primitivePalettes, semanticColorGroups } from '@/tokens/colors';
import { spacingTokens } from '@/tokens/spacing';
import {
  fontFamily,
  fontSizes,
  fontWeights,
  letterSpacing,
  lineHeights,
} from '@/tokens/typography';

import { checkerboard } from './checkerboard';

const meta = {
  title: 'Foundation/Design Tokens',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'design.pen의 variables를 그대로 핸드오프한 디자인 토큰입니다. `src/styles/tokens.css`의 CSS 커스텀 프로퍼티(Tailwind v4 `@theme`)가 소스 오브 트루스입니다.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

function SectionTitle({ title, description }: { title: string; description: string }) {
  return (
    <div className="mb-4 flex flex-col gap-1">
      <h2 className="text-heading-md text-text-default">{title}</h2>
      <p className="text-body-md text-text-muted">{description}</p>
    </div>
  );
}

function SummaryCard({ count, label }: { count: number; label: string }) {
  return (
    <div className="flex flex-col gap-1 rounded-lg border border-border-default bg-background-surface px-5 py-4">
      <span className="text-display-sm text-text-brand">{count}</span>
      <span className="text-label-lg text-text-muted">{label}</span>
    </div>
  );
}

const primitiveColorCount = primitivePalettes.reduce((n, p) => n + p.shades.length, 0);
const semanticColorCount = semanticColorGroups.reduce((n, g) => n + g.tokens.length, 0);

export const Overview: Story = {
  render: () => (
    <div className="mx-auto flex max-w-4xl flex-col gap-12 py-4">
      <header className="flex flex-col gap-2">
        <h1 className="text-display-md text-text-default">Design Tokens</h1>
        <p className="text-body-lg text-text-muted">
          Food Community 디자인시스템의 원천 토큰입니다. 모든 값은 design.pen variables에서
          추출되었으며 CSS 커스텀 프로퍼티로 제공됩니다.
        </p>
      </header>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <SummaryCard count={primitiveColorCount} label="프리미티브 컬러" />
        <SummaryCard count={semanticColorCount} label="시맨틱 컬러" />
        <SummaryCard count={fontSizes.length + fontWeights.length + lineHeights.length} label="타이포그래피" />
        <SummaryCard count={spacingTokens.length} label="스페이싱" />
      </div>

      <section>
        <SectionTitle
          title="Color"
          description="팔레트별 프리미티브 토큰 미리보기 — 상세는 Foundation/Colors 참고"
        />
        <div className="flex flex-col gap-3">
          {primitivePalettes.map((palette) => (
            <div key={palette.prefix} className="flex items-center gap-4">
              <span className="w-44 shrink-0 text-label-lg text-text-default">{palette.name}</span>
              <div
                className="flex overflow-hidden rounded-md border border-border-default"
                style={palette.alpha ? { background: checkerboard } : undefined}
              >
                {palette.shades.map((shade) => (
                  <div
                    key={shade.token}
                    title={`${shade.token} · ${shade.hex}`}
                    className="h-8 w-8"
                    style={{ backgroundColor: `var(${shade.cssVar})` }}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <SectionTitle title="Typography" description="폰트 패밀리와 사이즈 · 두께 · 행간 프리미티브" />
        <div className="mb-4 rounded-lg border border-border-default bg-background-surface px-5 py-4">
          <span className="text-label-md text-text-subtle">{fontFamily.token}</span>
          <p className="text-heading-lg text-text-default">{fontFamily.value}</p>
          <span className="text-label-md text-text-subtle">{fontFamily.file}</span>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <table className="self-start border-collapse">
            <tbody>
              {fontSizes.map((size) => (
                <tr key={size.token} className="border-b border-border-default">
                  <td className="py-2 pr-6 text-label-lg text-text-default">{size.token}</td>
                  <td className="py-2 text-body-md text-text-muted">{size.value}px</td>
                </tr>
              ))}
            </tbody>
          </table>
          <table className="self-start border-collapse">
            <tbody>
              {fontWeights.map((weight) => (
                <tr key={weight.token} className="border-b border-border-default">
                  <td className="py-2 pr-6 text-label-lg text-text-default">{weight.token}</td>
                  <td className="py-2 text-body-md text-text-muted">{weight.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <table className="self-start border-collapse">
            <tbody>
              {lineHeights.map((lh) => (
                <tr key={lh.token} className="border-b border-border-default">
                  <td className="py-2 pr-6 text-label-lg text-text-default">{lh.token}</td>
                  <td className="py-2 text-body-md text-text-muted">{lh.value}</td>
                </tr>
              ))}
              <tr className="border-b border-border-default">
                <td className="py-2 pr-6 text-label-lg text-text-default">{letterSpacing.token}</td>
                <td className="py-2 text-body-md text-text-muted">{letterSpacing.value}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <SectionTitle title="Spacing" description="레이아웃 간격 프리미티브와 용도" />
        <div className="flex flex-col gap-3">
          {spacingTokens.map((spacing) => (
            <div key={spacing.token} className="flex items-center gap-4">
              <span className="w-32 shrink-0 text-label-lg text-text-default">{spacing.token}</span>
              <span className="w-12 shrink-0 text-body-md text-text-muted">{spacing.px}px</span>
              <div
                className="h-5 shrink-0 rounded-sm bg-brand-500"
                style={{ width: `var(${spacing.cssVar})` }}
              />
              <span className="text-body-md text-text-subtle">{spacing.usage}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  ),
};
