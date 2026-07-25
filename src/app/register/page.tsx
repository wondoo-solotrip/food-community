'use client';

import { useEffect, useRef, useState, type ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';

import { AppTopNav } from '@/components/app/AppTopNav';
import { Icon } from '@/components/foundation/Icon';
import { Button } from '@/components/ui/Button';
import { Dropzone, FileItem } from '@/components/ui/FileUploader';
import { TextField } from '@/components/ui/TextField';
import { Textarea } from '@/components/ui/Textarea';
import { Toast } from '@/components/ui/Toast';
import { useSession } from '@/hooks/useSession';
import { apiFetch, ApiClientError } from '@/lib/api/client';
import { cn } from '@/lib/cn';
import type { Place } from '@/lib/places';
import { clearPlaceDraft, readPlaceDraft, writePlaceDraft } from '@/lib/placeDraft';
import { placeSelectionQuery, type PlaceSelection } from '@/lib/placeSelection';

const MAX_PHOTOS = 3;
const MIN_CONTENT_LENGTH = 10;

interface SelectedPhoto {
  file: File;
  previewUrl: string;
}

/** 보관해 둔 초안의 파일들로 미리보기를 다시 만든다(object URL 은 라우팅을 건너 살려두지 않는다). */
function restorePhotos(files: File[]): SelectedPhoto[] {
  return files.map((file) => ({ file, previewUrl: URL.createObjectURL(file) }));
}

/**
 * design.pen `03 Register Error State` — 필수값 검증 에러 상태로 시작하는 게시글 등록 폼.
 *
 * 장소(지도 정보)는 별도 화면(`/register/place`)에서 고르고 온다. 그동안 이 화면은 언마운트되므로
 * 입력값은 `placeDraft` 에 맡겨 두고, 돌아왔을 때 초안에서 그대로 복원한다.
 */
export default function RegisterPage() {
  const router = useRouter();
  const { session, loading } = useSession();
  const fileInputRef = useRef<HTMLInputElement>(null);
  // 장소 화면에 다녀온 직후라면 초안이 남아 있다. 첫 렌더에서 한 번만 읽는다.
  const [photos, setPhotos] = useState<SelectedPhoto[]>(() =>
    restorePhotos(readPlaceDraft()?.photos ?? []),
  );
  const [title, setTitle] = useState(() => readPlaceDraft()?.title ?? '');
  const [content, setContent] = useState(() => readPlaceDraft()?.content ?? '');
  // 장소는 이 화면에서 직접 바꾸지 않는다. 장소 화면이 초안에 써 둔 값을 마운트 시 읽기만 한다.
  const [location] = useState<PlaceSelection | null>(() => readPlaceDraft()?.location ?? null);
  const [toastDismissed, setToastDismissed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // 글 등록은 로그인 사용자만 가능하다(POST /api/places 는 401 을 던진다).
  useEffect(() => {
    if (!loading && !session?.user) router.replace('/login?next=/register');
  }, [loading, session, router]);

  // 미리보기용 object URL 은 화면을 떠날 때 반드시 회수한다.
  // (장소 화면으로 갈 때도 회수하고, 돌아오면 초안의 File 로 다시 만든다.)
  const photosRef = useRef(photos);
  useEffect(() => {
    photosRef.current = photos;
  }, [photos]);
  useEffect(() => {
    return () => {
      photosRef.current.forEach((photo) => URL.revokeObjectURL(photo.previewUrl));
    };
  }, []);

  const photosError = photos.length < 1;
  const titleError = title.trim().length === 0;
  const contentError = content.trim().length < MIN_CONTENT_LENGTH;
  // 지도 정보는 필수값이다. 장소를 고르지 않으면 등록 버튼이 열리지 않는다.
  const placeError = location === null;
  const hasError = photosError || titleError || contentError || placeError;

  function handleSelectFiles(event: ChangeEvent<HTMLInputElement>) {
    const selected = Array.from(event.target.files ?? []);
    // 같은 파일을 다시 고를 수 있도록 input 값을 비운다.
    event.target.value = '';
    if (!selected.length) return;

    setPhotos((current) => {
      const room = MAX_PHOTOS - current.length;
      const added = selected
        .slice(0, Math.max(0, room))
        .map((file) => ({ file, previewUrl: URL.createObjectURL(file) }));
      return [...current, ...added];
    });
    setSubmitError(null);
  }

  function handleRemovePhoto(previewUrl: string) {
    URL.revokeObjectURL(previewUrl);
    setPhotos((current) => current.filter((photo) => photo.previewUrl !== previewUrl));
  }

  /** 장소 선택 화면으로 이동. 돌아왔을 때 폼이 그대로이도록 지금 입력값을 초안에 맡긴다. */
  function openPlacePicker() {
    writePlaceDraft({ title, content, photos: photos.map((photo) => photo.file), location });
    // 이미 고른 장소가 있으면 그 위치에서 시작하도록 쿼리로 넘긴다.
    const query = location ? `?${placeSelectionQuery(location)}` : '';
    router.push(`/register/place${query}`);
  }

  /** 닫기(X) — 등록을 그만두는 것이므로 보관 중이던 초안까지 비운다. */
  function discardDraft() {
    clearPlaceDraft();
  }

  async function handleSubmit() {
    if (hasError || !location || submitting) return;

    setSubmitting(true);
    setSubmitError(null);

    const form = new FormData();
    form.append('title', title);
    form.append('content', content);
    photos.forEach((photo) => form.append('images', photo.file));
    // 지도 정보는 네 값을 함께 보낸다. 하나라도 빠지면 서버가 400 으로 돌려준다.
    form.append('name', location.name);
    form.append('address', location.address);
    form.append('lat', String(location.lat));
    form.append('lng', String(location.lng));

    try {
      const { place } = await apiFetch<{ place: Place }>('/api/places', {
        method: 'POST',
        body: form,
      });
      photos.forEach((photo) => URL.revokeObjectURL(photo.previewUrl));
      clearPlaceDraft();
      router.push(`/posts/${place.id}`);
    } catch (error) {
      setSubmitError(
        error instanceof ApiClientError ? error.message : '게시글을 등록하지 못했습니다.',
      );
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-dvh flex-1 flex-col bg-background-screen">
      <AppTopNav
        title="게시글 등록"
        rightIcon="close"
        rightIconLabel="닫기"
        rightHref="/"
        onRightClick={discardDraft}
      />

      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-5 px-5 pt-2 pb-8">
        {/* Validation Toast — design.pen 인스턴스(z9LUfI)처럼 폼 폭에 맞춰 fill (단독 사용 시 400px 고정 무시) */}
        {(submitError || (hasError && !toastDismissed)) && (
          <Toast
            type="error"
            message={submitError ?? '필수 정보를 확인해 주세요.'}
            className="sm:w-full!"
            onDismiss={() => (submitError ? setSubmitError(null) : setToastDismissed(true))}
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
              {photos.length}/{MAX_PHOTOS}
            </span>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            multiple
            hidden
            onChange={handleSelectFiles}
          />
          <Dropzone
            state={photos.length >= MAX_PHOTOS ? 'disabled' : photosError ? 'error' : 'default'}
            guideText={photosError ? '사진을 1장 이상 추가해 주세요.' : undefined}
            buttonLabel="파일 선택"
            onSelectFiles={() => fileInputRef.current?.click()}
          />
          {photos.length > 0 && (
            <ul className="flex flex-col gap-2">
              {photos.map((photo) => (
                <FileItem
                  key={photo.previewUrl}
                  state="complete"
                  name={photo.file.name}
                  meta={`${Math.round(photo.file.size / 1024).toLocaleString()}KB`}
                  thumbnailSrc={photo.previewUrl}
                  onRemove={() => handleRemovePhoto(photo.previewUrl)}
                />
              ))}
            </ul>
          )}
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

        {/* Place Section — 장소 검색·등록 플로우(design.pen `06~08`) 진입점. 지도 정보는 필수값이다. */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-label-lg text-text-default">장소</span>
            <span
              className={cn('text-label-md', placeError ? 'text-text-error' : 'text-text-muted')}
            >
              {placeError ? '미입력' : '입력 완료'}
            </span>
          </div>

          {location ? (
            // 선택 완료 — 다시 누르면 같은 위치에서 장소 화면이 열린다.
            <button
              type="button"
              onClick={openPlacePicker}
              className="flex w-full items-center gap-3 rounded-md border border-border-default bg-background-card p-3 text-left"
            >
              <Icon name="map-pin" size={20} className="shrink-0 text-icon-brand" />
              <span className="flex min-w-0 flex-1 flex-col gap-1">
                <span className="truncate text-body-lg font-semibold text-text-default">
                  {location.name}
                </span>
                <span className="truncate text-body-md text-text-muted">{location.address}</span>
              </span>
              <Icon name="chevron-right" size={20} className="shrink-0 text-icon-muted" />
            </button>
          ) : (
            <>
              <Button
                variant="secondary"
                label="장소 입력하기"
                leadingIcon="map-pin"
                trailingIcon="arrow-right"
                className="w-full"
                onClick={openPlacePicker}
              />
              <span className="text-label-md text-text-error">
                지도에서 장소를 선택해야 등록할 수 있어요.
              </span>
            </>
          )}
        </div>

        <Button
          variant="primary"
          label={submitting ? '등록 중...' : '등록하기'}
          leadingIcon="plus"
          className="w-full"
          disabled={hasError || submitting}
          onClick={handleSubmit}
        />
      </main>
    </div>
  );
}
