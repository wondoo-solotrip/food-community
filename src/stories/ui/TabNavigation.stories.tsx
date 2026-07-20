import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { TabNavigation } from '@/components/ui/TabNavigation';

/** design.pen `Component / Tab Navigation`의 기본 3개 탭. */
const defaultItems = ['추천', '인기', '신규'];

const meta = {
  title: 'UI/Tab Navigation',
  component: TabNavigation,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          '높이 48px · background-card · 하단 1px border-default. 탭 2개 이상을 균등 분배하며 상단 패딩 12px + label-lg 레이블 + 하단 2px 인디케이터로 구성됩니다. 선택 탭은 text-brand 레이블과 background-brand 인디케이터, 미선택 탭은 text-muted 레이블과 투명 인디케이터입니다.',
      },
    },
  },
  args: {
    items: defaultItems,
    selectedIndex: 0,
    fullWidth: false,
  },
  argTypes: {
    selectedIndex: { control: { type: 'number', min: 0, max: 4 } },
    fullWidth: { control: 'boolean' },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof TabNavigation>;

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
            <TabNavigation items={defaultItems} selectedIndex={0} />
          </div>
        </div>
      </div>
    </div>
  ),
};

export const ItemCounts: StoryObj = {
  name: '아이템 2개 이상',
  render: () => (
    <div className="flex flex-col items-start gap-6">
      {[2, 3, 4, 5].map((count) => {
        const items = ['추천', '인기', '신규', '팔로잉', '최근'].slice(0, count);

        return (
          <div key={count} className="flex flex-col gap-2">
            <span className="text-label-md text-text-muted">{count}개 · 탭당 120px</span>
            <TabNavigation items={items} selectedIndex={0} />
          </div>
        );
      })}
    </div>
  ),
};

export const Selection: StoryObj = {
  name: '선택 인덱스 · 가로 전체',
  render: () => (
    <div className="flex flex-col items-start gap-6">
      {defaultItems.map((label, index) => (
        <div key={label} className="flex flex-col gap-2">
          <span className="text-label-md text-text-muted">
            선택: {label} (index {index})
          </span>
          <TabNavigation items={defaultItems} selectedIndex={index} />
        </div>
      ))}
      <div className="flex w-full flex-col gap-2">
        <span className="text-label-md text-text-muted">fullWidth · 가로 전체 균등 분배</span>
        <TabNavigation items={defaultItems} selectedIndex={1} fullWidth />
      </div>
    </div>
  ),
};
