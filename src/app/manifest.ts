import type { MetadataRoute } from 'next';

/**
 * `/manifest.webmanifest` — 홈화면 설치 정보.
 *
 * - `background_color` 는 앱 화면색(`--color-background-screen` = neutral-50)과 같은 값이다.
 *   Android 는 이 색 위에 512 아이콘을 얹어 스플래시를 자동으로 만들기 때문에, 색이 어긋나면
 *   스플래시 → 첫 화면에서 배경이 한 번 튄다. iOS 는 자동 생성이 없어 `src/lib/pwa/appleSplash.ts`
 *   의 이미지 목록을 layout 에서 따로 붙인다.
 * - `theme_color` 도 같은 값이다. 상단 네비게이션이 `background-card`(= neutral-50) 라서
 *   주소창/상태바까지 같은 색으로 이어진다.
 * - 아이콘은 `scripts/generate-pwa-assets.py` 가 logo.svg 에서 뽑는다.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    id: '/',
    name: '숨은 맛집',
    short_name: '숨은 맛집',
    description: '구로 근처의 진짜 맛집을 이웃과 나눠요',
    lang: 'ko',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    background_color: '#FFFDF7',
    theme_color: '#FFFDF7',
    icons: [
      { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
      // maskable 은 Android 가 원·스쿼클 등으로 잘라내므로 여백을 더 준 별도 이미지다.
      { src: '/icons/icon-maskable-192.png', sizes: '192x192', type: 'image/png', purpose: 'maskable' },
      { src: '/icons/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  };
}
