'use client';

import { useRouter } from 'next/navigation';

import { IconButton } from '@/components/ui/IconButton';

/** design.pen `Floating Write Shortcut` — 게시글 등록으로 이동하는 원형 브랜드 버튼입니다. */
export function WriteFab() {
  const router = useRouter();

  return (
    <IconButton
      variant="circle-brand"
      icon="plus"
      aria-label="게시글 등록"
      onClick={() => router.push('/register')}
    />
  );
}
