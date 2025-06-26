import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '입주민 회원가입 | 아이부키(ibookee)',
  description: '아이부키 입주민 포털 회원가입 페이지. 이메일, 비밀번호 입력 후 관리자의 승인 절차를 거쳐 안전하게 가입하세요.',
  openGraph: {
    title: '입주민 회원가입 | 아이부키(ibookee)',
    description: '아이부키 입주민 포털 회원가입 페이지. 이메일, 비밀번호 입력 후 관리자의 승인 절차를 거쳐 안전하게 가입하세요.',
    url: 'https://ibookee.com/resident/register',
    siteName: '아이부키(ibookee)',
    images: [
      {
        url: '/public/file.svg',
        width: 1200,
        height: 630,
        alt: '아이부키 입주민 회원가입'
      }
    ],
    type: 'website',
    locale: 'ko_KR'
  },
  twitter: {
    card: 'summary_large_image',
    title: '입주민 회원가입 | 아이부키(ibookee)',
    description: '아이부키 입주민 포털 회원가입 페이지. 이메일, 비밀번호 입력 후 관리자의 승인 절차를 거쳐 안전하게 가입하세요.',
    images: [
      '/public/file.svg'
    ]
  }
};

export default function ResidentRegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
