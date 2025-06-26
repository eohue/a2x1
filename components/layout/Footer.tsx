import Link from 'next/link';

const navigation = {
  main: [
    { name: '홈', href: '/' },
    { name: '프로젝트', href: '/projects' },
    { name: '입주 신청', href: '/application' },
    { name: '커뮤니티', href: '/community' },
  ],
  support: [
    { name: '자주 묻는 질문', href: '/faq' },
    { name: '1:1 문의', href: '/contact' },
    { name: '이용약관', href: '/terms' },
    { name: '개인정보처리방침', href: '/privacy' },
  ],
  company: [
    { name: '회사 소개', href: '/about' },
    { name: '비전 & 미션', href: '/vision' },
    { name: '투자 정보', href: '/investor' },
    { name: '채용 정보', href: '/careers' },
  ],
  social: [
    {
      name: 'Instagram',
      href: 'https://www.instagram.com/ibookee_official',
      icon: (props: any) => (
        <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
          <path
            fillRule="evenodd"
            d="M12.017 0C8.396 0 7.954.01 6.74.048 2.721.204.203 2.722.048 6.74.01 7.954 0 8.396 0 12.017c0 3.621.01 4.063.048 5.277.156 4.018 2.674 6.536 6.692 6.692 1.214.038 1.656.048 5.277.048 3.621 0 4.063-.01 5.277-.048 4.018-.156 6.536-2.674 6.692-6.692.038-1.214.048-1.656.048-5.277 0-3.621-.01-4.063-.048-5.277C23.796 2.722 21.278.204 17.26.048 16.046.01 15.604 0 12.017 0zm0 2.162c3.549 0 3.97.014 5.372.052 2.961.135 4.314 1.488 4.449 4.449.038 1.402.052 1.823.052 5.372 0 3.549-.014 3.97-.052 5.372-.135 2.961-1.488 4.314-4.449 4.449-1.402.038-1.823.052-5.372.052-3.549 0-3.97-.014-5.372-.052-2.961-.135-4.314-1.488-4.449-4.449-.038-1.402-.052-1.823-.052-5.372 0-3.549.014-3.97.052-5.372.135-2.961 1.488-4.314 4.449-4.449 1.402-.038 1.823-.052 5.372-.052z"
            clipRule="evenodd"
          />
          <path
            fillRule="evenodd"
            d="M12.017 5.838a6.179 6.179 0 100 12.358 6.179 6.179 0 000-12.358zM12.017 16a4 4 0 110-8 4 4 0 010 8z"
            clipRule="evenodd"
          />
          <path d="M18.405 4.594a1.44 1.44 0 11-2.88 0 1.44 1.44 0 012.88 0z" />
        </svg>
      ),
    },
    {
      name: 'KakaoTalk',
      href: 'https://pf.kakao.com/_ibookee',
      icon: (props: any) => (
        <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
          <path d="M12 3c5.798 0 10.5 3.664 10.5 8.185 0 4.52-4.702 8.184-10.5 8.184a13.5 13.5 0 01-1.727-.11l-4.408 2.883c-.501.265-.678.236-.472-.413l.892-3.678c-2.88-1.46-4.785-3.99-4.785-6.866C1.5 6.665 6.202 3 12 3z" />
        </svg>
      ),
    },
  ],
};

export function Footer() {
  return (
    <footer className="bg-gray-900" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">
        Footer
      </h2>
      <div className="mx-auto max-w-7xl px-6 pb-8 pt-16 sm:pt-24 lg:px-8 lg:pt-32">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          <div className="space-y-8">
            <div className="text-2xl font-bold text-white">
              ibookee
            </div>
            <p className="text-sm leading-6 text-gray-300">
              아이부키는 사회주택을 통해 더 나은 공동체를 만들어가는 사회적 기업입니다.
              지속가능한 주거 문화와 따뜻한 이웃과의 만남을 만들어갑니다.
            </p>
            <div className="flex space-x-6">
              {navigation.social.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-gray-400 hover:text-gray-300 transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="sr-only">{item.name}</span>
                  <item.icon className="h-6 w-6" aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>
          
          <div className="mt-16 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold leading-6 text-white">서비스</h3>
                <ul role="list" className="mt-6 space-y-4">
                  {navigation.main.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className="text-sm leading-6 text-gray-300 hover:text-white transition-colors"
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="mt-10 md:mt-0">
                <h3 className="text-sm font-semibold leading-6 text-white">고객지원</h3>
                <ul role="list" className="mt-6 space-y-4">
                  {navigation.support.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className="text-sm leading-6 text-gray-300 hover:text-white transition-colors"
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold leading-6 text-white">회사</h3>
                <ul role="list" className="mt-6 space-y-4">
                  {navigation.company.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className="text-sm leading-6 text-gray-300 hover:text-white transition-colors"
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="mt-10 md:mt-0">
                <h3 className="text-sm font-semibold leading-6 text-white">연락처</h3>
                <div className="mt-6 space-y-4 text-sm text-gray-300">
                  <p>서울특별시 강남구 테헤란로 123</p>
                  <p>전화: 02-1234-5678</p>
                  <p>이메일: hello@ibookee.kr</p>
                  <p>운영시간: 평일 09:00 - 18:00</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-16 border-t border-gray-700 pt-8 sm:mt-20 lg:mt-24">
          <div className="md:flex md:items-center md:justify-between">
            <div className="flex space-x-6 md:order-2">
              <p className="text-xs leading-5 text-gray-400">
                사업자등록번호: 123-45-67890 | 대표자: 김대표
              </p>
            </div>
            <p className="mt-8 text-xs leading-5 text-gray-400 md:order-1 md:mt-0">
              &copy; 2024 아이부키(ibookee). All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
