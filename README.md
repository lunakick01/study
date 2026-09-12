# 의류 쇼핑몰 랜딩페이지

원페이지 랜딩 사이트 + 구입 문의 접수 + 관리자 답변 페이지.

## 기술 스택

| 영역 | 선택 |
|---|---|
| 프레임워크 | Next.js 16 (App Router, Turbopack), React 19, TypeScript |
| 스타일 | Tailwind CSS 4 |
| ORM | Prisma 7 (`@prisma/adapter-pg`) |
| DB / Auth / Storage | Supabase (로컬은 Supabase CLI + Docker) |

## 사전 요구사항

- Node.js 24 LTS
- Docker Desktop (WSL2 백엔드)

## 로컬 개발 환경 시작

```bash
npm install                 # 의존성 설치 (postinstall 에서 prisma generate 자동 실행)
cp .env.example .env        # 최초 1회

npm run db:start            # Supabase 로컬 스택(Postgres, Auth, Storage, Studio ...) Docker 로 기동
npm run db:status           # API URL / anon key / service_role key 확인 → .env 값과 대조

npm run prisma:migrate      # 스키마 → DB 마이그레이션 (최초: --name init)
npm run prisma:seed         # 샘플 상품 데이터 입력

npm run dev                 # http://localhost:3000
```

- Supabase Studio: http://127.0.0.1:54323
- Prisma Studio: `npm run prisma:studio`
- 로컬 스택 종료: `npm run db:stop`

## 관리자 페이지

```bash
npm run admin:create -- <이메일> <비밀번호>   # 관리자 계정 생성 (가입 기능 없음, 재실행 시 비밀번호 변경)
```

- 로그인: http://localhost:3000/admin/login
- 대시보드(`/admin`): 오늘·이번 주·전체 건수, 미확인 배지(탭 제목에도 표시), 최근 5건, 상품별 TOP 5
- 문의 관리(`/admin/inquiries`): 상태 탭, 이름·연락처·상품 검색, 기간 필터, 20건씩 페이지
- 상세: 전체 입력값 + IP·기기, 전화걸기·번호 복사, 상태 변경(신규→상담중→구매완료/보류/스팸), 관리자 메모
- 비로그인 접근은 `src/proxy.ts`에서 로그인 페이지로 돌려보냄. 검색엔진 노출 차단(noindex)

## 디렉터리

```
prisma/
  schema.prisma       # 데이터 모델 (Product, ProductImage, Inquiry, InquiryMemo)
  seed.ts             # 샘플 데이터
prisma.config.ts      # Prisma 7 설정 (DATABASE_URL, migrations, seed)
supabase/config.toml  # Supabase 로컬 스택 설정 (포트 등)
src/
  app/                # 라우트 (원페이지: /, 관리자: /admin, API: /api/inquiries)
  app/admin/          # 로그인(login) + 보호 구역((dashboard): 대시보드·문의 목록·상세)
  proxy.ts            # /admin 세션 갱신 + 비로그인 차단
  components/landing/ # 랜딩 섹션 컴포넌트 (Claude Design "Landing v2" 포팅)
  components/admin/   # 관리자 UI 조각
  content/landing.ts  # 랜딩 문구·상품 데이터(정적)
  lib/prisma.ts       # Prisma 클라이언트 싱글턴
  lib/supabase/       # Supabase 클라이언트 (browser / server / admin)
  generated/prisma/   # prisma generate 산출물 (git 제외)
```

## 문서

BRD / PRD 는 Claude Design 프로젝트의 `uploads/` 에 있다. 구현 진행: M1~M4 완료(핵심), 남은 것 — 엑셀 내보내기·휴지통(M4), 상품/콘텐츠 CMS(M5).
