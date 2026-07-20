'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { AppTopNav } from '@/components/app/AppTopNav';
import { Button } from '@/components/ui/Button';
import { Dropzone } from '@/components/ui/FileUploader';
import { TextField } from '@/components/ui/TextField';
import { Textarea } from '@/components/ui/Textarea';
import { Toast } from '@/components/ui/Toast';
import { cn } from '@/lib/cn';

const MAX_PHOTOS = 3;

/** design.pen `03 Register Error State` — 필수값 검증 에러 상태로 시작하는 게시글 등록 폼. */
export default function RegisterPage() {
  const router = useRouter();
  const [photoCount, setPhotoCount] = useState(0);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [toastDismissed, setToastDismissed] = useState(false);

  const photosError = photoCount < 1;
  const titleError = title.trim().length === 0;
  const contentError = content.trim().length < 10;
  const hasError = photosError || titleError || contentError;

  return (
    <div className="flex min-h-dvh flex-1 flex-col bg-background-screen">
      <AppTopNav title="게시글 등록" rightIcon="close" rightIconLabel="닫기" rightHref="/" />

      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-5 px-5 pt-2 pb-8">
        {/* Validation Toast — design.pen 인스턴스(z9LUfI)처럼 폼 폭에 맞춰 fill (단독 사용 시 400px 고정 무시) */}
        {hasError && !toastDismissed && (
          <Toast
            type="error"
            message="필수 정보를 확인해 주세요."
            className="sm:w-full!"
            onDismiss={() => setToastDismissed(true)}
          />
        )}

        {/* Register Progress */}
        <div className="flex h-2 gap-2">
          <div className="flex-1 rounded-full bg-background-brand" />
          <div className="flex-1 rounded-full bg-background-brand" />
          <div
            className={cn('flex-1 rounded-full', hasError ? 'bg-background-error' : 'bg-background-brand')}
          />
        </div>

        {/* Upload Section */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-label-lg text-text-default">사진</span>
            <span
              className={cn('text-label-md', photosError ? 'text-text-error' : 'text-text-muted')}
            >
              {photoCount}/{MAX_PHOTOS}
            </span>
          </div>
          <Dropzone
            state={photosError ? 'error' : 'default'}
            guideText={photosError ? '사진을 1장 이상 추가해 주세요.' : undefined}
            buttonLabel="파일 선택"
            onSelectFiles={() => setPhotoCount((count) => Math.min(MAX_PHOTOS, count + 1))}
          />
        </div>

        {/* Register Fields */}
        <div className="flex flex-col gap-4">
          <TextField
            size="sm"
            label="제목"
            placeholder="예: 오늘의 점심 추천"
            leadingIcon="search"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            error={titleError}
            errorText="제목은 필수입니다."
          />
          <Textarea
            label="내용"
            placeholder="추천 이유와 맛을 자세히 적어주세요."
            maxLength={500}
            value={content}
            onChange={(event) => setContent(event.target.value)}
            error={contentError}
            errorText="내용은 10자 이상 입력해 주세요."
          />
        </div>

        <Button
          variant="primary"
          label="등록하기"
          leadingIcon="plus"
          className="w-full"
          disabled={hasError}
          onClick={() => router.push('/')}
        />
      </main>
    </div>
  );
}
