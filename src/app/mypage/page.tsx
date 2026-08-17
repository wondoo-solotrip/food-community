'use client';

import { Suspense, useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

import { AppBottomNav } from '@/components/app/AppBottomNav';
import { AppTopNav } from '@/components/app/AppTopNav';
import { Icon } from '@/components/foundation/Icon';
import { Typography } from '@/components/foundation/Typography';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Empty } from '@/components/ui/Empty';
import { Modal } from '@/components/ui/Modal';
import { Skeleton } from '@/components/ui/Skeleton';
import { TabNavigation } from '@/components/ui/TabNavigation';
import { TextField } from '@/components/ui/TextField';
import { Toast } from '@/components/ui/Toast';
import { useSession } from '@/hooks/useSession';
import { apiFetch } from '@/lib/api/client';
import { formatWon } from '@/lib/eventFormat';
import type { CancellationHistoryItem, PaymentHistoryItem } from '@/lib/payments';
import type { Place } from '@/lib/places';
import type { Profile } from '@/lib/profile';

type MyPageTab = 'posts' | 'payments' | 'cancellations';

const TAB_KEYS: MyPageTab[] = ['posts', 'payments', 'cancellations'];
const TAB_LABELS = ['내가 쓴 글', '결제 내역', '취소 내역'];

/** design.pen `13~15 My Page v1.1` — 프로필 요약(연필 토글) + 활동 탭 3개. */
function MyPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { session, loading, refresh, signOut } = useSession();
  /** null = 아직 편집하지 않음 → 세션에서 온 표시 이름을 그대로 보여준다. */
  const [nicknameInput, setNicknameInput] = useState<string | null>(null);
  /** 저장 전까지는 브라우저 미리보기만 보여주고, 업로드는 저장 시 BFF 가 처리한다. */
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const previewUrlRef = useRef<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  /** 프로필 설정은 닉네임 옆 연필을 눌렀을 때만 펼친다(design.pen 15-2). */
  const [editingProfile, setEditingProfile] = useState(false);
  const [tab, setTab] = useState<MyPageTab>(() => {
    const param = searchParams.get('tab');
    return TAB_KEYS.includes(param as MyPageTab) ? (param as MyPageTab) : 'posts';
  });
  const [places, setPlaces] = useState<Place[] | null>(null);
  /** 삭제 확인 모달의 대상 글. null 이면 모달을 닫는다. */
  const [deleteTarget, setDeleteTarget] = useState<Place | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [saving, setSaving] = useState(false);
  /** 결제 내역은 원장 실데이터(/api/payments)다. null = 아직 읽어오기 전. */
  const [payments, setPayments] = useState<PaymentHistoryItem[] | null>(null);
  /** 결제취소 확인 모달의 대상 결제 건. null 이면 모달을 닫는다. */
  const [cancelTarget, setCancelTarget] = useState<PaymentHistoryItem | null>(null);
  const [cancelling, setCancelling] = useState(false);
  /** 취소 내역은 원장 CANCEL 행 실데이터(/api/payments/cancellations)다. null = 아직 읽어오기 전. */
  const [cancellations, setCancellations] = useState<CancellationHistoryItem[] | null>(null);
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

  // 결제 내역 — 원장 실데이터(취소되지 않은 내 PAYMENT 행). 규칙: .claude/rules/payment.md
  useEffect(() => {
    if (!user) return;
    apiFetch<{ payments: PaymentHistoryItem[] }>('/api/payments')
      .then(({ payments }) => setPayments(payments))
      .catch(() => setPayments([]));
  }, [user]);

  // 취소 내역 — 원장 CANCEL 행 실데이터. 결제취소 직후에도 다시 불러 바로 반영한다.
  const loadCancellations = useCallback(
    () =>
      apiFetch<{ cancellations: CancellationHistoryItem[] }>('/api/payments/cancellations')
        .then(({ cancellations: items }) => setCancellations(items))
        .catch(() => setCancellations([])),
    [],
  );

  useEffect(() => {
    if (!user) return;
    void loadCancellations();
  }, [user, loadCancellations]);

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
      setEditingProfile(false); // 저장이 끝나면 설정 영역을 다시 접는다.
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

  /** 포트원 전액취소(BFF 경유) — 성공하면 원장에서 빠지므로 목록에서도 제거한다. 규칙: .claude/rules/payment.md */
  const handleCancelPayment = async () => {
    if (!cancelTarget || cancelling) return;

    setCancelling(true);
    try {
      await apiFetch<{ transactionKey: string }>(
        `/api/payments/${cancelTarget.transactionKey}/cancel`,
        { method: 'POST' },
      );
      setPayments(
        (current) => current?.filter((payment) => payment.id !== cancelTarget.id) ?? current,
      );
      // 취소 직후 원장 동기화(payment.md)로 CANCEL 행이 이미 기록됐다 — 취소 내역 탭도 바로 갱신한다.
      void loadCancellations();
      setCancelTarget(null);
      setToast({ type: 'success', message: '결제를 취소했어요. 환불까지 3~5일 걸릴 수 있어요.' });
    } catch (cause) {
      setToast({
        type: 'error',
        message: cause instanceof Error ? cause.message : '결제를 취소하지 못했어요.',
      });
    } finally {
      setCancelling(false);
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
                <div className="flex items-center gap-1.5">
                  <Typography variant="heading-lg" as="h1">
                    {displayName}
                  </Typography>
                  {/* 프로필 설정 토글 — design.pen Profile Name Edit Icon Button(24px 안 16px 연필) */}
                  <button
                    type="button"
                    aria-label="프로필 설정"
                    aria-expanded={editingProfile}
                    className="flex size-6 shrink-0 cursor-pointer items-center justify-center rounded-sm"
                    onClick={() => setEditingProfile((open) => !open)}
                  >
                    <Icon name="edit" size={16} className="text-text-muted" />
                  </button>
                </div>
                <Typography variant="body-md" className="text-text-muted">
                  {places === null
                    ? user?.email ?? ''
                    : `${places.length}개의 숨은 맛집을 기록했어요.`}
                </Typography>
              </div>
            </>
          )}
        </div>

        {/* Profile Edit Section — 연필을 눌렀을 때만 보인다. */}
        {editingProfile && (
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
        )}

        {/* My Activity Tabs */}
        <TabNavigation
          items={TAB_LABELS}
          selectedIndex={TAB_KEYS.indexOf(tab)}
          fullWidth
          onSelect={(index) => setTab(TAB_KEYS[index])}
        />

        {/* My Posts Section */}
        {tab === 'posts' && (
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
                    className="flex items-center gap-2 border-b border-border-default"
                  >
                    <Link
                      href={`/posts/${place.id}`}
                      className="flex flex-1 items-center gap-3 py-2"
                    >
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
                    {/* Post Actions — design.pen 32px 버튼 x2. 수정 화면이 아직 없어 연필은 상세로 보낸다. */}
                    <div className="flex items-center gap-0.5">
                      <Link
                        href={`/posts/${place.id}`}
                        aria-label={`${place.title} 수정`}
                        className="flex size-8 shrink-0 items-center justify-center rounded-md"
                      >
                        <Icon name="edit" size={16} className="text-icon-default" />
                      </Link>
                      {/* 소프트 삭제 진입점 — 확인 모달을 거쳐 DELETE /api/places/:id 를 호출한다. */}
                      <button
                        type="button"
                        aria-label={`${place.title} 삭제`}
                        disabled={deleting}
                        className="flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-md disabled:cursor-not-allowed disabled:opacity-[0.72]"
                        onClick={() => setDeleteTarget(place)}
                      >
                        <Icon name="delete" size={16} className="text-icon-error" />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        )}

        {/* Payment History Section */}
        {tab === 'payments' && (
          <section className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <Typography variant="heading-sm" as="h2" className="font-bold">
                결제 내역
              </Typography>
              <span className="text-label-md text-text-muted">{payments?.length ?? 0}건</span>
            </div>
            {payments === null ? (
              <Skeleton type="rectangle" height={120} />
            ) : payments.length === 0 ? (
              <Empty
                visualIcon="calendar"
                title="결제 내역이 없어요"
                description="모임을 결제하면 여기에 표시됩니다."
              />
            ) : (
              <ul className="flex flex-col gap-3">
                {payments.map((payment) => (
                  <li
                    key={payment.id}
                    className="flex flex-col gap-2 rounded-lg border border-border-default bg-background-card p-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-label-md text-text-brand">{payment.dateLabel}</span>
                      <Badge variant="success" label="결제 완료" />
                    </div>
                    <div className="flex items-center gap-2.5">
                      <div
                        className="size-[52px] shrink-0 rounded-md bg-background-media-placeholder bg-cover bg-center"
                        style={{ backgroundImage: `url(${payment.imageUrl})` }}
                      />
                      <div className="flex flex-1 flex-col gap-1.5">
                        <span className="text-label-lg text-text-default">{payment.title}</span>
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-label-md text-text-muted">{payment.place}</span>
                          <span className="text-label-lg font-bold text-text-default">
                            {formatWon(payment.amount)}
                          </span>
                        </div>
                      </div>
                    </div>
                    {/* 결제취소 진입점 — 확인 모달을 거쳐 POST /api/payments/:transactionKey/cancel 을 호출한다. */}
                    <Button
                      variant="destructive"
                      label="결제 취소"
                      className="w-full"
                      disabled={cancelling}
                      onClick={() => setCancelTarget(payment)}
                    />
                  </li>
                ))}
              </ul>
            )}
          </section>
        )}

        {/* Cancellation History Section */}
        {tab === 'cancellations' && (
          <section className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <Typography variant="heading-sm" as="h2" className="font-bold">
                취소 내역
              </Typography>
              <span className="text-label-md text-text-muted">{cancellations?.length ?? 0}건</span>
            </div>
            {cancellations === null ? (
              <Skeleton type="rectangle" height={120} />
            ) : cancellations.length === 0 ? (
              <Empty
                visualIcon="refresh"
                title="취소 내역이 없어요"
                description="결제를 취소하면 여기에 표시됩니다."
              />
            ) : (
              <ul className="flex flex-col gap-3">
                {cancellations.map((cancellation) => (
                  <li
                    key={cancellation.id}
                    className="flex flex-col gap-2 rounded-lg border border-border-default bg-background-card p-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-label-md text-text-brand">
                        {cancellation.dateLabel}
                      </span>
                      <Badge variant="error" label="취소 완료" />
                    </div>
                    <div className="flex items-center gap-2.5">
                      <div
                        className="size-[52px] shrink-0 rounded-md bg-background-media-placeholder bg-cover bg-center"
                        style={{ backgroundImage: `url(${cancellation.imageUrl})` }}
                      />
                      <div className="flex flex-1 flex-col gap-1.5">
                        <span className="text-label-lg text-text-default">
                          {cancellation.title}
                        </span>
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-label-md text-text-muted">
                            {cancellation.method}
                          </span>
                          <span className="text-label-lg font-bold text-text-default">
                            {formatWon(cancellation.refundAmount)} 환불
                          </span>
                        </div>
                      </div>
                    </div>
                    {/* Refund Summary */}
                    <dl className="flex flex-col gap-2 rounded-md bg-background-surface p-3">
                      {[
                        { label: '취소 접수', value: cancellation.requestedAtLabel },
                        {
                          label: '환불 금액',
                          value: formatWon(cancellation.refundAmount),
                          emphasized: true,
                        },
                        { label: '환불 수단', value: cancellation.method },
                      ].map(({ label, value, emphasized }) => (
                        <div key={label} className="flex items-center justify-between gap-4">
                          <dt className="shrink-0 text-label-md text-text-muted">{label}</dt>
                          <dd
                            className={`text-label-md text-text-default ${emphasized ? 'font-semibold' : ''}`}
                          >
                            {value}
                          </dd>
                        </div>
                      ))}
                    </dl>
                    <p className="text-label-md text-text-muted">
                      환불은 결제 수단에 따라 영업일 기준 3~5일 소요될 수 있어요.
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </section>
        )}

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

      {/* 결제취소 확인 — 삭제 확인과 같은 오버레이 패턴. 취소는 전액 환불이라 확인을 한 번 거친다. */}
      {cancelTarget && (
        <div className="fixed inset-0 z-50 flex">
          <Modal
            title="이 결제를 취소할까요?"
            description={`'${cancelTarget.title}' 결제 금액 ${formatWon(cancelTarget.amount)}이 전액 환불됩니다.`}
            className="h-full px-5"
            primaryLabel={cancelling ? '취소 중…' : '결제 취소'}
            onPrimaryClick={handleCancelPayment}
            secondaryLabel="닫기"
            onSecondaryClick={() => setCancelTarget(null)}
            onClose={() => {
              if (!cancelling) setCancelTarget(null);
            }}
          />
        </div>
      )}

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

/** useSearchParams 는 Suspense 경계가 필요하다 — register/place 와 같은 패턴. */
export default function MyPage() {
  return (
    <Suspense fallback={<div className="min-h-dvh bg-background-screen" />}>
      <MyPageContent />
    </Suspense>
  );
}
