import type { Metadata, Viewport } from "next";

import { appleSplashScreens } from "@/lib/pwa/appleSplash";

import "./globals.css";

export const metadata: Metadata = {
  title: "숨은 맛집",
  description: "구로 근처의 진짜 맛집을 이웃과 나눠요",
  applicationName: "숨은 맛집",
  // 파비콘·홈화면 아이콘은 app 디렉터리 파일 규약이 맡는다(favicon.ico / icon.svg / apple-icon.png).
  appleWebApp: {
    capable: true, // iOS 홈화면에서 Safari UI 없이 뜬다
    title: "숨은 맛집",
    statusBarStyle: "default", // 밝은 배경 위 검은 글자 상태바
    startupImage: [...appleSplashScreens],
  },
  other: {
    // Next 는 표준 `mobile-web-app-capable` 만 넣는다. iOS 16.4 미만은 이 옛 이름만 읽고
    // 없으면 홈화면에서도 Safari UI 를 그대로 띄우므로 함께 넣어 둔다.
    'apple-mobile-web-app-capable': 'yes',
  },
};

export const viewport: Viewport = {
  themeColor: "#FFFDF7", // manifest theme_color 와 같은 값 = 상단 네비 색
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
