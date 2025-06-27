import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '입주 신청 | 아이부키(ibookee)',
  description: '아이부키 사회주택 입주 신청 페이지. 온라인으로 간편하게 입주를 신청하고, 자주 묻는 질문과 1:1 문의도 확인하세요.',
  openGraph: {
    title: '입주 신청 | 아이부키(ibookee)',
    description: '아이부키 사회주택 입주 신청 페이지. 온라인으로 간편하게 입주를 신청하고, 자주 묻는 질문과 1:1 문의도 확인하세요.',
    url: 'https://ibookee.com/application',
    siteName: '아이부키(ibookee)',
    images: [
      {
        url: '/public/file.svg', // 실제 대표 이미지로 교체 필요
        width: 1200,
        height: 630,
        alt: '아이부키 입주 신청'
      }
    ],
    type: 'website',
    locale: 'ko_KR'
  },
  twitter: {
    card: 'summary_large_image',
    title: '입주 신청 | 아이부키(ibookee)',
    description: '아이부키 사회주택 입주 신청 페이지. 온라인으로 간편하게 입주를 신청하고, 자주 묻는 질문과 1:1 문의도 확인하세요.',
    images: [
      '/public/file.svg'
    ]
  }
};

export default function ApplicationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
