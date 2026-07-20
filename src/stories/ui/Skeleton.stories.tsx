import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Skeleton, skeletonTypes } from '@/components/ui/Skeleton';

const meta = {
  title: 'UI/Skeleton',
  component: Skeleton,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          '타입(텍스트형·사각형·원형) × 상태(없음)의 로딩 플레이스홀더. 색은 뉴트럴 계열 background-muted 하나이며, 치수는 대상 요소를 그대로 따릅니다 — 텍스트형은 행 높이(기본 20, 행 간격 10), 사각형은 너비×높이(기본 280×120), 원형은 지름(기본 56). design.pen에 애니메이션 표현이 없어 정적 렌더가 기본이고 `animated`로 셰이머를 켭니다.',
      },
    },
  },
  args: {
    type: 'text',
    animated: false,
  },
  argTypes: {
    type: { control: 'inline-radio', options: skeletonTypes },
    lineHeight: { control: { type: 'number', min: 8, max: 80 } },
    lines: { control: { type: 'number', min: 1, max: 8 } },
    width: { control: 'text' },
    height: { control: 'text' },
    diameter: { control: { type: 'number', min: 16, max: 200 } },
    animated: { control: 'boolean' },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Skeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

const states = [{ name: 'Default', props: {} }] as const;

const types = [
  {
    key: 'text' as const,
    label: '텍스트형',
    description: 'line height 20 × 2행',
    render: () => <Skeleton type="text" width={360} />,
  },
  {
    key: 'rectangle' as const,
    label: '사각형',
    description: '280 × 120',
    render: () => <Skeleton type="rectangle" width={280} height={120} />,
  },
  {
    key: 'circle' as const,
    label: '원형',
    description: 'diameter 56',
    render: () => <Skeleton type="circle" diameter={56} />,
  },
];

export const TypeByState: StoryObj = {
  name: 'Type × State',
  render: () => (
    <div className="overflow-x-auto">
      <div className="min-w-3xl overflow-hidden rounded-lg border border-border-default bg-background-card">
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
        {types.map((type, index) => (
          <div
            key={type.key}
            className={index < types.length - 1 ? 'flex border-b border-border-default' : 'flex'}
          >
            <div className="flex w-48 shrink-0 flex-col justify-center gap-1.5 px-[18px] py-[18px]">
              <span className="text-heading-sm text-text-default">{type.label}</span>
              <span className="text-label-md text-text-muted">{type.description}</span>
            </div>
            {states.map((state) => (
              <div
                key={state.name}
                className="flex flex-1 items-center border-l border-border-default px-[22px] py-[18px]"
              >
                {type.render()}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  ),
};

export const Animated: StoryObj = {
  parameters: {
    docs: {
      description: {
        story: '`animated`를 켜면 Tailwind `animate-pulse` 셰이머가 적용됩니다.',
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <span className="text-label-md text-text-muted">정적 (기본)</span>
        <div className="flex items-center gap-6">
          <Skeleton type="text" width={280} />
          <Skeleton type="rectangle" width={200} height={100} />
          <Skeleton type="circle" diameter={56} />
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-label-md text-text-muted">animated</span>
        <div className="flex items-center gap-6">
          <Skeleton type="text" width={280} animated />
          <Skeleton type="rectangle" width={200} height={100} animated />
          <Skeleton type="circle" diameter={56} animated />
        </div>
      </div>
    </div>
  ),
};

export const CardPlaceholder: StoryObj = {
  parameters: {
    docs: {
      description: {
        story:
          '세 타입을 조합해 실제 카드의 로딩 상태를 대체하는 예시. 각 스켈레톤 치수는 대상 요소의 치수를 그대로 따릅니다.',
      },
    },
  },
  render: () => (
    <div className="flex w-[360px] flex-col gap-4 rounded-lg border border-border-default bg-background-card p-4">
      <Skeleton type="rectangle" height={180} animated />
      <div className="flex items-center gap-3">
        <Skeleton type="circle" diameter={40} animated />
        <div className="flex-1">
          <Skeleton type="text" lines={2} lineHeight={16} animated />
        </div>
      </div>
    </div>
  ),
};
