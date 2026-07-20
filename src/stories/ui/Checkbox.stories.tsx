import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import {
  Checkbox,
  CheckboxGroup,
  checkboxSelections,
  checkboxSizes,
  checkboxStates,
} from '@/components/ui/Checkbox';

const meta = {
  title: 'UI/Checkbox',
  component: Checkbox,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          '사이즈(sm 16 / md 20) × 선택(unchecked·checked·indeterminate) × 상태(default·disabled·error). 체크 표시는 아이코노그래피 아이콘 대신 design.pen의 path(`M2 6l3 3 5-7`)와 인디터미네이트 사각형을 그대로 재현했습니다. 레이블은 body-md, 체크 영역과 간격은 8px입니다.',
      },
    },
  },
  args: {
    label: '알림 받기',
    size: 'sm',
    selection: 'unchecked',
  },
  argTypes: {
    size: { control: 'inline-radio', options: checkboxSizes },
    selection: { control: 'inline-radio', options: checkboxSelections },
    error: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

const stateProps: Record<(typeof checkboxStates)[number], Record<string, boolean>> = {
  default: {},
  disabled: { disabled: true },
  error: { error: true },
};

const selectionLabel: Record<(typeof checkboxSelections)[number], string> = {
  unchecked: '알림 받기',
  checked: '동의 완료',
  indeterminate: '일부 선택',
};

/** 행 = 사이즈 × 선택, 열 = 상태 */
const rows = checkboxSizes.flatMap((size) =>
  checkboxSelections.map((selection) => ({ size, selection })),
);

export const TypeByState: StoryObj = {
  name: 'Type × State',
  render: () => (
    <div className="overflow-x-auto">
      <div className="min-w-3xl overflow-hidden rounded-lg border border-border-default bg-background-card">
        <div className="flex h-10 border-b border-border-default bg-background-surface">
          <div className="w-44 shrink-0" />
          {checkboxStates.map((state) => (
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
            {checkboxStates.map((state) => (
              <div key={state} className="w-60 shrink-0 border-l border-border-default px-4 py-4">
                <Checkbox
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
  parameters: {
    docs: {
      description: {
        story: '에러 메시지는 개별 체크박스가 아니라 전체 그룹(폼) 아래에 1번만 표시합니다.',
      },
    },
  },
  render: () => (
    <div className="flex flex-wrap gap-6">
      <CheckboxGroup label="관심 카테고리" className="w-70">
        <Checkbox label="알림 받기" />
        <Checkbox label="동의 완료" selection="checked" />
        <Checkbox label="일부 선택" selection="indeterminate" />
      </CheckboxGroup>
      <CheckboxGroup label="관심 카테고리" errorText="최소 1개 이상 선택해 주세요" className="w-70">
        <Checkbox label="알림 받기" error />
        <Checkbox label="동의 완료" selection="checked" error />
        <Checkbox label="일부 선택" selection="indeterminate" error />
      </CheckboxGroup>
    </div>
  ),
};
