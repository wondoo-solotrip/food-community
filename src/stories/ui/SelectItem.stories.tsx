import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { SelectItem, selectItemSizes, selectItemStates } from '@/components/ui/SelectItem';

const meta = {
  title: 'UI/Select Item',
  component: SelectItem,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          '사이즈(sm 32 / md 40 / lg 48) × 상태(default·selected·disabled). 사이즈는 참조하는 Select를 따릅니다. 좌측 옵션 텍스트는 body-lg이고, selected일 때만 우측에 check 아이콘(sm 16 / md·lg 20, icon-brand)이 붙습니다.',
      },
    },
  },
  args: {
    label: '한식',
    size: 'md',
  },
  argTypes: {
    size: { control: 'inline-radio', options: selectItemSizes },
    selected: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof SelectItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

/** design.pen 각 상태 셀의 props · 표시 값 */
const stateProps: Record<
  (typeof selectItemStates)[number],
  { props: Record<string, boolean>; label: string }
> = {
  default: { props: {}, label: '한식' },
  selected: { props: { selected: true }, label: '한식' },
  disabled: { props: { disabled: true }, label: '양식' },
};

export const TypeByState: StoryObj = {
  name: 'Type × State',
  render: () => (
    <div className="overflow-x-auto">
      <div className="min-w-3xl overflow-hidden rounded-lg border border-border-default bg-background-card">
        <div className="flex h-10 border-b border-border-default bg-background-surface">
          <div className="w-36 shrink-0" />
          {selectItemStates.map((state) => (
            <div
              key={state}
              className="flex w-60 shrink-0 items-center border-l border-border-default px-4"
            >
              <span className="text-label-md text-text-muted">{state}</span>
            </div>
          ))}
        </div>
        {selectItemSizes.map((size) => (
          <div key={size} className="flex border-t border-border-default">
            <div className="flex w-36 shrink-0 items-center px-4">
              <span className="text-label-lg text-text-default">
                {size} / {{ sm: 32, md: 40, lg: 48 }[size]}
              </span>
            </div>
            {selectItemStates.map((state) => (
              <div key={state} className="w-60 shrink-0 border-l border-border-default px-4 py-3.5">
                <SelectItem
                  size={size}
                  label={stateProps[state].label}
                  {...stateProps[state].props}
                />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  ),
};

export const InPanel: StoryObj = {
  name: '패널 안 목록',
  render: () => (
    <div
      role="listbox"
      aria-label="카테고리"
      className="flex max-w-xs flex-col overflow-hidden rounded-md border border-border-default bg-background-card"
    >
      <SelectItem label="한식" selected />
      <SelectItem label="분식" />
      <SelectItem label="일식" />
      <SelectItem label="양식" disabled />
    </div>
  ),
};
