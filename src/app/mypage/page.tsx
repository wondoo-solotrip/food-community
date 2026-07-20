'use client';

import { useState } from 'react';
import Link from 'next/link';

import { AppBottomNav } from '@/components/app/AppBottomNav';
import { AppTopNav } from '@/components/app/AppTopNav';
import { Icon } from '@/components/foundation/Icon';
import { Typography } from '@/components/foundation/Typography';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { TextField } from '@/components/ui/TextField';
import { myPosts } from '@/lib/posts';

/** design.pen `05 My Page` — 프로필 요약 + 프로필 설정 + 내가 쓴 글 목록. */
export default function MyPage() {
  const [nickname, setNickname] = useState('구로 드라이버');

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
        {/* Profile Summary */}
        <div className="flex items-center gap-4 rounded-lg border border-border-default bg-background-card p-4">
          <div className="flex size-[72px] shrink-0 items-center justify-center rounded-full border border-border-brand bg-background-brand-subtle">
            <Typography variant="display-sm" as="span" className="text-text-brand">
              구
            </Typography>
          </div>
          <div className="flex flex-1 flex-col gap-2">
            <Typography variant="heading-lg" as="h1">
              {nickname}
            </Typography>
            <Typography variant="body-md" className="text-text-muted">
              6개의 숨은 맛집을 기록했어요.
            </Typography>
          </div>
        </div>

        {/* Profile Edit Section */}
        <section className="flex flex-col gap-3">
          {/* design.pen: 16px bold — heading-sm(600)에서 굵기만 bold로 상향 */}
          <Typography variant="heading-sm" as="h2" className="font-bold">
            프로필 설정
          </Typography>
          <TextField
            label="닉네임"
            leadingIcon="user"
            value={nickname}
            onChange={(event) => setNickname(event.target.value)}
            helperText="맛집 글과 댓글에 표시되는 이름입니다."
          />
          <Button variant="primary" label="프로필 저장" className="w-full" />
        </section>

        {/* My Posts Section */}
        <section className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <Typography variant="heading-sm" as="h2" className="font-bold">
              내가 쓴 글
            </Typography>
            <Badge variant="neutral" label="6개" />
          </div>
          <ul className="flex flex-col">
            {myPosts.map((post) => (
              <li key={post.id}>
                <Link
                  href={`/posts/${post.id}`}
                  className="flex items-center gap-3 border-b border-border-default py-2"
                >
                  <div
                    className="size-[72px] shrink-0 rounded-lg bg-background-media-placeholder bg-cover bg-center"
                    style={{ backgroundImage: `url(${post.imageUrl})` }}
                  />
                  <div className="flex flex-1 flex-col gap-2">
                    <span className="text-label-lg text-text-default">{post.title}</span>
                    <div className="flex items-center gap-1 text-text-muted">
                      <Icon name="map-pin" size={16} className="text-icon-muted" />
                      <span className="text-label-md">{post.location}</span>
                    </div>
                  </div>
                  <Icon name="chevron-right" size={20} className="shrink-0 text-icon-muted" />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </main>

      <AppBottomNav selectedIndex={1} />
    </div>
  );
}
