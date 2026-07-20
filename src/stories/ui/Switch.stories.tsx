import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Switch, switchSelections, switchSizes, switchStates } from '@/components/ui/Switch';

const meta = {
  title: 'UI/Switch',
  component: Switch,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          '사이즈(sm 16·가로 32 / md 20·가로 40) × 선택(off·on) × 상태(default·disabled). 아이코노그래피 아이콘 없이 트랙 + 원형 썸으로만 그리며, 썸은 트랙 안쪽 2px 여백을 두고 좌우로 이동합니다. 레이블은 body-md, 트랙과 간격은 8px입니다. 단독 사용 전용입니다.',
      },
    },
  },
  args: {
    label: '영업중만 보기',
    size: 'sm',
    selection: 'off',
  },
  argTypes: {
    size: { control: 'inline-radio', options: switchSizes },
    selection: { control: 'inline-radio', options: switchSelections },
    disabled: { control: 'boolean' },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

const stateProps: Record<(typeof switchStates)[number], Record<string, boolean>> = {
  default: {},
  disabled: { disabled: true },
};

/** 행 = 사이즈 × 선택, 열 = 상태 */
const rows = switchSizes.flatMap((size) =>
  switchSelections.map((selection) => ({ size, selection })),
);

export const TypeByState: StoryObj = {
  name: 'Type × State',
  render: () => (
    <div className="overflow-x-auto">
      <div className="min-w-2xl overflow-hidden rounded-lg border border-border-default bg-background-card">
        <div className="flex h-10 border-b border-border-default bg-background-surface">
          <div className="w-44 shrink-0" />
          {switchStates.map((state) => (
            <div
              key={state}
              className="flex w-60 shrink-0 items-center border-l border-border-default px-4"
            >
              <span className="text-label-md text-text-muted">{state}</span>
            </div>
          ))}
        </div>
        {rows.map(({ size, selection }) => (
          <div key={`${size}-${selection}`} className="flex border-t border-border-default">
            <div className="flex w-44 shrink-0 items-center px-4">
              <span className="text-label-lg text-text-default">
                {size} / {selection}
              </span>
            </div>
            {switchStates.map((state) => (
              <div key={state} className="w-60 shrink-0 border-l border-border-default px-4 py-4">
                <Switch
                  size={size}
                  selection={selection}
                  label="영업중만 보기"
                  {...stateProps[state]}
                />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  ),
};

export const Sizes: StoryObj = {
  render: () => (
    <div className="flex flex-col gap-4">
      {switchSizes.map((size) => (
        <div key={size} className="flex flex-col gap-2">
          <span className="text-label-md text-text-muted">
            {size} · 트랙 {size === 'sm' ? '32×16' : '40×20'}
          </span>
          <div className="flex gap-8">
            <Switch size={size} selection="off" label="off" />
            <Switch size={size} selection="on" label="on" />
          </div>
        </div>
      ))}
    </div>
  ),
};
