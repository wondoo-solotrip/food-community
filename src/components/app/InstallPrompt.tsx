'use client';

import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';

import { Icon } from '@/components/foundation/Icon';
import type { IconName } from '@/components/foundation/Icon';
import { BottomSheet } from '@/components/ui/BottomSheet';
import { Button } from '@/components/ui/Button';
import { IconButton } from '@/components/ui/IconButton';

/**
 * 하단 설치 유도 띠 + iOS 안내 시트.
 *
 * 앱 셸 전용 1회성 컴포넌트다. 디자인 시스템(`components/ui/`)에 넣지 않는다 —
 * 하단 고정 띠는 design.pen 에 없는 형태고, 설치 유도가 끝나면 통째로 지울 코드다.
 * 안의 버튼·아이콘·시트는 전부 기존 컴포넌트를 그대로 쓴다.
 *
 * 플랫폼별로 갈리는 이유:
 * - Chromium 은 `beforeinstallprompt` 를 주는데, 이걸 `preventDefault()` 로 잡아 두면
 *   브라우저 기본 띠가 안 뜨고 우리가 원하는 때에 `prompt()` 로 설치창을 띄울 수 있다.
 *   설치창 자체는 브라우저가 그리며 사용자가 거기서 한 번 더 확인해야 한다(건너뛸 수 없음).
 * - iOS 는 이 이벤트가 아예 없다. 코드로 설치를 띄울 방법이 없어서 `공유 → 홈 화면에 추가`
 *   경로를 시트로 안내하는 것 말고는 방법이 없다.
 */

/** 닫으면 이 기간 동안 다시 띄우지 않는다. Chrome 이 자체 설치 띠에 쓰는 값과 맞췄다. */
const DISMISS_DAYS = 90;
const STORAGE_KEY = 'install-prompt:dismissed-at';
/** 진입하자마자 띄우면 거슬려서 한 박자 늦춘다. */
const SHOW_DELAY_MS = 3000;
/** 띠 높이. 본문/하단 내비가 이만큼 자리를 비우도록 CSS 변수로 내보낸다. */
const BAR_HEIGHT = 72;
const BAR_HEIGHT_VAR = '--install-bar-h';

type InstallOutcome = 'accepted' | 'dismissed';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: InstallOutcome }>;
}

/** 'hidden' 은 렌더 안 함, 'bar' 는 띠만, 'guide' 는 띠 + iOS 안내 시트. */
type Phase = 'hidden' | 'bar' | 'guide';
type Platform = 'ios' | 'chromium';

/** iPadOS 는 데스크톱 UA(Macintosh)를 쓰므로 터치 지원 여부로 한 번 더 거른다. */
function detectIos(): boolean {
  const ua = navigator.userAgent;
  return /iPad|iPhone|iPod/.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1);
}

/** 이미 홈화면 앱으로 실행 중이면 유도할 이유가 없다. `navigator.standalone` 은 iOS 전용. */
function isStandalone(): boolean {
  const iosStandalone = (navigator as Navigator & { standalone?: boolean }).standalone;
  return window.matchMedia('(display-mode: standalone)').matches || iosStandalone === true;
}

/** localStorage 가 막힌 환경(프라이빗 모드 등)에서는 그냥 띄운다. 저장 실패도 무시한다. */
function dismissedRecently(): boolean {
  try {
    const at = Number(window.localStorage.getItem(STORAGE_KEY));
    return Number.isFinite(at) && at > 0 && Date.now() - at < DISMISS_DAYS * 24 * 60 * 60 * 1000;
  } catch {
    return false;
  }
}

function rememberDismissal(): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, String(Date.now()));
  } catch {
    // 저장 못 해도 이번 세션에서 닫히기만 하면 된다.
  }
}

/** iOS 안내 3단계 — Safari 하단 공유 버튼에서 시작한다. */
const IOS_STEPS: { icon: IconName; text: string }[] = [
  { icon: 'share', text: '화면 아래 공유 버튼을 누르세요' },
  { icon: 'plus', text: '목록에서 «홈 화면에 추가»를 고르세요' },
  { icon: 'check', text: '오른쪽 위 «추가»를 누르면 끝이에요' },
];

export function InstallPrompt() {
  const [phase, setPhase] = useState<Phase>('hidden');
  const [platform, setPlatform] = useState<Platform | null>(null);
  const deferred = useRef<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    if (isStandalone() || dismissedRecently()) return;

    let timer: number | undefined;
    const reveal = (kind: Platform) => {
      setPlatform(kind);
      timer = window.setTimeout(() => setPhase('bar'), SHOW_DELAY_MS);
    };

    // iOS 는 신호를 주는 이벤트가 없어서 기기 판별만으로 띄운다.
    if (detectIos()) reveal('ios');

    // Chromium 은 설치 가능할 때만 이벤트를 준다. 안 오면 띠도 안 띄운다.
    const onBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      deferred.current = event as BeforeInstallPromptEvent;
      reveal('chromium');
    };
    const onInstalled = () => {
      rememberDismissal();
      setPhase('hidden');
    };

    window.addEventListener('beforeinstallprompt', onBeforeInstallPrompt);
    window.addEventListener('appinstalled', onInstalled);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener('beforeinstallprompt', onBeforeInstallPrompt);
      window.removeEventListener('appinstalled', onInstalled);
    };
  }, []);

  // 띠가 떠 있는 동안만 자리를 비운다. body 패딩과 하단 내비 offset 이 이 값을 읽는다.
  useEffect(() => {
    const root = document.documentElement;
    if (phase === 'hidden') {
      root.style.removeProperty(BAR_HEIGHT_VAR);
      return;
    }
    root.style.setProperty(BAR_HEIGHT_VAR, `${BAR_HEIGHT}px`);
    return () => {
      root.style.removeProperty(BAR_HEIGHT_VAR);
    };
  }, [phase]);

  const dismiss = useCallback(() => {
    rememberDismissal();
    setPhase('hidden');
  }, []);

  const handleInstall = useCallback(async () => {
    if (platform === 'ios') {
      setPhase('guide');
      return;
    }

    const event = deferred.current;
    if (!event) return;
    deferred.current = null; // 이벤트는 1회용이라 두 번 못 쓴다.

    await event.prompt();
    const { outcome } = await event.userChoice;
    // 거절했으면 다시 조르지 않는다. 수락했으면 appinstalled 가 정리한다.
    if (outcome === 'dismissed') rememberDismissal();
    setPhase('hidden');
  }, [platform]);

  if (phase === 'hidden') return null;

  return (
    <>
      <div
        className="fixed inset-x-0 bottom-0 z-20 border-t border-border-default bg-background-card"
        style={{ height: BAR_HEIGHT }}
      >
        {/* 본문과 같은 max-w-7xl 제한 — 배경/보더만 풀블리드 */}
        <div className="mx-auto flex h-full w-full max-w-7xl items-center gap-3 px-5">
          <Image
            src="/icons/icon-192.png"
            alt=""
            width={40}
            height={40}
            className="shrink-0 rounded-lg border border-border-default"
          />
          <div className="flex min-w-0 flex-1 flex-col">
            <span className="text-label-lg text-text-default">홈 화면에 추가하기</span>
            <span className="truncate text-label-md text-text-muted">
              주소창 없이 앱처럼 바로 열려요
            </span>
          </div>
          <Button size="sm" label="설치" onClick={handleInstall} />
          <IconButton variant="ghost" icon="close" aria-label="설치 안내 닫기" onClick={dismiss} />
        </div>
      </div>

      {phase === 'guide' && (
        // BottomSheet 는 스토리북용으로 컨테이너 안 absolute 배치라, 실제 오버레이는 여기서 만든다.
        <div className="fixed inset-0 z-30">
          <BottomSheet
            className="h-full"
            title="홈 화면에 추가하기"
            description="iPhone 은 브라우저 메뉴에서 직접 추가해야 해요."
            onClose={() => setPhase('bar')}
          >
            <ol className="flex flex-col gap-3">
              {IOS_STEPS.map(({ icon, text }, index) => (
                <li key={icon} className="flex items-center gap-3">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-background-brand-subtle text-label-lg text-text-brand">
                    {index + 1}
                  </span>
                  <Icon name={icon} size={20} className="shrink-0 text-icon-brand" />
                  <span className="text-body-md text-text-default">{text}</span>
                </li>
              ))}
            </ol>
            <Button label="알겠어요" className="w-full" onClick={dismiss} />
          </BottomSheet>
        </div>
      )}
    </>
  );
}
