/**
 * iOS 홈화면 스플래시 목록 — `scripts/generate-pwa-assets.py` 가 생성한다. 직접 고치지 말 것.
 *
 * iOS 는 Android 처럼 manifest 로 스플래시를 만들어 주지 않아서, 기기 해상도마다
 * 이미지와 media query 를 하나씩 붙여 줘야 한다. 목록에 없는 기기는 배경색만 보인다.
 */
export const appleSplashScreens = [
  // iPhone SE (1st) · 5s · portrait
  { url: '/splash/apple-splash-640x1136.png', media: '(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)' },
  // iPhone SE (1st) · 5s · landscape
  { url: '/splash/apple-splash-1136x640.png', media: '(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)' },
  // iPhone SE (2nd·3rd) · 8 · 7 · 6s · portrait
  { url: '/splash/apple-splash-750x1334.png', media: '(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)' },
  // iPhone SE (2nd·3rd) · 8 · 7 · 6s · landscape
  { url: '/splash/apple-splash-1334x750.png', media: '(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)' },
  // iPhone 8 Plus · 7 Plus · 6s Plus · portrait
  { url: '/splash/apple-splash-1242x2208.png', media: '(device-width: 414px) and (device-height: 736px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)' },
  // iPhone 8 Plus · 7 Plus · 6s Plus · landscape
  { url: '/splash/apple-splash-2208x1242.png', media: '(device-width: 414px) and (device-height: 736px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)' },
  // iPhone X · XS · 11 Pro · 12 mini · 13 mini · portrait
  { url: '/splash/apple-splash-1125x2436.png', media: '(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)' },
  // iPhone X · XS · 11 Pro · 12 mini · 13 mini · landscape
  { url: '/splash/apple-splash-2436x1125.png', media: '(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)' },
  // iPhone XR · 11 · portrait
  { url: '/splash/apple-splash-828x1792.png', media: '(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)' },
  // iPhone XR · 11 · landscape
  { url: '/splash/apple-splash-1792x828.png', media: '(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)' },
  // iPhone XS Max · 11 Pro Max · portrait
  { url: '/splash/apple-splash-1242x2688.png', media: '(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)' },
  // iPhone XS Max · 11 Pro Max · landscape
  { url: '/splash/apple-splash-2688x1242.png', media: '(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)' },
  // iPhone 12 · 12 Pro · 13 · 13 Pro · 14 · portrait
  { url: '/splash/apple-splash-1170x2532.png', media: '(device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)' },
  // iPhone 12 · 12 Pro · 13 · 13 Pro · 14 · landscape
  { url: '/splash/apple-splash-2532x1170.png', media: '(device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)' },
  // iPhone 12 Pro Max · 13 Pro Max · 14 Plus · portrait
  { url: '/splash/apple-splash-1284x2778.png', media: '(device-width: 428px) and (device-height: 926px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)' },
  // iPhone 12 Pro Max · 13 Pro Max · 14 Plus · landscape
  { url: '/splash/apple-splash-2778x1284.png', media: '(device-width: 428px) and (device-height: 926px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)' },
  // iPhone 14 Pro · 15 · 15 Pro · 16 · portrait
  { url: '/splash/apple-splash-1179x2556.png', media: '(device-width: 393px) and (device-height: 852px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)' },
  // iPhone 14 Pro · 15 · 15 Pro · 16 · landscape
  { url: '/splash/apple-splash-2556x1179.png', media: '(device-width: 393px) and (device-height: 852px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)' },
  // iPhone 14 Pro Max · 15 Plus · 15 Pro Max · 16 Plus · portrait
  { url: '/splash/apple-splash-1290x2796.png', media: '(device-width: 430px) and (device-height: 932px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)' },
  // iPhone 14 Pro Max · 15 Plus · 15 Pro Max · 16 Plus · landscape
  { url: '/splash/apple-splash-2796x1290.png', media: '(device-width: 430px) and (device-height: 932px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)' },
  // iPhone 16 Pro · portrait
  { url: '/splash/apple-splash-1206x2622.png', media: '(device-width: 402px) and (device-height: 874px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)' },
  // iPhone 16 Pro · landscape
  { url: '/splash/apple-splash-2622x1206.png', media: '(device-width: 402px) and (device-height: 874px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)' },
  // iPhone 16 Pro Max · portrait
  { url: '/splash/apple-splash-1320x2868.png', media: '(device-width: 440px) and (device-height: 956px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)' },
  // iPhone 16 Pro Max · landscape
  { url: '/splash/apple-splash-2868x1320.png', media: '(device-width: 440px) and (device-height: 956px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)' },
  // iPad mini (6th) · portrait
  { url: '/splash/apple-splash-1488x2266.png', media: '(device-width: 744px) and (device-height: 1133px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)' },
  // iPad mini (6th) · landscape
  { url: '/splash/apple-splash-2266x1488.png', media: '(device-width: 744px) and (device-height: 1133px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)' },
  // iPad 9.7 · iPad mini (5th) · portrait
  { url: '/splash/apple-splash-1536x2048.png', media: '(device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)' },
  // iPad 9.7 · iPad mini (5th) · landscape
  { url: '/splash/apple-splash-2048x1536.png', media: '(device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)' },
  // iPad 10.2 · portrait
  { url: '/splash/apple-splash-1620x2160.png', media: '(device-width: 810px) and (device-height: 1080px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)' },
  // iPad 10.2 · landscape
  { url: '/splash/apple-splash-2160x1620.png', media: '(device-width: 810px) and (device-height: 1080px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)' },
  // iPad Air 10.9 · 11″ · portrait
  { url: '/splash/apple-splash-1640x2360.png', media: '(device-width: 820px) and (device-height: 1180px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)' },
  // iPad Air 10.9 · 11″ · landscape
  { url: '/splash/apple-splash-2360x1640.png', media: '(device-width: 820px) and (device-height: 1180px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)' },
  // iPad Pro 10.5 · portrait
  { url: '/splash/apple-splash-1668x2224.png', media: '(device-width: 834px) and (device-height: 1112px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)' },
  // iPad Pro 10.5 · landscape
  { url: '/splash/apple-splash-2224x1668.png', media: '(device-width: 834px) and (device-height: 1112px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)' },
  // iPad Pro 11″ · portrait
  { url: '/splash/apple-splash-1668x2388.png', media: '(device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)' },
  // iPad Pro 11″ · landscape
  { url: '/splash/apple-splash-2388x1668.png', media: '(device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)' },
  // iPad Pro 12.9″ · portrait
  { url: '/splash/apple-splash-2048x2732.png', media: '(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)' },
  // iPad Pro 12.9″ · landscape
  { url: '/splash/apple-splash-2732x2048.png', media: '(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)' },
  // iPad Pro 13″ (M4) · portrait
  { url: '/splash/apple-splash-2064x2752.png', media: '(device-width: 1032px) and (device-height: 1376px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)' },
  // iPad Pro 13″ (M4) · landscape
  { url: '/splash/apple-splash-2752x2064.png', media: '(device-width: 1032px) and (device-height: 1376px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)' },
] as const;
