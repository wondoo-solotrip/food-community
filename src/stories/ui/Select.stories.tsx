import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Select, selectSizes, selectStates } from '@/components/ui/Select';
import { SelectItem } from '@/components/ui/SelectItem';

const meta = {
  title: 'UI/Select',
  component: Select,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          '사이즈(sm 32 / md 40 / lg 48) × 상태(default·focused·disabled·error). focused는 패널이 열려 있는 동안 유지되므로 `open` prop으로 제어합니다. 레이블 label-lg, 선택값 body-lg, 헬퍼 label-md이며 우측에 chevron-down 아이콘(sm 16 / md·lg 20)이 붙습니다.',
      },
    },
  },
  args: {
    label: '카테고리',
    size: 'md',
    placeholder: '음식 종류 선택',
    helperText: '맛집 분류에 사용됩니다',
    errorText: '카테고리를 선택해 주세요',
  },
  argTypes: {
    size: { control: 'inline-radio', options: selectSizes },
    open: { control: 'boolean' },
    error: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

/** design.pen 각 상태 셀의 props · 표시 값 */
const stateProps: Record<
  (typeof selectStates)[number],
  { props: Record<string, boolean>; value?: string }
> = {
  default: { props: {} },
  focused: { props: { open: true }, value: '한식' },
  disabled: { props: { disabled: true }, value: '선택 불가' },
  error: { props: { error: true }, value: '분식' },
};

export const TypeByState: StoryObj = {
  name: 'Type × State',
  render: () => (
    <div className="overflow-x-auto">
      <div className="min-w-4xl overflow-hidden rounded-lg border border-border-default bg-background-card">
        <div className="flex h-10 border-b border-border-default bg-background-surface">
          <div className="w-36 shrink-0" />
          {selectStates.map((state) => (
            <div
              key={state}
              className="flex w-60 shrink-0 items-center border-l border-border-default px-4"
            >
              <span className="text-label-md text-text-muted">{state}</span>
            </div>
          ))}
        </div>
        {selectSizes.map((size) => (
          <div key={size} className="flex border-t border-border-default">
            <div className="flex w-36 shrink-0 items-center px-4">
              <span className="text-label-lg text-text-default">
                {size} / {{ sm: 32, md: 40, lg: 48 }[size]}
              </span>
            </div>
            {selectStates.map((state) => (
              <div key={state} className="w-60 shrink-0 border-l border-border-default px-4 py-[18px]">
                <Select
                  size={size}
                  label="카테고리"
                  placeholder="음식 종류 선택"
                  helperText="맛집 분류에 사용됩니다"
                  errorText="카테고리를 선택해 주세요"
                  value={stateProps[state].value}
                  {...stateProps[state].props}
                >
                  <SelectItem size={size} label="한식" selected />
                  <SelectItem size={size} label="분식" />
                  <SelectItem size={size} label="양식" disabled />
                </Select>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  ),
};

export const OpenPanel: StoryObj = {
  name: '패널 열림',
  parameters: {
    docs: {
      description: {
        story: '데스크톱에서는 셀렉트 아래에 셀렉트아이템이 연결됩니다.',
      },
    },
  },
  render: () => (
    <div className="max-w-xs">
      <Select label="카테고리" value="한식" helperText="맛집 분류에 사용됩니다" open>
        <SelectItem label="한식" selected />
        <SelectItem label="분식" />
        <SelectItem label="양식" disabled />
      </Select>
    </div>
  ),
};
