import { notFound } from 'next/navigation';

import { AppTopNav } from '@/components/app/AppTopNav';
import { Icon } from '@/components/foundation/Icon';
import { Typography } from '@/components/foundation/Typography';
import { findPost } from '@/lib/posts';

interface DetailPageProps {
  params: Promise<{ id: string }>;
}

/** design.pen `02 Detail Page` — 히어로 미디어 + 그라데이션 캡션 + 본문. */
export default async function DetailPage({ params }: DetailPageProps) {
  const { id } = await params;
  const post = findPost(id);
  if (!post) notFound();

  const heroUrl = post.detailImageUrl ?? post.imageUrl;

  return (
    <div className="flex min-h-dvh flex-1 flex-col bg-background-screen">
      <AppTopNav title="상세 페이지" leftIcon="chevron-left" leftIconLabel="뒤로 가기" leftHref="/" />

      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col">
        {/* Detail Media Block — 하단 그라데이션 오버레이 + 캡션 */}
        <div
          className={`relative h-[452px] w-full overflow-hidden bg-background-media-placeholder ${post.mediaClass ?? ''}`}
          style={
            heroUrl ? { backgroundImage: `url(${heroUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' } : undefined
          }
        >
          <div className="absolute inset-x-0 bottom-0 h-40 bg-linear-to-b from-overlay-photo-bottom-start via-overlay-photo-bottom-mid to-overlay-photo-bottom-end" />
          <div className="absolute inset-x-5 bottom-8 flex flex-col gap-3">
            <Typography variant="heading-md" as="h1" className="text-text-inverse">
              {post.title}
            </Typography>
            <div className="flex items-center gap-1.5 text-alpha-white-60">
              <Icon name="map-pin" size={16} />
              <span className="text-body-lg">{post.location}</span>
            </div>
          </div>
        </div>

        {/* Detail Body */}
        <div className="flex flex-col gap-6 px-5 pt-6 pb-8">
          <Typography variant="heading-md" as="h2">
            {post.bodyTitle}
          </Typography>
          <Typography variant="body-lg" className="max-w-2xl text-text-muted">
            {post.bodyText}
          </Typography>
        </div>
      </main>
    </div>
  );
}
