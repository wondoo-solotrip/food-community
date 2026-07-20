import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Chip, chipSelections, chipSizes, chipStates } from '@/components/ui/Chip';
import { iconNames } from '@/components/foundation/Icon';

const meta = {
  title: 'UI/Chip',
  component: Chip,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          '사이즈(sm 24 / md 32) × 선택(unselected·selected) × 상태(default·disabled). 레이블은 label-lg 가운데 정렬이며, 좌측 16px 아이콘 유무에 따라 좌우 패딩이 sm 12↔6, md 16↔8 로 바뀝니다.',
      },
    },
  },
  args: {
    label: '전체',
    size: 'sm',
    selection: 'unselected',
  },
  argTypes: {
    size: { control: 'inline-radio', options: chipSizes },
    selection: { control: 'inline-radio', options: chipSelections },
    leadingIcon: { control: 'select', options: [undefined, ...iconNames] },
    disabled: { control: 'boolean' },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Chip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

const stateProps: Record<(typeof chipStates)[number], Record<string, boolean>> = {
  default: {},
  disabled: { disabled: true },
};

/** 행 = 사이즈 × 선택, 열 = 상태 */
const rows = chipSizes.flatMap((size) => chipSelections.map((selection) => ({ size, selection })));

export const TypeByState: StoryObj = {
  name: 'Type × State',
  render: () => (
    <div className="overflow-x-auto">
      <div className="min-w-2xl overflow-hidden rounded-lg border border-border-default bg-background-card">
        <div className="flex h-10 border-b border-border-default bg-background-surface">
          <div className="w-44 shrink-0" />
          {chipStates.map((state) => (
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
            {chipStates.map((state) => (
              <div
                key={state}
                className="flex w-60 shrink-0 items-center gap-3 border-l border-border-default px-4 py-4"
              >
                <Chip size={size} selection={selection} label="전체" {...stateProps[state]} />
                <Chip
                  size={size}
                  selection={selection}
                  label="한식"
                  leadingIcon="check"
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

export const Padding: StoryObj = {
  name: '아이콘 유무별 패딩',
  render: () => (
    <div className="flex flex-col gap-4">
      {chipSizes.map((size) => (
        <div key={size} className="flex flex-col gap-2">
          <span className="text-label-md text-text-muted">
            {size} · 아이콘 없음 {size === 'sm' ? 12 : 16}px / 아이콘 있음 {size === 'sm' ? 6 : 8}px
          </span>
          <div className="flex items-center gap-3">
            <Chip size={size} label="전체" />
            <Chip size={size} label="한식" leadingIcon="check" />
            <Chip size={size} label="전체" selection="selected" />
            <Chip size={size} label="한식" selection="selected" leadingIcon="check" />
          </div>
        </div>
      ))}
    </div>
  ),
};
