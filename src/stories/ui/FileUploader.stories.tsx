import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import {
  Dropzone,
  FileItem,
  FileUploader,
  dropzoneStates,
  fileItemStates,
} from '@/components/ui/FileUploader';

const meta = {
  title: 'UI/File Uploader',
  component: FileUploader,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          '드롭존 + 파일선택버튼 결합 단일형. 상단에 파일 형식·용량 제한 안내(label-md), 가운데 142px 드롭존(안내문구 body-md + sm 버튼), 하단에 파일 아이템 리스트를 둡니다. 드롭존 상태는 default·dragover·disabled·error, 파일 아이템 상태는 uploading(스피너)·complete(check)·error(error 아이콘)입니다.',
      },
    },
  },
  args: {
    limitText: 'JPG, PNG, PDF · 최대 10MB · 5개까지 업로드 가능',
    dropzoneState: 'default',
  },
  argTypes: {
    dropzoneState: { control: 'inline-radio', options: dropzoneStates },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof FileUploader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <div className="max-w-xs">
      <FileUploader {...args}>
        <FileItem state="uploading" name="review.jpg" meta="업로드 중 62%" />
        <FileItem state="complete" name="review.jpg" meta="완료" />
        <FileItem state="error" name="menu.pdf" meta="형식 오류" />
      </FileUploader>
    </div>
  ),
};

export const DropzoneByState: StoryObj = {
  name: 'Dropzone · Type × State',
  render: () => (
    <div className="flex flex-col gap-3">
      <p className="text-label-md text-text-muted">
        JPG, PNG, PDF · 최대 10MB · 5개까지 업로드 가능
      </p>
      <div className="overflow-x-auto">
        <div className="min-w-4xl overflow-hidden rounded-lg border border-border-default bg-background-card">
          <div className="flex h-10 border-b border-border-default bg-background-surface">
            <div className="w-36 shrink-0" />
            {dropzoneStates.map((state) => (
              <div
                key={state}
                className="flex w-60 shrink-0 items-center border-l border-border-default px-4"
              >
                <span className="text-label-md text-text-muted">{state}</span>
              </div>
            ))}
          </div>
          <div className="flex border-t border-border-default">
            <div className="flex w-36 shrink-0 items-center px-4">
              <span className="text-label-lg text-text-default">single</span>
            </div>
            {dropzoneStates.map((state) => (
              <div key={state} className="w-60 shrink-0 border-l border-border-default px-4 py-3.5">
                <Dropzone state={state} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  ),
};

const fileItemProps: Record<
  (typeof fileItemStates)[number],
  { name: string; meta: string }
> = {
  uploading: { name: 'review.jpg', meta: '업로드 중 62%' },
  complete: { name: 'review.jpg', meta: '완료' },
  error: { name: 'menu.pdf', meta: '형식 오류' },
};

export const FileItemByState: StoryObj = {
  name: 'File Item · Type × State',
  render: () => (
    <ul className="flex flex-wrap gap-4">
      {fileItemStates.map((state) => (
        <li key={state} className="flex w-65 flex-col gap-2">
          <span className="text-label-md text-text-muted">{state}</span>
          <ul className="flex flex-col">
            <FileItem state={state} {...fileItemProps[state]} />
          </ul>
        </li>
      ))}
    </ul>
  ),
};
