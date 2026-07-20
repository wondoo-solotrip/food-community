import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { iconNames } from '@/components/foundation/Icon';
import { IconButton, iconButtonVariants } from '@/components/ui/IconButton';

const meta = {
  title: 'UI/Icon Button',
  component: IconButton,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          '48px 터치 타깃 안에 24px 아이콘을 배치한 원형 버튼입니다. ghost · circle-brand · circle-neutral 세 가지 표면을 제공합니다.',
      },
    },
  },
  args: {
    variant: 'ghost',
    icon: 'heart',
    'aria-label': '좋아요',
  },
  argTypes: {
    variant: { control: 'inline-radio', options: iconButtonVariants },
    icon: { control: 'select', options: iconNames },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof IconButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

const variantLabel: Record<string, string> = {
  ghost: 'Ghost',
  'circle-brand': 'Circle Type 1',
  'circle-neutral': 'Circle Type 2',
};

export const Variants: StoryObj = {
  render: () => (
    <div className="flex flex-wrap gap-8">
      {iconButtonVariants.map((variant) => (
        <div key={variant} className="flex flex-col items-center gap-3">
          <IconButton variant={variant} icon="heart" aria-label={`좋아요 (${variant})`} />
          <span className="text-label-md text-text-muted">{variantLabel[variant]}</span>
        </div>
      ))}
    </div>
  ),
};
