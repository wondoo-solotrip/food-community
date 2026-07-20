import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Icon, iconNames, iconSizes } from '@/components/foundation/Icon';

const meta = {
  title: 'Foundation/Iconography',
  component: Icon,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          '루시드(Lucide) 아이콘 35종 × 4사이즈(16 · 20 · 24 · 32). 색상은 currentColor를 따르며 시맨틱 아이콘 토큰(text-icon-*)으로 지정합니다.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    name: { control: 'select', options: iconNames },
    size: { control: 'inline-radio', options: iconSizes },
  },
} satisfies Meta<typeof Icon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: {
    name: 'heart',
    size: 24,
  },
};

export const AllIcons: StoryObj = {
  parameters: { layout: 'padded' },
  render: () => (
    <div className="mx-auto max-w-3xl py-4">
      <header className="mb-6 flex flex-col gap-2">
        <h1 className="text-display-md text-text-default">Iconography</h1>
        <p className="text-body-lg text-text-muted">
          Lucide icon components rendered in 16, 20, 24, and 32 pixel sizes.
        </p>
      </header>
      <div className="overflow-hidden rounded-lg border border-border-default bg-background-card">
        <div className="grid grid-cols-[1fr_repeat(4,4rem)] items-center gap-4 border-b border-border-default bg-background-surface px-5 py-2.5">
          <span className="text-label-lg text-text-default">Icon</span>
          {iconSizes.map((size) => (
            <span key={size} className="text-center text-label-md text-text-subtle">
              {size}
            </span>
          ))}
        </div>
        {iconNames.map((name) => (
          <div
            key={name}
            className="grid grid-cols-[1fr_repeat(4,4rem)] items-center gap-4 border-b border-border-default px-5 py-3 last:border-b-0"
          >
            <span className="text-label-lg text-text-default">{name}</span>
            {iconSizes.map((size) => (
              <span key={size} className="flex justify-center text-icon-default">
                <Icon name={name} size={size} />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  ),
};

const semanticIconColors = [
  { token: 'color-icon-default', className: 'text-icon-default', inverse: false },
  { token: 'color-icon-brand', className: 'text-icon-brand', inverse: false },
  { token: 'color-icon-muted', className: 'text-icon-muted', inverse: false },
  { token: 'color-icon-error', className: 'text-icon-error', inverse: false },
  { token: 'color-icon-inverse', className: 'text-icon-inverse', inverse: true },
];

export const SemanticColors: StoryObj = {
  parameters: { layout: 'padded' },
  render: () => (
    <div className="mx-auto max-w-3xl py-4">
      <header className="mb-6 flex flex-col gap-2">
        <h1 className="text-display-md text-text-default">Icon / Semantic Colors</h1>
        <p className="text-body-lg text-text-muted">
          아이콘 색상은 시맨틱 토큰 클래스(text-icon-*)로만 지정합니다.
        </p>
      </header>
      <div className="flex flex-wrap gap-4">
        {semanticIconColors.map((color) => (
          <div
            key={color.token}
            className={`flex w-40 flex-col items-center gap-2 rounded-lg border border-border-default px-4 py-5 ${
              color.inverse ? 'bg-background-inverse' : 'bg-background-card'
            }`}
          >
            <span className={color.className}>
              <Icon name="heart" size={32} />
            </span>
            <span
              className={`text-label-md ${color.inverse ? 'text-text-inverse' : 'text-text-muted'}`}
            >
              {color.token}
            </span>
          </div>
        ))}
      </div>
    </div>
  ),
};
