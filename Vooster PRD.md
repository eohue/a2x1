
# Product Requirements Document  
IBOOKEE 홈페이지(ibookee.kr) 리뉴얼

## 1. Executive Summary
현행 사이트는 아이부키의 사회주택 모델·커뮤니티 철학·운영 가치를 충분히 전달하지 못한다. 새 웹·포털·관리자 시스템을 통합 구축해 브랜드 인지도, 사용자 경험, 운영 효율을 동시에 향상시킨다.

## 2. Problem Statement
1. 정보 단편화: 회사 소개·프로젝트·입주 프로세스가 흩어져 있어 이해도 저하  
2. 커뮤니티 기능 부재: 입주민 간 온라인 소통/자치 활동 채널 없음  
3. 운영 비효율: 입주 승인·콘텐츠 게시가 수작업 중심  
4. 브랜드 메시지 미흡: 기업 비전·사회적 임팩트가 시각화되지 않음

## 3. Goals and Objectives
- Primary Goal: “비전·프로젝트·커뮤니티·운영”을 하나로 묶은 통합 플랫폼 구축  
- Secondary Goals  
  - UX 개선: 목표 사용자별 맞춤 정보 & 간편 내비게이션  
  - 커뮤니티 활성: 입주민 자발적 소통, 오프라인 활동 연계  
  - 운영 자동화: 관리자 포털로 승인·공지·모더레이션 통합  
- Success Metrics  
  - Public Site 월 UV +50%, 입주 신청 전환율 3%↑  
  - Resident Portal MAU 60% 이상, 주간 게시물 100건  
  - 신규 입주 승인 평균 24h 이내  

## 4. Target Audience
### Primary Users
- 현재 입주민: 실시간 공지·소모임·생활가이드 편집
### Secondary Users
- 예비 입주민: 프로젝트·커뮤니티 분위기·입주 절차 파악, 신청
### Tertiary Users
- 외부 관심자·파트너·투자자: 사회주택 가치, 사업성과, ESG 자료
### Internal
- 운영 관리자: 회원·콘텐츠·리포트 중심 운영

## 5. User Stories
- 입주민: “공동체 소식을 한눈에 보고 댓글로 소통하고 싶다.”  
- 예비 입주민: “입주 조건과 실제 거주 후기를 보고 온라인으로 신청하고 싶다.”  
- 파트너: “아이부키의 사회적 성과 및 재무 지표를 확인하고 협업을 타진하고 싶다.”  
- 관리자: “가입 요청·공지·전반적인 사이트 관리 및 통계 확인 등을 대시보드에서 즉시 처리하고 싶다.”

## 6. Functional Requirements
### Core Features
1. Public Site  
   - 히어로 섹션: 비전·임팩트 지표 시각화  
   - Projects: 필터·검색, 상세 페이지 + 기획서 PDF 다운로드  
   - Community Preview: 인스타 피드·입주민 인터뷰  
   - 입주 신청: 공고 게시, 조건 안내, 온라인 폼, FAQ, 1:1 문의
2. Resident Portal  
   - 인증 기반 로그인/가입(관리자 승인)  
   - Dashboard: 개인화 알림·공지  
   - Community Feed: 글/사진/영상, 소모임 채널, 인스타·카톡 연동  
   - Living Guide: 위키형 편집, 관리자 승인 워크플로우  
   - Event & Poll: 일정, 투표, 모임 생성·참여
3. Admin Portal  
   - 역할: Super, Hub, House Manager  
   - 통합 대시보드: 회원·활성도·민원·콘텐츠 현황  
   - 회원 관리: 승인·검색·권한·퇴거 처리  
   - 콘텐츠 관리: 프로젝트·뉴스·공지·모더레이션  
   - 리포트: MAU, 게시물, CSV/PDF 다운로드

### Supporting Features
- 푸시 알림(Firebase)  
- 다국어(한국어/영어) 구조 설계  
- SEO & SNS Meta 태그 자동 생성  
- 접근성 준수(WCAG 2.1 AA)  

## 7. Non-Functional Requirements
- Performance: 핵심 페이지 LCP 2.5s 이내, P95 API 500ms 이하  
- Security: OAuth2, JWT, HTTPS, 개인정보 암호화(At-rest AES256)  
- Usability: 모바일 우선, 반응형, 키보드 내비게이션  
- Scalability: 멀티테넌트 주택 단지 추가, Kubernetes 자동 확장  
- Compatibility: 최신 Chrome, Safari, Edge, Android/iOS 2버전 이하 지원

## 8. Technical Considerations
- Frontend: Next.js 14, React, Tailwind CSS, TypeScript  
- Backend: Node.js (NestJS), PostgreSQL, Redis, Socket.io  
- Infra: AWS (EKS, RDS, S3, CloudFront), Terraform IaC  
- Integrations: Instagram Graph API, 카카오톡 공유, Firebase FCM, 결제 PG (NICEPay)  
- Data: ERD - User, House, Post, Comment, Event, Application, Report 등  
- CI/CD: GitHub Actions → ECR → EKS Blue/Green 배포

## 9. Success Metrics and KPIs
- UV, PV, 신청 전환율, SEO Score  
- MAU/DAU, 게시글·댓글·모임 수, 푸시 열람률  
- 평균 승인/민원 처리 시간, 관리자 NPS  
- 서버 가동률 99.9%, 오류율 <0.1%

## 10. Timeline and Milestones
- Phase 1 (M+2): 디자인 시스템, Public Site MVP, Resident 로그인/피드, Admin 기본  
- Phase 2 (M+4): Living Guide, 이벤트·투표, 푸시, 인스타 자동 연동  
- Phase 3 (M+6): 다주택 교류, 리포트 자동화, 권한 세분화  
- Phase 4 (M+9): 모바일 앱 조사·POC, 외부 회계 API, 개인화 추천

## 11. Risks and Mitigation
- Instagram API 변경 → RSS 백업·크롤링 대체 경로 마련  
- 데이터 유출 → 정기 펜테스트·암호화·권한 최소화  
- 커뮤니티 저활성 → 오프라인 행사 연계, 초기 콘텐츠 시드 확보  
- 일정 지연 → 애자일 2주 스프린트, 버퍼 10%

## 12. Future Considerations
- iOS/Android 하이브리드 앱  
- ESG 임팩트 리포트 자동 생성  
- 스마트 락/IoT 연동으로 시설 예약·출입 관리  
- AI 챗봇 민원 대응 및 콘텐츠 추천
