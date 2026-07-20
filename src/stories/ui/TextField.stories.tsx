import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import {
  TextField,
  textFieldSizes,
  textFieldStates,
  textFieldTypes,
} from '@/components/ui/TextField';
import { iconNames } from '@/components/foundation/Icon';

const meta = {
  title: 'UI/Text Field',
  component: TextField,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          '타입(text·password) × 상태(default·focused·disabled·error) × 사이즈(sm 32 / md 40 / lg 48). 레이블 label-lg, 입력 텍스트 body-lg, 헬퍼 텍스트 label-md이며 error일 때 힌트가 에러 메시지로 대체됩니다. 좌·우측 아이콘은 sm 16px, md·lg 20px입니다.',
      },
    },
  },
  args: {
    label: '닉네임',
    type: 'text',
    size: 'md',
    placeholder: '맛집 이름을 입력하세요',
    helperText: '공개 프로필에 표시됩니다',
    errorText: '2자 이상 입력해 주세요',
    leadingIcon: 'search',
  },
  argTypes: {
    type: { control: 'inline-radio', options: textFieldTypes },
    size: { control: 'inline-radio', options: textFieldSizes },
    leadingIcon: { control: 'select', options: [undefined, ...iconNames] },
    trailingIcon: { control: 'select', options: [undefined, ...iconNames] },
    focused: { control: 'boolean' },
    error: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof TextField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

/** design.pen 각 셀의 상태별 props · 표시 값 */
const stateProps: Record<
  (typeof textFieldStates)[number],
  { props: Record<string, boolean>; value?: string }
> = {
  default: { props: {} },
  focused: { props: { focused: true }, value: '온기식당' },
  disabled: { props: { disabled: true }, value: '입력 불가' },
  error: { props: { error: true }, value: 'abc' },
};

const typeConfig = {
  text: { label: '닉네임', leadingIcon: 'search' as const, trailingIcon: undefined },
  password: { label: '비밀번호', leadingIcon: undefined, trailingIcon: 'info' as const },
};

export const TypeByState: StoryObj = {
  name: 'Type × State',
  render: () => (
    <div className="flex flex-col gap-8">
      {textFieldTypes.map((type) => (
        <div key={type} className="flex flex-col gap-3">
          <span className="text-label-lg text-text-brand">{type}</span>
          <div className="overflow-x-auto">
            <div className="min-w-4xl overflow-hidden rounded-lg border border-border-default bg-background-card">
              <div className="flex h-10 border-b border-border-default bg-background-surface">
                <div className="w-36 shrink-0" />
                {textFieldStates.map((state) => (
                  <div
                    key={state}
                    className="flex w-60 shrink-0 items-center border-l border-border-default px-4"
                  >
                    <span className="text-label-md text-text-muted">{state}</span>
                  </div>
                ))}
              </div>
              {textFieldSizes.map((size) => (
                <div key={size} className="flex border-t border-border-default">
                  <div className="flex w-36 shrink-0 items-center px-4">
                    <span className="text-label-lg text-text-default">
                      {size} / {{ sm: 32, md: 40, lg: 48 }[size]}
                    </span>
                  </div>
                  {textFieldStates.map((state) => (
                    <div
                      key={state}
                      className="w-60 shrink-0 border-l border-border-default px-4 py-[18px]"
                    >
                      <TextField
                        type={type}
                        size={size}
                        label={typeConfig[type].label}
                        leadingIcon={typeConfig[type].leadingIcon}
                        trailingIcon={typeConfig[type].trailingIcon}
                        placeholder="맛집 이름을 입력하세요"
                        helperText="공개 프로필에 표시됩니다"
                        errorText="2자 이상 입력해 주세요"
                        defaultValue={stateProps[state].value}
                        {...stateProps[state].props}
                      />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  ),
};

export const Sizes: StoryObj = {
  render: () => (
    <div className="flex max-w-sm flex-col gap-6">
      {textFieldSizes.map((size) => (
        <TextField
          key={size}
          size={size}
          label={`${size} · ${{ sm: 32, md: 40, lg: 48 }[size]}px`}
          placeholder="맛집 이름을 입력하세요"
          helperText={`아이콘 ${size === 'sm' ? 16 : 20}px`}
          leadingIcon="search"
        />
      ))}
    </div>
  ),
};
