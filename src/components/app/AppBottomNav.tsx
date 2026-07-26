'use client';

import { useRouter } from 'next/navigation';

import { BottomNavigation } from '@/components/ui/BottomNavigation';

const NAV_ITEMS = [
  { icon: 'home', label: '홈', href: '/' },
  { icon: 'user', label: '내 정보', href: '/mypage' },
] as const;

export interface AppBottomNavProps {
  selectedIndex: number;
}

/** design.pen Bottom Navigation 인스턴스(홈 / 내 정보 2탭)에 라우팅을 연결한 앱 셸 래퍼입니다. */
export function AppBottomNav({ selectedIndex }: AppBottomNavProps) {
  const router = useRouter();

  return (
    // bottom offset — 설치 유도 띠가 떠 있으면 그 위로 올라선다(InstallPrompt 가 변수를 채운다).
    <footer className="sticky bottom-[var(--install-bar-h,0px)] z-10 border-t border-border-default bg-background-card">
      {/* 배경/보더는 풀블리드, 탭 영역은 본문과 동일한 max-w-7xl 제한 */}
      <BottomNavigation
        className="mx-auto max-w-7xl border-t-0"
        items={NAV_ITEMS.map(({ icon, label }) => ({ icon, label }))}
        selectedIndex={selectedIndex}
        onSelect={(index) => router.push(NAV_ITEMS[index].href)}
      />
    </footer>
  );
}
