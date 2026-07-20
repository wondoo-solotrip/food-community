import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Badge, badgeSizes, badgeVariants } from '@/components/ui/Badge';

const meta = {
  title: 'UI/Badge',
  component: Badge,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          '타입(neutral·success·error·info·warning) × 사이즈(md 20 / lg 24). 상태는 없습니다. 좌우 패딩 8px, 완전 라운드, 레이블은 label-md 가운데 정렬이며 배경 토큰에 맞는 on-color 텍스트 토큰을 씁니다.',
      },
    },
  },
  args: {
    label: 'Neutral',
    variant: 'neutral',
    size: 'md',
  },
  argTypes: {
    variant: { control: 'inline-radio', options: badgeVariants },
    size: { control: 'inline-radio', options: badgeSizes },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

const variantLabel: Record<string, string> = {
  neutral: 'Neutral',
  success: 'Success',
  error: 'Error',
  info: 'Info',
  warning: 'Warning',
};

const variantDescription: Record<string, string> = {
  neutral: 'background-inverse / text-inverse',
  success: 'background-success / text-on-success',
  error: 'background-error / text-on-error',
  info: 'background-info / text-on-info',
  warning: 'background-warning / text-on-warning',
};

export const TypeBySize: StoryObj = {
  name: 'Type × Size',
  render: () => (
    <div className="overflow-x-auto">
      <div className="min-w-2xl overflow-hidden rounded-lg border border-border-default bg-background-card">
        <div className="flex h-14 border-b border-border-default bg-background-surface">
          <div className="w-72 shrink-0" />
          {badgeSizes.map((size) => (
            <div
              key={size}
              className="flex flex-1 items-center border-l border-border-default px-[18px]"
            >
              <span className="text-label-lg text-text-default">
                {size} · {size === 'md' ? 20 : 24}px
              </span>
            </div>
          ))}
        </div>
        {badgeVariants.map((variant, index) => (
          <div
            key={variant}
            className={
              index < badgeVariants.length - 1 ? 'flex border-b border-border-default' : 'flex'
            }
          >
            <div className="flex w-72 shrink-0 flex-col justify-center gap-1.5 px-[18px] py-4">
              <span className="text-heading-sm text-text-default capitalize">{variant}</span>
              <span className="text-label-md text-text-muted">{variantDescription[variant]}</span>
            </div>
            {badgeSizes.map((size) => (
              <div
                key={size}
                className="flex flex-1 items-center border-l border-border-default px-[18px] py-4"
              >
                <Badge variant={variant} size={size} label={variantLabel[variant]} />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  ),
};

export const InContext: StoryObj = {
  render: () => (
    <div className="flex flex-col gap-3">
      {[
        { variant: 'success', label: '모집중', text: '주말 브런치 모임' },
        { variant: 'warning', label: '마감임박', text: '성수동 파스타 클래스' },
        { variant: 'error', label: '취소됨', text: '한강 피크닉 도시락' },
        { variant: 'info', label: '신규', text: '동네 반찬 나눔' },
        { variant: 'neutral', label: '종료', text: '연남동 커피 테이스팅' },
      ].map((row) => (
        <div key={row.label} className="flex items-center gap-2.5">
          <Badge variant={row.variant as 'success'} size="md" label={row.label} />
          <span className="text-body-lg text-text-default">{row.text}</span>
        </div>
      ))}
    </div>
  ),
};
