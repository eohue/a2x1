# ibookee Unified Platform Monorepo

## 구조
```
/repo-root
├── apps/
│   ├── frontend/          # Next.js
│   └── api-gateway/       # NestJS BFF
├── services/              # Microservices
├── libs/                  # 공통 라이브러리
├── infra/                 # IaC, 배포 스크립트
├── docs/                  # 문서
```

## 개발 환경
- 패키지 매니저: pnpm
- 프론트엔드: Next.js 14, TypeScript
- 백엔드: NestJS 10, TypeScript

## 세팅
```sh
pnpm install
```

## 빌드/실행
```sh
# 프론트엔드
pnpm --filter @your-org/frontend dev

# 백엔드
pnpm --filter @your-org/api-gateway start:dev
```

## 코드 컨벤션
- Lint: ESLint, Prettier
- 커밋: Husky, lint-staged

## Onboarding
1. pnpm 설치: `npm install -g pnpm`
2. 의존성 설치: `pnpm install`
3. 각 앱/서비스 폴더에서 dev/build 실행
4. 환경변수(.env) 예시는 각 폴더 참고

---
문의: @your-org 

## DB 마이그레이션 TODO

- [ ] 전체 개발 완료 후, 모든 엔티티/스키마 변경사항을 최종 확인
- [ ] TypeORM 마이그레이션 파일(InitSchema, AddIndexes 등) 최신화 및 검증
- [ ] `pnpm` 및 `ts-node` 환경에서 마이그레이션 실행 (ESM 호환성 포함)
- [ ] 실제 DB에 마이그레이션 적용 및 데이터 무결성 확인
- [ ] 마이그레이션 실패/예외 발생 시, 수동 마이그레이션 스크립트로 대체 적용
- [ ] 최종 마이그레이션 결과를 코드/문서로 기록 및 공유

--- 