import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Textarea, textareaStates } from '@/components/ui/Textarea';

const meta = {
  title: 'UI/Textarea',
  component: Textarea,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          '상태(default·focused·disabled·error) 4종. 박스는 body-lg 3줄 + 상하 12px 패딩인 96px 고정 높이이며 내용이 넘치면 세로 스크롤됩니다. 레이블 label-lg, 입력 텍스트 body-lg, 헬퍼/카운터 label-md이고 maxLength를 주면 하단 우측에 글자수 카운터가 붙습니다.',
      },
    },
  },
  args: {
    label: '소개글',
    placeholder: '맛집 경험을 공유해 주세요',
    helperText: '최대 300자까지 가능',
    errorText: '10자 이상 작성해 주세요',
    maxLength: 300,
  },
  argTypes: {
    focused: { control: 'boolean' },
    error: { control: 'boolean' },
    disabled: { control: 'boolean' },
    maxLength: { control: 'number' },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Textarea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

/** design.pen 각 상태 셀의 props · 표시 값 */
const stateProps: Record<
  (typeof textareaStates)[number],
  { props: Record<string, boolean>; value?: string }
> = {
  default: { props: {} },
  focused: { props: { focused: true }, value: '혼밥하기 좋고 국물이 깊어요.' },
  disabled: { props: { disabled: true }, value: '작성 불가' },
  error: { props: { error: true }, value: '짧음' },
};

export const TypeByState: StoryObj = {
  name: 'Type × State',
  render: () => (
    <div className="overflow-x-auto">
      <div className="min-w-4xl overflow-hidden rounded-lg border border-border-default bg-background-card">
        <div className="flex h-10 border-b border-border-default bg-background-surface">
          <div className="w-36 shrink-0" />
          {textareaStates.map((state) => (
            <div
              key={state}
              className="flex w-60 shrink-0 items-center border-l border-border-default px-4"
            >
              <span className="text-label-md text-text-muted">{state}</span>
            </div>
          ))}
        </div>
        <div className="flex">
          <div className="flex w-36 shrink-0 items-center px-4">
            <span className="text-label-lg text-text-default">textarea</span>
          </div>
          {textareaStates.map((state) => (
            <div key={state} className="w-60 shrink-0 border-l border-border-default px-4 py-[18px]">
              <Textarea
                label="소개글"
                placeholder="맛집 경험을 공유해 주세요"
                helperText="최대 300자까지 가능"
                errorText="10자 이상 작성해 주세요"
                maxLength={300}
                value={stateProps[state].value ?? ''}
                readOnly
                {...stateProps[state].props}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  ),
};

export const WithoutCounter: StoryObj = {
  name: '카운터 제외',
  render: () => (
    <div className="max-w-sm">
      <Textarea
        label="소개글"
        placeholder="맛집 경험을 공유해 주세요"
        helperText="카운터 없이 헬퍼 텍스트만 노출됩니다"
      />
    </div>
  ),
};

export const Overflow: StoryObj = {
  name: '3줄 초과 스크롤',
  render: () => (
    <div className="max-w-sm">
      <Textarea
        label="소개글"
        helperText="3줄을 넘어가면 박스 안에서 스크롤됩니다"
        maxLength={300}
        value={'혼밥하기 좋고 국물이 깊어요. '.repeat(8)}
        readOnly
      />
    </div>
  ),
};
