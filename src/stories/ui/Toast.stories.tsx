import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Toast, toastTypes } from '@/components/ui/Toast';

const meta = {
  title: 'UI/Toast',
  component: Toast,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          '타입(success·error·info·warning) × 상태(없음). 좌측 상태 아이콘 20px, 메시지 body-md, 우측 닫기 아이콘 20px(선택)로 구성됩니다. 데스크톱은 400px 고정이고 모바일에서는 화면 너비에서 좌우 마진을 뺀 폭으로 확장됩니다. padding 14/16, gap 12, cornerRadius 8.',
      },
    },
  },
  args: {
    type: 'success',
    message: '저장이 완료되었습니다.',
    dismissible: true,
  },
  argTypes: {
    type: { control: 'inline-radio', options: toastTypes },
    message: { control: 'text' },
    dismissible: { control: 'boolean' },
    onDismiss: { action: 'dismissed' },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Toast>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

const states = [
  { name: 'Default', props: {} },
  { name: 'No Close', props: { dismissible: false } },
] as const;

/** design.pen Toast / <Type> 각 인스턴스의 메시지 */
const typeMessages: Record<(typeof toastTypes)[number], string> = {
  success: '저장이 완료되었습니다.',
  error: '요청을 처리하지 못했습니다.',
  info: '새 업데이트를 확인해 주세요.',
  warning: '입력 내용을 다시 확인해 주세요.',
};

const typeDescription: Record<(typeof toastTypes)[number], string> = {
  success: 'check · background-success',
  error: 'error · background-error',
  info: 'info · background-info',
  warning: 'warning · background-warning',
};

export const TypeByState: StoryObj = {
  name: 'Type × State',
  render: () => (
    <div className="overflow-x-auto">
      <div className="min-w-5xl overflow-hidden rounded-lg border border-border-default bg-background-card">
        <div className="flex h-14 border-b border-border-default bg-background-surface">
          <div className="w-48 shrink-0" />
          {states.map((state) => (
            <div
              key={state.name}
              className="flex flex-1 items-center border-l border-border-default px-[18px]"
            >
              <span className="text-label-lg text-text-default">{state.name}</span>
            </div>
          ))}
        </div>
        {toastTypes.map((type, index) => (
          <div
            key={type}
            className={
              index < toastTypes.length - 1 ? 'flex border-b border-border-default' : 'flex'
            }
          >
            <div className="flex w-48 shrink-0 flex-col justify-center gap-1.5 px-[18px] py-[18px]">
              <span className="text-heading-sm text-text-default">{type}</span>
              <span className="text-label-md text-text-muted">{typeDescription[type]}</span>
            </div>
            {states.map((state) => (
              <div
                key={state.name}
                className="flex flex-1 items-center border-l border-border-default px-[22px] py-[18px]"
              >
                <Toast type={type} message={typeMessages[type]} {...state.props} />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  ),
};

export const Types: StoryObj = {
  render: () => (
    <div className="flex flex-col gap-3">
      {toastTypes.map((type) => (
        <Toast key={type} type={type} message={typeMessages[type]} />
      ))}
    </div>
  ),
};

export const Responsive: StoryObj = {
  parameters: {
    docs: {
      description: {
        story:
          '데스크톱(sm 이상)에서는 400px 고정, 모바일에서는 화면 너비에서 좌우 마진(16px)을 뺀 폭으로 확장됩니다. 긴 메시지는 줄바꿈되며 아이콘은 축소되지 않습니다.',
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <span className="text-label-md text-text-muted">모바일 · 360px 뷰포트 - 좌우 마진 16</span>
        <div className="w-[360px] rounded-lg bg-background-screen px-4 py-4">
          <Toast type="info" message={typeMessages.info} />
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-label-md text-text-muted">긴 메시지 · 줄바꿈</span>
        <Toast
          type="warning"
          message="입력하신 내용 중 일부 항목이 확인되지 않았습니다. 다시 확인한 뒤 저장해 주세요."
        />
      </div>
    </div>
  ),
};
