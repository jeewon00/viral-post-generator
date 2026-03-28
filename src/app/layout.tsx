import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "생성 서비스 - AI 바이럴 글 생성기",
  description:
    "타겟 유저 정보를 입력하면 AI가 커뮤니티에 올리기 좋은 자연스러운 바이럴 글을 자동으로 생성해드립니다.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${geist.variable} antialiased`}>
      <body className="min-h-screen font-sans">{children}</body>
    </html>
  );
}
