import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { NextIntlClientProvider, useMessages } from 'next-intl';
import { notFound } from 'next/navigation';
import { LanguageSwitcher } from '@/components/common/LanguageSwitcher';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "아이부키(ibookee) | 사회주택 통합 플랫폼",
  description: "비전·프로젝트·커뮤니티·운영을 하나로 묶은 아이부키 통합 플랫폼. 사회주택 모델, 입주민 커뮤니티, 관리자 시스템까지 한 번에!",
  openGraph: {
    title: "아이부키(ibookee) | 사회주택 통합 플랫폼",
    description: "비전·프로젝트·커뮤니티·운영을 하나로 묶은 아이부키 통합 플랫폼. 사회주택 모델, 입주민 커뮤니티, 관리자 시스템까지 한 번에!",
    url: "https://ibookee.com",
    siteName: "아이부키(ibookee)",
    images: [
      {
        url: "/public/file.svg", // 실제 대표 이미지로 교체 필요
        width: 1200,
        height: 630,
        alt: "아이부키 대표 이미지"
      }
    ],
    type: "website",
    locale: "ko_KR"
  },
  twitter: {
    card: "summary_large_image",
    title: "아이부키(ibookee) | 사회주택 통합 플랫폼",
    description: "비전·프로젝트·커뮤니티·운영을 하나로 묶은 아이부키 통합 플랫폼. 사회주택 모델, 입주민 커뮤니티, 관리자 시스템까지 한 번에!",
    images: [
      "/public/file.svg"
    ]
  },
  icons: {
    icon: "/favicon.ico"
  }
};

export default function RootLayout({
  children,
  params
}: Readonly<{
  children: React.ReactNode;
  params: { locale: string };
}>) {
  let messages;
  try {
    messages = require(`../public/locales/${params.locale}/common.json`);
  } catch (error) {
    notFound();
  }
  return (
    <html lang={params.locale}>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <NextIntlClientProvider locale={params.locale} messages={messages}>
          <header className="flex justify-end items-center px-4 py-2 border-b">
            <LanguageSwitcher />
          </header>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
