import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Empty } from '@/components/ui/Empty';

const meta = {
  title: 'UI/Empty',
  component: Empty,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          '가로·세로 중앙 정렬 엠티 상태. 타입·상태·사이즈 구분이 없습니다. 비주얼(64x64 background-inverse 위 24px 아이콘) · 설명(body-md) · 액션(secondary 1 + primary 1)은 각각 추가/제외할 수 있고, 제목(heading-sm)은 필수입니다. 액션은 기존 Button 컴포넌트를 재사용합니다.',
      },
    },
  },
  args: {
    visualIcon: 'info',
    title: '아직 등록된 모임이 없어요',
    description: '첫 번째 식사 모임을 열고 이웃들과 메뉴를 나눠보세요.',
    secondaryLabel: '둘러보기',
    primaryLabel: '모임 만들기',
  },
  argTypes: {
    visualIcon: {
      control: 'select',
      options: [undefined, 'info', 'search', 'image', 'bookmark', 'warning', 'comment'],
    },
  },
  decorators: [
    (Story) => (
      <div className="w-[420px]">
        <Story />
      </div>
    ),
  ],
  tags: ['autodocs'],
} satisfies Meta<typeof Empty>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

const compositions = [
  {
    name: '비주얼 + 설명 + 액션',
    props: {
      visualIcon: 'info' as const,
      title: '아직 등록된 모임이 없어요',
      description: '첫 번째 식사 모임을 열고 이웃들과 메뉴를 나눠보세요.',
      secondaryLabel: '둘러보기',
      primaryLabel: '모임 만들기',
    },
  },
  {
    name: '비주얼 제외',
    props: {
      title: '아직 등록된 모임이 없어요',
      description: '첫 번째 식사 모임을 열고 이웃들과 메뉴를 나눠보세요.',
      secondaryLabel: '둘러보기',
      primaryLabel: '모임 만들기',
    },
  },
  {
    name: '설명 제외',
    props: {
      visualIcon: 'search' as const,
      title: '검색 결과가 없어요',
      secondaryLabel: '필터 초기화',
      primaryLabel: '다시 검색',
    },
  },
  {
    name: '액션 제외',
    props: {
      visualIcon: 'image' as const,
      title: '사진이 아직 없어요',
      description: '모임이 끝나면 참여자들이 올린 사진이 여기에 모입니다.',
    },
  },
  {
    name: 'primary 액션만',
    props: {
      visualIcon: 'bookmark' as const,
      title: '저장한 모임이 없어요',
      description: '관심 있는 모임을 저장해두면 여기에서 바로 확인할 수 있어요.',
      primaryLabel: '모임 둘러보기',
    },
  },
  {
    name: '제목만',
    props: { title: '표시할 내용이 없어요' },
  },
];

export const Compositions: StoryObj = {
  name: 'Structure Options',
  render: () => (
    <div className="flex flex-wrap items-start gap-6">
      {compositions.map((item) => (
        <div key={item.name} className="flex w-[420px] flex-col gap-2">
          <span className="text-label-md text-text-muted">{item.name}</span>
          <Empty {...item.props} />
        </div>
      ))}
    </div>
  ),
};
