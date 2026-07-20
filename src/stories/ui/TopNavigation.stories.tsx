import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { iconNames } from '@/components/foundation/Icon';
import { TopNavigation, topNavigationIconTones } from '@/components/ui/TopNavigation';

const meta = {
  title: 'UI/Top Navigation',
  component: TopNavigation,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          '높이 56px · background-card · 하단 1px border-default. 좌우 4px 패딩 안에 48px 아이콘 버튼 슬롯(내부 아이콘 24px)이 놓이고 가운데 제목은 heading-sm입니다. 아이콘을 제외해도 슬롯 자리는 남아 제목이 계속 가운데 정렬됩니다. 타입·상태 구분이 없는 단일 컴포넌트입니다.',
      },
    },
  },
  args: {
    title: '오늘의 밥상',
    leftIcon: 'chevron-left',
    leftIconTone: 'default',
    leftIconLabel: '뒤로 가기',
    rightIcon: 'heart',
    rightIconTone: 'brand',
    rightIconLabel: '좋아요',
  },
  argTypes: {
    leftIcon: { control: 'select', options: [undefined, ...iconNames] },
    rightIcon: { control: 'select', options: [undefined, ...iconNames] },
    leftIconTone: { control: 'inline-radio', options: topNavigationIconTones },
    rightIconTone: { control: 'inline-radio', options: topNavigationIconTones },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof TopNavigation>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const TypeByState: StoryObj = {
  name: 'Type × State',
  render: () => (
    <div className="overflow-x-auto">
      <div className="min-w-3xl overflow-hidden rounded-lg border border-border-default bg-background-card">
        <div className="flex h-10 border-b border-border-default bg-background-surface">
          <div className="flex w-40 shrink-0 items-center px-4">
            <span className="text-label-md text-text-default">Type</span>
          </div>
          <div className="flex flex-1 items-center border-l border-border-default px-4">
            <span className="text-label-md text-text-default">None</span>
          </div>
        </div>
        <div className="flex">
          <div className="flex w-40 shrink-0 items-center px-4">
            <span className="text-label-lg text-text-default">None</span>
          </div>
          <div className="flex flex-1 items-center border-l border-border-default p-6">
            <TopNavigation
              title="오늘의 밥상"
              leftIcon="chevron-left"
              leftIconLabel="뒤로 가기"
              rightIcon="heart"
              rightIconLabel="좋아요"
            />
          </div>
        </div>
      </div>
    </div>
  ),
};

/** 실제 화면 프레임(01 Main / 02 Detail / 03 Register / 05 My)이 쓰는 슬롯 조합입니다. */
const slotCases = [
  {
    name: '좌 + 우 (기본)',
    props: {
      title: '오늘의 밥상',
      leftIcon: 'chevron-left',
      leftIconLabel: '뒤로 가기',
      rightIcon: 'heart',
      rightIconLabel: '좋아요',
    },
  },
  {
    name: '좌측만 · 02 Detail Page',
    props: { title: '상세 페이지', leftIcon: 'chevron-left', leftIconLabel: '뒤로 가기' },
  },
  {
    name: '우측만 · 03 Register',
    props: { title: '게시글 등록', rightIcon: 'close', rightIconLabel: '닫기' },
  },
  {
    name: '우측 default 톤 · 05 My Page',
    props: {
      title: '마이 페이지',
      rightIcon: 'settings',
      rightIconTone: 'default',
      rightIconLabel: '설정',
    },
  },
  { name: '아이콘 없음', props: { title: '제목만' } },
] as const;

export const SlotCombinations: StoryObj = {
  name: '아이콘 슬롯 조합',
  render: () => (
    <div className="flex flex-col gap-6">
      {slotCases.map((slotCase) => (
        <div key={slotCase.name} className="flex flex-col gap-2">
          <span className="text-label-md text-text-muted">{slotCase.name}</span>
          <TopNavigation {...slotCase.props} />
        </div>
      ))}
    </div>
  ),
};
