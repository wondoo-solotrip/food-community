import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

/** 이미지 영역 데모용 — next/image 대신 배경 이미지로 미디어 슬롯을 채웁니다. */
const mediaPhoto = (
  <div
    className="size-full bg-cover bg-center"
    style={{
      backgroundImage:
        'url(https://images.unsplash.com/photo-1591814468924-caf88d1232e1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080)',
    }}
  />
);

const meta = {
  title: 'UI/Card',
  component: Card,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          '가로·세로 auto 카드. cornerRadius 8, border-default 1px, shadow(0 8 24 / shadow-card). 제목 heading-lg, 설명 body-lg, 메타 label-md + 16px 아이콘. `media`를 넘기면 172px 이미지 영역이 추가되고 생략하면 영역 자체가 빠집니다. 액션에는 기존 Button 컴포넌트를 재사용합니다.',
      },
    },
  },
  args: {
    title: '주말 브런치 모임',
    description: '성수동에서 제철 채소와 홈메이드 소스로 함께 만드는 가벼운 점심 모임입니다.',
    meta: '7월 24일 · 8명 참여',
    metaIcon: 'calendar',
  },
  argTypes: {
    metaIcon: { control: 'select', options: ['calendar', 'user', 'comment', 'heart', 'star'] },
    media: { control: false },
    actions: { control: false },
  },
  decorators: [
    (Story) => (
      <div className="w-[360px]">
        <Story />
      </div>
    ),
  ],
  tags: ['autodocs'],
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = { args: { media: mediaPhoto } };

export const WithImage: StoryObj = {
  name: 'With Image Area',
  render: () => (
    <div className="w-[360px]">
      <Card
        media={mediaPhoto}
        title="주말 브런치 모임"
        description="성수동에서 제철 채소와 홈메이드 소스로 함께 만드는 가벼운 점심 모임입니다."
        meta="7월 24일 · 8명 참여"
      />
    </div>
  ),
};

export const WithoutImage: StoryObj = {
  name: 'Without Image Area',
  render: () => (
    <div className="w-[360px]">
      <Card
        title="동네 반찬 나눔"
        description="집에서 만든 반찬을 이웃과 조금씩 나누는 소규모 모임입니다."
        meta="7월 27일 · 5명 참여"
      />
    </div>
  ),
};

export const Structure: StoryObj = {
  render: () => (
    <div className="flex flex-wrap items-start gap-6">
      <div className="flex w-[360px] flex-col gap-2">
        <span className="text-label-md text-text-muted">이미지 + 본문 + 메타</span>
        <Card
          media={mediaPhoto}
          title="주말 브런치 모임"
          description="성수동에서 제철 채소와 홈메이드 소스로 함께 만드는 가벼운 점심 모임입니다."
          meta="7월 24일 · 8명 참여"
        />
      </div>
      <div className="flex w-[360px] flex-col gap-2">
        <span className="text-label-md text-text-muted">이미지 제외 · 제목만</span>
        <Card title="연남동 커피 테이스팅" />
      </div>
      <div className="flex w-[360px] flex-col gap-2">
        <span className="text-label-md text-text-muted">배지 + 액션 (Button 재사용)</span>
        <Card
          media={mediaPhoto}
          title="성수동 파스타 클래스"
          description="생면 반죽부터 소스까지 한 번에 배우는 2시간 클래스입니다."
          meta="7월 30일 · 12명 참여"
          actions={
            <>
              <Button variant="primary" size="sm" label="참여하기" />
              <Button variant="secondary" size="sm" label="공유" leadingIcon="share" />
            </>
          }
        >
          <div className="flex gap-1.5 pt-0.5">
            <Badge variant="success" label="모집중" />
            <Badge variant="info" label="신규" />
          </div>
        </Card>
      </div>
    </div>
  ),
};
