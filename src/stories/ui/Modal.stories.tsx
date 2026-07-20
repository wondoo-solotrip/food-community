import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Modal } from '@/components/ui/Modal';

const meta = {
  title: 'UI/Modal',
  component: Modal,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          '배경 스크림(background-scrim) 위에 뜨는 다이얼로그. 헤더(제목 heading-sm + 16px 닫기 아이콘), 바디(body-md), 푸터(secondary 1 + primary 1, 상단 구분선)로 구성됩니다. 스크림이나 닫기 아이콘을 누르면 `onClose`가 호출됩니다. 스토리북에서 오버레이 전체를 보여주기 위해 fixed/portal 대신 relative 컨테이너 안 absolute 스크림을 사용합니다.',
      },
    },
  },
  args: {
    open: true,
    title: '모임 신청 확인',
    description:
      '예약 인원과 알레르기 정보를 확인한 뒤 신청을 완료합니다. 호스트가 승인하면 알림으로 알려드릴게요.',
    secondaryLabel: '취소',
    primaryLabel: '신청하기',
  },
  argTypes: {
    open: { control: 'boolean' },
    children: { control: false },
  },
  decorators: [
    (Story) => (
      <div className="w-[600px]">
        <Story />
      </div>
    ),
  ],
  tags: ['autodocs'],
} satisfies Meta<typeof Modal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Structure: StoryObj = {
  name: 'Structure Options',
  render: () => (
    <div className="flex flex-col gap-8">
      {[
        {
          name: '헤더 + 바디 + 푸터 (기본)',
          props: {
            title: '모임 신청 확인',
            description:
              '예약 인원과 알레르기 정보를 확인한 뒤 신청을 완료합니다. 호스트가 승인하면 알림으로 알려드릴게요.',
            secondaryLabel: '취소',
            primaryLabel: '신청하기',
          },
        },
        {
          name: 'primary 액션만',
          props: {
            title: '신청이 완료되었어요',
            description: '호스트가 승인하면 알림으로 알려드릴게요.',
            primaryLabel: '확인',
          },
        },
        {
          name: '푸터 제외',
          props: {
            title: '알레르기 정보',
            description:
              '견과류와 갑각류가 포함된 메뉴가 있습니다. 참여 전 호스트에게 문의해 주세요.',
          },
        },
      ].map((item) => (
        <div key={item.name} className="flex w-[600px] flex-col gap-2">
          <span className="text-label-md text-text-muted">{item.name}</span>
          <Modal {...item.props} />
        </div>
      ))}
    </div>
  ),
};

export const Closed: StoryObj = {
  name: 'Closed (open=false)',
  render: () => (
    <div className="flex w-[600px] flex-col gap-2">
      <span className="text-label-md text-text-muted">
        open=false — 아무것도 렌더되지 않습니다.
      </span>
      <div className="flex min-h-[120px] items-center justify-center rounded-lg border border-dashed border-border-default">
        <Modal open={false} title="모임 신청 확인" description="렌더되지 않습니다." />
        <span className="text-body-md text-text-placeholder">(렌더 없음)</span>
      </div>
    </div>
  ),
};
