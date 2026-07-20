import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Typography, typographyVariants } from '@/components/foundation/Typography';
import { typeScale } from '@/tokens/typography';

const meta = {
  title: 'Foundation/Typography',
  component: Typography,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Pretendard Variable 기반 타입 스케일 10종. 모든 스타일은 font-size · font-weight · line-height 프리미티브 토큰 조합이며 공통 자간 -2%가 적용됩니다.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: typographyVariants,
    },
    as: { control: false },
    children: { control: 'text' },
  },
} satisfies Meta<typeof Typography>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: {
    variant: 'display-lg',
    children: '오늘 뭐 먹지? 우리 동네 맛집 커뮤니티',
  },
};

const specimen = '따뜻한 한 끼, 함께 나누는 우리 동네 밥상';

export const TypeScale: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <div className="mx-auto max-w-5xl py-4">
      <header className="mb-6 flex flex-col gap-2">
        <h1 className="text-display-md text-text-default">Typography</h1>
        <p className="text-body-lg text-text-muted">
          Primitive typography tokens rendered as reusable text components.
        </p>
      </header>
      <div className="rounded-lg border border-border-default bg-background-card">
        {typeScale.map((style) => (
          <div
            key={style.name}
            className="flex flex-col gap-3 border-b border-border-default px-5 py-4 last:border-b-0 md:flex-row md:items-center md:gap-6"
          >
            <div className="flex w-56 shrink-0 flex-col gap-0.5">
              <span className="text-label-lg text-text-brand">{style.name}</span>
              <span className="text-label-md text-text-subtle">
                {style.fontSize.px}px · {style.fontWeight.value} · {style.lineHeight.value}
              </span>
              <span className="text-label-md text-text-subtle">
                {style.fontSize.token} · {style.fontWeight.token}
              </span>
            </div>
            <Typography variant={style.name as (typeof typographyVariants)[number]} as="p">
              {specimen}
            </Typography>
          </div>
        ))}
      </div>
    </div>
  ),
};
