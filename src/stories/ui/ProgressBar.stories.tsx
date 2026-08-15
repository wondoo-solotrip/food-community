import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { ProgressBar } from '@/components/ui/ProgressBar';

const meta = {
  title: 'UI/Progress Bar',
  component: ProgressBar,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          '높이 6px 트랙(background-muted, rounded-full) 위에 background-brand 채움을 value/max 비율만큼 그립니다. design.pen `11 Paid Event Detail / Payment Bottom Sheet`의 정원 게이지에서 왔습니다.',
      },
    },
  },
  args: {
    value: 18,
    max: 24,
    'aria-label': '정원 현황',
  },
  argTypes: {
    value: { control: { type: 'number', min: 0 } },
    max: { control: { type: 'number', min: 1 } },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ProgressBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Values: StoryObj = {
  name: '채움 비율',
  render: () => (
    <div className="flex w-80 flex-col gap-6">
      {[
        { label: '0 / 24', value: 0 },
        { label: '12 / 24', value: 12 },
        { label: '18 / 24 (결제 시트)', value: 18 },
        { label: '24 / 24 · 정원 마감', value: 24 },
      ].map(({ label, value }) => (
        <div key={label} className="flex flex-col gap-2">
          <span className="text-label-md text-text-muted">{label}</span>
          <ProgressBar value={value} max={24} aria-label={label} />
        </div>
      ))}
    </div>
  ),
};
