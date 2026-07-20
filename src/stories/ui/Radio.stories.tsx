import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Radio, RadioGroup, radioSelections, radioSizes, radioStates } from '@/components/ui/Radio';

const meta = {
  title: 'UI/Radio',
  component: Radio,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          '사이즈(sm 16 / md 20) × 선택(unselected·selected) × 상태(default·disabled). 선택 표시는 아이코노그래피 아이콘 대신 5px 브랜드 링(원 테두리)으로 그립니다. 레이블은 body-md, 라디오 영역과 간격은 8px입니다. 단독 사용이 금지되어 있어 항상 RadioGroup 안에서 사용합니다.',
      },
    },
  },
  args: {
    label: '최신순',
    size: 'sm',
    selection: 'unselected',
  },
  argTypes: {
    size: { control: 'inline-radio', options: radioSizes },
    selection: { control: 'inline-radio', options: radioSelections },
    disabled: { control: 'boolean' },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Radio>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  decorators: [
    (StoryFn) => (
      <RadioGroup label="정렬 방식" className="w-70">
        <StoryFn />
      </RadioGroup>
    ),
  ],
};

const stateProps: Record<(typeof radioStates)[number], Record<string, boolean>> = {
  default: {},
  disabled: { disabled: true },
};

const selectionLabel: Record<(typeof radioSelections)[number], string> = {
  unselected: '최신순',
  selected: '추천순',
};

/** 행 = 사이즈 × 선택, 열 = 상태 */
const rows = radioSizes.flatMap((size) => radioSelections.map((selection) => ({ size, selection })));

export const TypeByState: StoryObj = {
  name: 'Type × State',
  render: () => (
    <div className="overflow-x-auto">
      <div className="min-w-2xl overflow-hidden rounded-lg border border-border-default bg-background-card">
        <div className="flex h-10 border-b border-border-default bg-background-surface">
          <div className="w-44 shrink-0" />
          {radioStates.map((state) => (
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
            {radioStates.map((state) => (
              <div key={state} className="w-60 shrink-0 border-l border-border-default px-4 py-4">
                <Radio
                  size={size}
                  selection={selection}
                  label={selectionLabel[selection]}
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

export const GroupUsage: StoryObj = {
  name: '그룹 사용례',
  render: () => (
    <div className="flex flex-wrap gap-6">
      <RadioGroup label="정렬 방식" className="w-70">
        <Radio name="sort-default" label="최신순" />
        <Radio name="sort-default" label="추천순" selection="selected" />
      </RadioGroup>
      <RadioGroup label="정렬 방식" className="w-70">
        <Radio name="sort-disabled" label="최신순" disabled />
        <Radio name="sort-disabled" label="추천순" selection="selected" disabled />
      </RadioGroup>
    </div>
  ),
};
