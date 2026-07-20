import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { BottomSheet } from '@/components/ui/BottomSheet';
import { Menu, MenuItem } from '@/components/ui/Menu';

const meta = {
  title: 'UI/Bottom Sheet',
  component: BottomSheet,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          '배경 스크림(background-scrim) 위에 하단 고정으로 올라오는 시트. 가로 전체 · 높이 auto, 상단 12px 라운드, 상단에 44x4 드래그 핸들(border-strong), 중앙에 콘텐츠 영역이 들어갑니다. 스크림을 탭하면 선택 없이 닫히며 `onClose`가 호출됩니다. 스토리북에서 오버레이 전체를 보여주기 위해 fixed/portal 대신 relative 컨테이너 안 absolute 배치를 사용합니다.',
      },
    },
  },
  args: {
    open: true,
    title: '모임 옵션',
    description: '필요한 작업을 선택하세요. 배경 스크림을 탭하면 선택 없이 닫힙니다.',
  },
  argTypes: {
    open: { control: 'boolean' },
    children: { control: false },
  },
  decorators: [
    (Story) => (
      <div className="w-[360px]">
        <Story />
      </div>
    ),
  ],
  tags: ['autodocs'],
} satisfies Meta<typeof BottomSheet>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const WithMenuItems: StoryObj = {
  render: () => (
    <div className="w-[360px]">
      <BottomSheet
        title="모임 옵션"
        description="필요한 작업을 선택하세요. 배경 스크림을 탭하면 선택 없이 닫힙니다."
      >
        <Menu surface="plain" size="md">
          <MenuItem icon="edit" label="모임 수정" />
          <MenuItem icon="share" label="공유하기" />
          <MenuItem variant="destructive" icon="delete" label="삭제하기" />
        </Menu>
      </BottomSheet>
    </div>
  ),
};

export const Structure: StoryObj = {
  name: 'Structure Options',
  render: () => (
    <div className="flex flex-wrap items-start gap-6">
      <div className="flex w-[360px] flex-col gap-2">
        <span className="text-label-md text-text-muted">제목 + 설명</span>
        <BottomSheet
          title="모임 옵션"
          description="필요한 작업을 선택하세요. 배경 스크림을 탭하면 선택 없이 닫힙니다."
        />
      </div>
      <div className="flex w-[360px] flex-col gap-2">
        <span className="text-label-md text-text-muted">핸들 + 콘텐츠만 (제목 제외)</span>
        <BottomSheet>
          <Menu surface="plain" size="lg">
            <MenuItem icon="bookmark" label="저장하기" />
            <MenuItem icon="copy" label="링크 복사" />
            <MenuItem variant="destructive" icon="delete" label="삭제하기" />
          </Menu>
        </BottomSheet>
      </div>
    </div>
  ),
};
