import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Button, buttonSizes, buttonVariants } from '@/components/ui/Button';
import { iconNames } from '@/components/foundation/Icon';

const meta = {
  title: 'UI/Button',
  component: Button,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          '타입(primary·secondary·destructive) × 상태(default·disabled·loading) × 사이즈(sm 32 / md 40 / lg 48). 레이블은 label-lg이며 좌·우측 아이콘을 선택적으로 넣을 수 있습니다. loading은 좌측 아이콘을 스피너로 대체하고 레이블은 유지합니다.',
      },
    },
  },
  args: {
    label: 'Save',
    variant: 'primary',
    size: 'md',
    leadingIcon: 'plus',
  },
  argTypes: {
    variant: { control: 'inline-radio', options: buttonVariants },
    size: { control: 'inline-radio', options: buttonSizes },
    leadingIcon: { control: 'select', options: [undefined, ...iconNames] },
    trailingIcon: { control: 'select', options: [undefined, ...iconNames] },
    loading: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

const states = [
  { name: 'Default', props: {} },
  { name: 'Disabled', props: { disabled: true } },
  { name: 'Loading', props: { loading: true } },
] as const;

const typeDescription: Record<string, string> = {
  primary: 'Brand action',
  secondary: 'Neutral action',
  destructive: 'Danger action',
};

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
        {buttonVariants.map((variant, index) => (
          <div
            key={variant}
            className={index < buttonVariants.length - 1 ? 'flex border-b border-border-default' : 'flex'}
          >
            <div className="flex w-48 shrink-0 flex-col justify-center gap-1.5 px-[18px]">
              <span className="text-heading-sm text-text-default capitalize">{variant}</span>
              <span className="text-label-md text-text-muted">{typeDescription[variant]}</span>
            </div>
            {states.map((state) => (
              <div
                key={state.name}
                className="flex flex-1 flex-col items-start justify-center gap-2.5 border-l border-border-default px-[22px] py-[18px]"
              >
                {buttonSizes.map((size) => (
                  <Button
                    key={size}
                    variant={variant}
                    size={size}
                    label="Save"
                    leadingIcon="plus"
                    trailingIcon={size === 'sm' ? undefined : 'arrow-right'}
                    {...state.props}
                  />
                ))}
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
    <div className="flex flex-col gap-6">
      {buttonSizes.map((size) => (
        <div key={size} className="flex flex-col gap-2">
          <span className="text-label-md text-text-muted">
            {size} · {{ sm: 32, md: 40, lg: 48 }[size]}px · 아이콘 {size === 'sm' ? 16 : 20}px
          </span>
          <div className="flex flex-wrap items-center gap-3">
            <Button size={size} label="레이블만" />
            <Button size={size} label="좌측 아이콘" leadingIcon="plus" />
            <Button size={size} label="우측 아이콘" trailingIcon="arrow-right" />
            <Button size={size} label="양쪽 아이콘" leadingIcon="plus" trailingIcon="arrow-right" />
          </div>
        </div>
      ))}
    </div>
  ),
};
