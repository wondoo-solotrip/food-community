import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { FoodCard } from '@/components/ui/FoodCard';

const meta = {
  title: 'UI/FoodCard',
  component: FoodCard,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'design.pen `01 Main Page`의 Food Card — Card / Default의 축소형 인스턴스입니다. cornerRadius 8, border-default 1px, shadow(0 8 24 / shadow-card). 미디어는 154×96(8:5) 비율을 유지하며 칸 폭에 맞춰 늘어나고, 본문은 16px bold 제목 + map-pin 16px + label-md 위치 텍스트로 구성됩니다. 메인 페이지 인기 게시글 그리드(모바일 2열 → 태블릿 3열 → 데스크톱 4열)에서 사용합니다.',
      },
    },
  },
  args: {
    title: '비빔밥 맛집',
    location: '서울 강남구',
  },
  argTypes: {
    media: { control: false },
  },
  decorators: [
    (Story) => (
      <div className="w-[154px]">
        <Story />
      </div>
    ),
  ],
  tags: ['autodocs'],
} satisfies Meta<typeof FoodCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: { media: <div className="size-full bg-brand-100" /> },
};

export const Grid: StoryObj = {
  name: 'Main Page Grid (2열)',
  render: () => (
    <div className="grid w-[320px] grid-cols-2 gap-x-3 gap-y-4">
      <FoodCard title="비빔밥 맛집" location="서울 강남구" media={<div className="size-full bg-brand-100" />} />
      <FoodCard title="바질 파스타" location="서울 구로구" media={<div className="size-full bg-sage-100" />} />
      <FoodCard title="크림 라떼" location="서울 동대문구" media={<div className="size-full bg-teal-100" />} />
      <FoodCard title="딸기 케이크" location="서울 강동구" media={<div className="size-full bg-amber-100" />} />
    </div>
  ),
};
