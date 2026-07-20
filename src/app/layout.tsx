import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "숨은 맛집",
  description: "구로 근처의 진짜 맛집을 이웃과 나눠요",
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
