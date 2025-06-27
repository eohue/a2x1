# IBOOKEE - Social Housing Platform

Next.js 기반의 사회주택 플랫폼으로, 다국어 지원(한국어/영어)과 현대적인 UI/UX를 제공합니다.

## 🏗 프로젝트 구조 (Monorepo)

```
/repo-root
├── apps/
│   ├── frontend/          # Next.js 15 + TypeScript
│   └── api-gateway/       # NestJS BFF
├── services/              # Microservices
├── libs/                  # 공통 라이브러리
├── infra/                 # IaC, 배포 스크립트
├── docs/                  # 문서
└── components/            # 공통 UI 컴포넌트
```

## 🛠 기술 스택

### Frontend
- **Framework**: Next.js 15.3.4 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4.1.10
- **UI Components**: Headless UI, Heroicons
- **국제화**: next-intl
- **상태 관리**: Zustand
- **폼 관리**: React Hook Form + Zod

### Backend
- **Framework**: NestJS 10
- **Language**: TypeScript
- **Database**: TypeORM

### DevOps & Tools
- **패키지 매니저**: pnpm
- **Lint**: ESLint, Prettier
- **Testing**: Jest, React Testing Library, Playwright
- **Documentation**: Storybook
- **Deployment**: Vercel

## 🚀 주요 기능

- **다국어 지원**: next-intl을 활용한 한국어/영어 지원
- **반응형 디자인**: 모바일, 태블릿, 데스크톱 최적화
- **접근성**: WCAG 2.1 AA 기준 준수
- **현대적 UI**: Tailwind CSS와 Headless UI 활용
- **타입 안전성**: TypeScript 기반 개발
- **컴포넌트 문서화**: Storybook 지원
- **포괄적 테스팅**: Jest, React Testing Library, Playwright

## 🛠 기술 스택

### Frontend
- **Framework**: Next.js 15.3.4 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4.1.10
- **UI Components**: Headless UI, Heroicons
- **국제화**: next-intl
- **상태 관리**: Zustand
- **폼 관리**: React Hook Form + Zod

### Testing & Quality
- **Unit Testing**: Jest + React Testing Library
- **E2E Testing**: Playwright
- **Accessibility Testing**: axe-core
- **Component Documentation**: Storybook
- **Code Quality**: ESLint, TypeScript

### Deployment
- **Platform**: Vercel (권장)
- **Alternative**: Netlify, AWS Amplify, Docker

## 🏃‍♂️ 빠른 시작

### 필수 요구사항
- Node.js 18.17 이상
- npm 또는 yarn

### 설치 및 실행

```bash
# 저장소 클론
git clone https://github.com/yourusername/social-housing-platform.git
cd social-housing-platform

# 의존성 설치
npm install

# 환경 변수 설정
cp .env.example .env.local
# .env.local 파일을 열어 실제 값으로 수정

# 개발 서버 실행
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인하세요.

## 🧪 테스팅

### 단위 테스트
```bash
# 모든 테스트 실행
npm test

# 특정 파일 테스트
npm test Button.test.tsx

# 테스트 커버리지 확인
npm test -- --coverage
```

### Storybook
```bash
# Storybook 실행
npm run storybook

# Storybook 빌드
npm run build-storybook
```

### E2E 테스트
```bash
# Playwright 테스트 실행
npx playwright test

# UI 모드로 실행
npx playwright test --ui
```

## 🚀 배포

### Vercel 배포 (권장)

1. **GitHub 리포지토리 연결**
   - [Vercel Dashboard](https://vercel.com/dashboard)에서 "New Project" 클릭
   - GitHub 리포지토리 연결
   - 자동 배포 설정 완료

2. **환경 변수 설정**
   - Vercel 프로젝트 설정에서 Environment Variables 추가
   - `.env.example` 파일 참고하여 실제 값 입력

3. **도메인 설정**
   - Vercel에서 제공하는 도메인 사용
   - 또는 커스텀 도메인 연결

### 환경 변수 설정

배포 전 다음 환경 변수들을 설정해주세요:

```bash
# 필수 환경 변수
NEXT_PUBLIC_API_URL=https://your-api-domain.com/api
NEXT_PUBLIC_SOCKET_URL=https://your-api-domain.com

# 선택적 환경 변수 (필요시)
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
NEXT_PUBLIC_FIREBASE_API_KEY=your-firebase-api-key
```

## 📁 프로젝트 구조

```
├── app/                    # Next.js App Router
│   ├── [locale]/          # 다국어 라우팅
│   ├── api/               # API 라우트
│   └── globals.css        # 글로벌 스타일
├── components/            # 재사용 가능한 컴포넌트
│   ├── common/           # 공통 UI 컴포넌트
│   ├── features/         # 기능별 컴포넌트
│   └── __tests__/        # 컴포넌트 테스트
├── lib/                  # 유틸리티 및 설정
├── messages/             # 다국어 메시지
├── public/               # 정적 파일
├── .storybook/          # Storybook 설정
└── tests/               # E2E 테스트
```

## 🤝 기여 가이드

1. 저장소 포크
2. 기능 브랜치 생성 (`feature/amazing-feature`)
3. 변경사항 커밋
4. 테스트 실행 및 통과 확인
5. Pull Request 생성

### 커밋 컨벤션
```
feat: 새로운 기능 추가
fix: 버그 수정
docs: 문서 수정
style: 코드 스타일 변경
refactor: 리팩토링
test: 테스트 추가/수정
chore: 빌드 프로세스 또는 보조 도구 변경
```

---

**Made with ❤️ using Next.js and TypeScript**
