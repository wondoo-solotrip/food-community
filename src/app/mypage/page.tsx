'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { AppBottomNav } from '@/components/app/AppBottomNav';
import { AppTopNav } from '@/components/app/AppTopNav';
import { Icon } from '@/components/foundation/Icon';
import { Typography } from '@/components/foundation/Typography';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Empty } from '@/components/ui/Empty';
import { IconButton } from '@/components/ui/IconButton';
import { Modal } from '@/components/ui/Modal';
import { Skeleton } from '@/components/ui/Skeleton';
import { TextField } from '@/components/ui/TextField';
import { Toast } from '@/components/ui/Toast';
import { useSession } from '@/hooks/useSession';
import { apiFetch } from '@/lib/api/client';
import type { Place } from '@/lib/places';
import type { Profile } from '@/lib/profile';

/** design.pen `05 My Page` — 프로필 요약 + 프로필 설정 + 내가 쓴 글 목록. */
export default function MyPage() {
  const router = useRouter();
  const { session, loading, refresh, signOut } = useSession();
  /** null = 아직 편집하지 않음 → 세션에서 온 표시 이름을 그대로 보여준다. */
  const [nicknameInput, setNicknameInput] = useState<string | null>(null);
  /** 저장 전까지는 브라우저 미리보기만 보여주고, 업로드는 저장 시 BFF 가 처리한다. */
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const previewUrlRef = useRef<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [places, setPlaces] = useState<Place[] | null>(null);
  /** 삭제 확인 모달의 대상 글. null 이면 모달을 닫는다. */
  const [deleteTarget, setDeleteTarget] = useState<Place | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const user = session?.user ?? null;
  const profile = session?.profile ?? null;
  const displayName = profile?.nickname ?? user?.name ?? user?.email?.split('@')[0] ?? '';
  const nickname = nicknameInput ?? displayName;
  const avatarUrl = previewUrl ?? profile?.imageUrl ?? null;

  // 미로그인 사용자는 로그인 후 다시 이 페이지로 돌아온다.
  useEffect(() => {
    if (!loading && !user) router.replace('/login?next=/mypage');
  }, [loading, user, router]);

  useEffect(() => {
    if (!user) return;
    apiFetch<{ places: Place[] }>('/api/places?mine=true')
      .then(({ places }) => setPlaces(places))
      .catch(() => setPlaces([]));
  }, [user]);

  // 미리보기 objectURL 은 파일이 바뀌거나 화면을 떠날 때 해제한다.
  useEffect(
    () => () => {
      if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
    },
    [],
  );

  const selectImage = (file: File | null) => {
    if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
    previewUrlRef.current = file ? URL.createObjectURL(file) : null;
    setImageFile(file);
    setPreviewUrl(previewUrlRef.current);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // 이미지가 있으면 multipart, 없으면 기존처럼 JSON 으로 보낸다.
      const body = imageFile ? new FormData() : null;
      if (body) {
        body.append('nickname', nickname);
        body.append('image', imageFile!);
      }

      await apiFetch<{ profile: Profile }>('/api/profile', {
        method: 'PATCH',
        body: body ?? JSON.stringify({ nickname }),
      });
      await refresh();
      setNicknameInput(null); // 저장 후에는 서버가 돌려준 값을 그대로 보여준다.
      selectImage(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      setToast({ type: 'success', message: '프로필을 저장했어요.' });
    } catch (cause) {
      setToast({
        type: 'error',
        message: cause instanceof Error ? cause.message : '프로필을 저장하지 못했어요.',
      });
    } finally {
      setSaving(false);
    }
  };

  /** 소프트 삭제 — 서버가 `deleted_at` 만 찍으므로 목록에서 빼주면 화면 상태는 맞는다. */
  const handleDelete = async () => {
    if (!deleteTarget || deleting) return;

    setDeleting(true);
    try {
      await apiFetch<{ id: string }>(`/api/places/${deleteTarget.id}`, { method: 'DELETE' });
      setPlaces((current) => current?.filter((place) => place.id !== deleteTarget.id) ?? current);
      setDeleteTarget(null);
      setToast({ type: 'success', message: '맛집 글을 삭제했어요.' });
    } catch (cause) {
      setToast({
        type: 'error',
        message: cause instanceof Error ? cause.message : '맛집 글을 삭제하지 못했어요.',
      });
    } finally {
      setDeleting(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      router.replace('/login');
    } catch {
      setToast({ type: 'error', message: '로그아웃하지 못했어요.' });
    }
  };

  return (
    <div className="flex min-h-dvh flex-1 flex-col bg-background-screen">
      <AppTopNav
        title="마이 페이지"
        leftIcon="chevron-left"
        leftIconLabel="뒤로 가기"
        leftHref="/"
        rightIcon="settings"
        rightIconTone="default"
        rightIconLabel="설정"
      />

      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-5 px-5 pt-4 pb-5">
        {toast && (
          <Toast
            type={toast.type}
            message={toast.message}
            className="sm:w-full!"
            onDismiss={() => setToast(null)}
          />
        )}

        {/* Profile Summary */}
        <div className="flex items-center gap-4 rounded-lg border border-border-default bg-background-card p-4">
          {loading ? (
            <>
              <Skeleton type="circle" diameter={72} />
              <div className="flex flex-1 flex-col gap-2">
                <Skeleton type="text" lines={2} />
              </div>
            </>
          ) : (
            <>
              <div
                className="flex size-[72px] shrink-0 items-center justify-center rounded-full border border-border-brand bg-background-brand-subtle bg-cover bg-center"
                style={avatarUrl ? { backgroundImage: `url(${avatarUrl})` } : undefined}
              >
                {!avatarUrl && (
                  <Typography variant="display-sm" as="span" className="text-text-brand">
                    {displayName.charAt(0)}
                  </Typography>
                )}
              </div>
              <div className="flex flex-1 flex-col gap-2">
                <Typography variant="heading-lg" as="h1">
                  {displayName}
                </Typography>
                <Typography variant="body-md" className="text-text-muted">
                  {places === null
                    ? user?.email ?? ''
                    : `${places.length}개의 숨은 맛집을 기록했어요.`}
                </Typography>
              </div>
            </>
          )}
        </div>

        {/* Profile Edit Section */}
        <section className="flex flex-col gap-3">
          {/* design.pen: 16px bold — heading-sm(600)에서 굵기만 bold로 상향 */}
          <Typography variant="heading-sm" as="h2" className="font-bold">
            프로필 설정
          </Typography>
          {/* 프로필 이미지 — 파일 선택은 숨긴 input, 트리거는 DS Button(secondary) */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="hidden"
            onChange={(event) => selectImage(event.target.files?.[0] ?? null)}
          />
          <Button
            variant="secondary"
            label={imageFile ? `선택됨 · ${imageFile.name}` : '프로필 이미지 변경'}
            leadingIcon="image"
            className="w-full"
            disabled={loading || !user || saving}
            onClick={() => fileInputRef.current?.click()}
          />
          <TextField
            label="닉네임"
            leadingIcon="user"
            value={nickname}
            onChange={(event) => setNicknameInput(event.target.value)}
            helperText="맛집 글과 댓글에 표시되는 이름입니다."
            disabled={loading || !user}
          />
          <Button
            variant="primary"
            label="프로필 저장"
            className="w-full"
            loading={saving}
            disabled={loading || !user || !nickname.trim()}
            onClick={handleSave}
          />
        </section>

        {/* My Posts Section */}
        <section className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <Typography variant="heading-sm" as="h2" className="font-bold">
              내가 쓴 글
            </Typography>
            <Badge variant="neutral" label={`${places?.length ?? 0}개`} />
          </div>
          {places === null ? (
            <Skeleton type="rectangle" height={72} />
          ) : places.length === 0 ? (
            <Empty
              visualIcon="utensils"
              title="아직 등록한 맛집이 없어요"
              description="첫 번째 숨은 맛집을 이웃과 나눠보세요."
              primaryLabel="맛집 등록하기"
              onPrimaryClick={() => router.push('/register')}
            />
          ) : (
            <ul className="flex flex-col">
              {places.map((place) => (
                <li
                  key={place.id}
                  className="flex items-center gap-1 border-b border-border-default"
                >
                  <Link href={`/posts/${place.id}`} className="flex flex-1 items-center gap-3 py-2">
                    <div
                      className="size-[72px] shrink-0 rounded-lg bg-background-media-placeholder bg-cover bg-center"
                      style={
                        place.images[0]
                          ? { backgroundImage: `url(${place.images[0].url})` }
                          : undefined
                      }
                    />
                    <div className="flex flex-1 flex-col gap-2">
                      <span className="text-label-lg text-text-default">{place.title}</span>
                      <div className="flex items-center gap-1 text-text-muted">
                        <Icon name="map-pin" size={16} className="text-icon-muted" />
                        {/* 위치가 비어 있는 건 지도 연동 이전에 등록된 글뿐이다. */}
                        <span className="text-label-md">
                          {place.location?.address ?? '위치 미등록'}
                        </span>
                      </div>
                    </div>
                  </Link>
                  {/* 소프트 삭제 진입점 — 확인 모달을 거쳐 DELETE /api/places/:id 를 호출한다. */}
                  <IconButton
                    variant="ghost"
                    icon="close"
                    aria-label={`${place.title} 삭제`}
                    disabled={deleting}
                    onClick={() => setDeleteTarget(place)}
                  />
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Sign Out — 로그인 기능 추가로 생긴 액션. DS Button secondary 사용. */}
        <Button
          variant="secondary"
          label="로그아웃"
          leadingIcon="logout"
          className="w-full"
          disabled={loading || !user}
          onClick={handleSignOut}
        />
      </main>

      <AppBottomNav selectedIndex={1} />

      {/* 삭제 확인 — DS Modal 은 relative 컨테이너 기준이라 화면 전체 오버레이로 감싼다. */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex">
          <Modal
            title="이 맛집 글을 삭제할까요?"
            description={`'${deleteTarget.title}' 글이 목록에서 사라집니다.`}
            className="h-full px-5"
            primaryLabel={deleting ? '삭제 중…' : '삭제'}
            onPrimaryClick={handleDelete}
            secondaryLabel="취소"
            onSecondaryClick={() => setDeleteTarget(null)}
            onClose={() => {
              if (!deleting) setDeleteTarget(null);
            }}
          />
        </div>
      )}
    </div>
  );
}
