import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Spinner, spinnerSizes } from '@/components/ui/Spinner';

const meta = {
  title: 'UI/Spinner',
  component: Spinner,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          '브랜드 컬러를 사용하는 로딩 인디케이터. design.pen 기준 타입·상태 구분이 없고 사이즈는 md(24) 하나입니다. 트랙은 background-muted, 인디케이터 호는 background-brand이며 100도(전체의 약 27.8%)만 채웁니다. 버튼 내부에서는 16 / 20을 함께 사용합니다.',
      },
    },
  },
  args: {
    size: 24,
  },
  argTypes: {
    size: { control: 'inline-radio', options: spinnerSizes },
    trackClassName: { control: 'text' },
    indicatorClassName: { control: 'text' },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Spinner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

const states = [{ name: 'Default', props: {} }] as const;

const types = [{ name: 'md / 24', description: 'Brand loading indicator', size: 24 as const }];

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
            key={type.name}
            className={index < types.length - 1 ? 'flex border-b border-border-default' : 'flex'}
          >
            <div className="flex w-48 shrink-0 flex-col justify-center gap-1.5 px-[18px] py-[18px]">
              <span className="text-heading-sm text-text-default">{type.name}</span>
              <span className="text-label-md text-text-muted">{type.description}</span>
            </div>
            {states.map((state) => (
              <div
                key={state.name}
                className="flex flex-1 items-center border-l border-border-default px-[22px] py-[18px]"
              >
                <Spinner size={type.size} {...state.props} />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  ),
};

export const Sizes: StoryObj = {
  render: () => (
    <div className="flex flex-wrap items-end gap-8">
      {spinnerSizes.map((size) => (
        <div key={size} className="flex flex-col items-center gap-2">
          <Spinner size={size} />
          <span className="text-label-md text-text-muted">
            {size === 24 ? `md · ${size}px` : `${size}px`}
          </span>
        </div>
      ))}
    </div>
  ),
};

export const OnBrandSurface: StoryObj = {
  parameters: {
    docs: {
      description: {
        story:
          '브랜드 배경 위에서는 트랙 · 인디케이터 stroke 클래스를 inverse 계열로 바꿔 사용합니다. Button의 loading 상태가 이 조합을 씁니다.',
      },
    },
  },
  render: () => (
    <div className="flex flex-wrap items-center gap-6 rounded-lg bg-background-brand p-8">
      {spinnerSizes.map((size) => (
        <Spinner
          key={size}
          size={size}
          trackClassName="stroke-icon-inverse opacity-30"
          indicatorClassName="stroke-icon-inverse"
        />
      ))}
    </div>
  ),
};
