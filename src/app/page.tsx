import Link from 'next/link';

import { AppBottomNav } from '@/components/app/AppBottomNav';
import { WriteFab } from '@/components/app/WriteFab';
import { Typography } from '@/components/foundation/Typography';
import { FoodCard } from '@/components/ui/FoodCard';
import { TextField } from '@/components/ui/TextField';
import { popularPosts } from '@/lib/posts';

/** design.pen `01 Main Page` — 모바일 2열 → 태블릿 3열 → 데스크톱 4열(최대 1280px) 카드 그리드. */
export default function MainPage() {
  return (
    <div className="flex min-h-dvh flex-1 flex-col bg-background-screen">
      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 px-5 pt-2 pb-6">
        {/* Main Hero */}
        <div className="flex flex-col gap-3">
          <Typography variant="heading-md" as="h1">
            오늘 뭐 먹을까요?
          </Typography>
          <TextField
            label="검색"
            placeholder="음식, 식당, 레시피 검색"
            leadingIcon="search"
          />
        </div>

        {/* Popular Section */}
        <section className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <Typography variant="heading-md" as="h2">
              인기 게시글
            </Typography>
            <span className="text-label-lg text-text-brand">전체</span>
          </div>

          <div className="grid grid-cols-2 gap-x-3 gap-y-4 md:grid-cols-3 xl:grid-cols-4">
            {popularPosts.map((post) => (
              <Link key={post.id} href={`/posts/${post.id}`} className="flex flex-col">
                <FoodCard
                  className="flex-1"
                  title={post.title}
                  location={post.location}
                  media={
                    post.imageUrl ? (
                      <div
                        className="size-full bg-cover bg-center"
                        style={{ backgroundImage: `url(${post.imageUrl})` }}
                      />
                    ) : (
                      <div className={`size-full ${post.mediaClass}`} />
                    )
                  }
                />
              </Link>
            ))}
          </div>
        </section>

        {/* Floating Write Shortcut — 디자인상 그리드 하단 좌측 정렬 */}
        <div className="self-start">
          <WriteFab />
        </div>
      </main>

      <AppBottomNav selectedIndex={0} />
    </div>
  );
}
