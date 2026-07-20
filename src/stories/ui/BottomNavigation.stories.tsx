import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { BottomNavigation } from '@/components/ui/BottomNavigation';
import type { BottomNavigationItem } from '@/components/ui/BottomNavigation';

/** design.pen `Component / Bottom Navigation`의 기본 4개 아이템. */
const defaultItems: BottomNavigationItem[] = [
  { icon: 'home', label: '홈' },
  { icon: 'calendar', label: '일정' },
  { icon: 'bookmark', label: '저장' },
  { icon: 'user', label: '내 정보' },
];

const meta = {
  title: 'UI/Bottom Navigation',
  component: BottomNavigation,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          '높이 56px · background-card · 상단 1px border-default. 아이템 2~5개를 균등 분배하며 각 아이템은 24px 아이콘과 label-md 레이블을 2px 간격으로 세로 배치합니다. 미선택은 icon-muted/text-muted, 선택은 icon-brand/text-brand로 구분합니다(design.pen과 동일하게 색으로만 구분 — 아이코노그래피에 필 변형이 없습니다). 레이블은 제외할 수 있습니다.',
      },
    },
  },
  args: {
    items: defaultItems,
    selectedIndex: 0,
    showLabels: true,
  },
  argTypes: {
    selectedIndex: { control: { type: 'number', min: 0, max: 4 } },
    showLabels: { control: 'boolean' },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof BottomNavigation>;

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
            <BottomNavigation items={defaultItems} selectedIndex={0} />
          </div>
        </div>
      </div>
    </div>
  ),
};

export const ItemCounts: StoryObj = {
  name: '아이템 2~5개',
  render: () => (
    <div className="flex flex-col gap-6">
      {[2, 3, 4, 5].map((count) => {
        const items = [...defaultItems, { icon: 'settings', label: '설정' } as const].slice(
          0,
          count,
        );

        return (
          <div key={count} className="flex flex-col gap-2">
            <span className="text-label-md text-text-muted">{count}개 · 균등 분배</span>
            <BottomNavigation items={items} selectedIndex={0} />
          </div>
        );
      })}
    </div>
  ),
};

export const Selection: StoryObj = {
  name: '선택 인덱스 · 레이블 유무',
  render: () => (
    <div className="flex flex-col gap-6">
      {defaultItems.map((item, index) => (
        <div key={item.label} className="flex flex-col gap-2">
          <span className="text-label-md text-text-muted">
            선택: {item.label} (index {index})
          </span>
          <BottomNavigation items={defaultItems} selectedIndex={index} />
        </div>
      ))}
      <div className="flex flex-col gap-2">
        <span className="text-label-md text-text-muted">레이블 제외 (showLabels=false)</span>
        <BottomNavigation items={defaultItems} selectedIndex={0} showLabels={false} />
      </div>
    </div>
  ),
};
