import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '입주민 로그인 | 아이부키(ibookee)',
  description: '아이부키 입주민 포털 로그인 페이지. 승인 기반 안전한 인증, 간편한 로그인 경험 제공.',
  openGraph: {
    title: '입주민 로그인 | 아이부키(ibookee)',
    description: '아이부키 입주민 포털 로그인 페이지. 승인 기반 안전한 인증, 간편한 로그인 경험 제공.',
    url: 'https://ibookee.com/resident/login',
    siteName: '아이부키(ibookee)',
    images: [
      {
        url: '/public/file.svg',
        width: 1200,
        height: 630,
        alt: '아이부키 입주민 로그인'
      }
    ],
    type: 'website',
    locale: 'ko_KR'
  },
  twitter: {
    card: 'summary_large_image',
    title: '입주민 로그인 | 아이부키(ibookee)',
    description: '아이부키 입주민 포털 로그인 페이지. 승인 기반 안전한 인증, 간편한 로그인 경험 제공.',
    images: [
      '/public/file.svg'
    ]
  }
};

export default function ResidentLoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
