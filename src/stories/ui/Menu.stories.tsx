import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { BottomSheet } from '@/components/ui/BottomSheet';
import { Button } from '@/components/ui/Button';
import { Menu, MenuItem, menuItemVariants, menuSizes } from '@/components/ui/Menu';

const meta = {
  title: 'UI/Menu',
  component: Menu,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          '가로·세로 auto 메뉴 표면. 활성화 시 메뉴아이템을 연결하며, 데스크톱은 메뉴 버튼 아래 팝오버(`surface="popover"`, 테두리 · shadow · padding 8), 모바일은 바텀시트 안 목록(`surface="plain"`)으로 렌더됩니다. `size`는 하위 MenuItem에 컨텍스트로 상속됩니다.',
      },
    },
  },
  args: {
    size: 'md',
    surface: 'popover',
  },
  argTypes: {
    size: { control: 'inline-radio', options: menuSizes },
    surface: { control: 'inline-radio', options: ['popover', 'plain'] },
    children: { control: false },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Menu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <div className="w-[260px]">
      <Menu {...args}>
        <MenuItem icon="edit" label="수정" />
        <MenuItem icon="copy" label="복사" />
        <MenuItem icon="calendar" label="예약 마감" disabled />
        <MenuItem variant="destructive" icon="delete" label="삭제" />
      </Menu>
    </div>
  ),
};

export const DesktopPopover: StoryObj = {
  name: 'Desktop — Popover',
  render: () => (
    <div className="flex w-[260px] flex-col items-start gap-2">
      <Button variant="secondary" label="더보기" trailingIcon="chevron-down" />
      <Menu size="md" className="w-[260px]">
        <MenuItem icon="edit" label="수정" />
        <MenuItem icon="copy" label="복사" />
        <MenuItem icon="calendar" label="예약 마감" disabled />
        <MenuItem variant="destructive" icon="delete" label="삭제" />
      </Menu>
    </div>
  ),
};

export const MobileSheet: StoryObj = {
  name: 'Mobile — Bottom Sheet',
  render: () => (
    <div className="w-[300px]">
      <BottomSheet>
        <Menu surface="plain" size="md">
          <MenuItem icon="edit" label="수정" />
          <MenuItem variant="destructive" icon="delete" label="삭제" />
        </Menu>
      </BottomSheet>
    </div>
  ),
};

export const Sizes: StoryObj = {
  name: 'Menu Sizes',
  render: () => (
    <div className="flex flex-wrap items-start gap-6">
      {menuSizes.map((size) => (
        <div key={size} className="flex flex-col gap-2">
          <span className="text-label-md text-text-muted">
            {size} · {{ sm: 32, md: 40, lg: 48 }[size]}px · 아이콘 {size === 'sm' ? 16 : 20}px
          </span>
          <Menu size={size} className="w-[260px]">
            <MenuItem icon="edit" label="수정하기" />
            <MenuItem icon="copy" label="복사하기" />
            <MenuItem variant="destructive" icon="delete" label="삭제하기" />
          </Menu>
        </div>
      ))}
    </div>
  ),
};

const itemStates = [
  { name: 'Default', props: {} },
  { name: 'Disabled', props: { disabled: true } },
] as const;

const itemTypeDescription: Record<string, string> = {
  default: 'icon-default / text-default',
  destructive: 'icon-error / text-error',
};

const itemTypeLabel: Record<string, string> = {
  default: '수정하기',
  destructive: '삭제하기',
};

const itemTypeIcon: Record<string, 'edit' | 'delete'> = {
  default: 'edit',
  destructive: 'delete',
};

export const MenuItemTypeByState: StoryObj = {
  name: 'MenuItem — Type × State',
  parameters: {
    docs: {
      description: {
        story:
          '행은 타입(default·destructive), 열은 상태(default·disabled). 각 셀에 sm·md·lg 세 사이즈를 함께 보여줍니다. 비활성은 두 타입 모두 icon-muted / text-placeholder + opacity 0.52로 동일합니다.',
      },
    },
  },
  render: () => (
    <div className="overflow-x-auto">
      <div className="min-w-3xl overflow-hidden rounded-lg border border-border-default bg-background-card">
        <div className="flex h-14 border-b border-border-default bg-background-surface">
          <div className="w-56 shrink-0" />
          {itemStates.map((state) => (
            <div
              key={state.name}
              className="flex flex-1 items-center border-l border-border-default px-[18px]"
            >
              <span className="text-label-lg text-text-default">{state.name}</span>
            </div>
          ))}
        </div>
        {menuItemVariants.map((variant, index) => (
          <div
            key={variant}
            className={
              index < menuItemVariants.length - 1 ? 'flex border-b border-border-default' : 'flex'
            }
          >
            <div className="flex w-56 shrink-0 flex-col justify-center gap-1.5 px-[18px] py-4">
              <span className="text-heading-sm text-text-default capitalize">{variant}</span>
              <span className="text-label-md text-text-muted">
                {itemTypeDescription[variant]}
              </span>
            </div>
            {itemStates.map((state) => (
              <div
                key={state.name}
                className="flex flex-1 flex-col gap-1.5 border-l border-border-default px-[18px] py-4"
              >
                {menuSizes.map((size) => (
                  <MenuItem
                    key={size}
                    variant={variant}
                    size={size}
                    icon={itemTypeIcon[variant]}
                    label={itemTypeLabel[variant]}
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

export const MenuItemWithoutIcon: StoryObj = {
  name: 'MenuItem — Icon Optional',
  render: () => (
    <div className="flex flex-wrap items-start gap-6">
      <div className="flex flex-col gap-2">
        <span className="text-label-md text-text-muted">아이콘 포함</span>
        <Menu size="md" className="w-[260px]">
          <MenuItem icon="edit" label="수정하기" />
          <MenuItem icon="share" label="공유하기" />
          <MenuItem variant="destructive" icon="delete" label="삭제하기" />
        </Menu>
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-label-md text-text-muted">아이콘 제외</span>
        <Menu size="md" className="w-[260px]">
          <MenuItem label="수정하기" />
          <MenuItem label="공유하기" />
          <MenuItem variant="destructive" label="삭제하기" />
        </Menu>
      </div>
    </div>
  ),
};
