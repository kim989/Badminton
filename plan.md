# 🏸 배드민턴 입문 가이드 & 4주 훈련 루틴 PWA (plan.md)

## 1. 아키텍처 개요 (Architecture Overview)

본 문서는 `spec.md` 명세를 기반으로 한 **Next.js 14 (App Router) + Supabase + PWA** 시스템의 기술 아키텍처 및 상세 구현 계획서(plan.md)입니다.

### 1.1 오프라인-퍼스트 (Offline-First) 아키텍처
```
  [User Mobile / Web UI]
         │
  ┌──────┴──────────────────────────────────────┐
  │ Local State & Cache Layer                   │
  │  - PWA Service Worker (App Shell / Manuals) │
  │  - Zustand Persist Store (LocalStorage)     │
  └──────┬──────────────────────────────────────┘
         │ (Online Only Sync)
  ┌──────┴──────────────────────────────────────┐
  │ Supabase Cloud Backend                      │
  │  - Auth (Email/Password Session)            │
  │  - Database (Profiles, Training Logs)      │
  └─────────────────────────────────────────────┘
```

---

## 2. 프로젝트 디렉토리 구조 (Directory Structure)

```
P03/
├── public/
│   ├── icons/                 # PWA 앱 아이콘 (192x192, 512x512)
│   ├── favicon.ico
│   └── manifest.json          # PWA Web App Manifest
├── src/
│   ├── app/                   # Next.js App Router
│   │   ├── layout.tsx         # Root Layout (Theme, PWA Meta, Navigation)
│   │   ├── page.tsx           # Home Dashboard (대시보드 & 퀵 메뉴)
│   │   ├── manuals/           # 6대 매뉴얼 뷰어 페이지
│   │   │   ├── page.tsx       # 매뉴얼 목록 (카드 뷰)
│   │   │   └── [slug]/page.tsx# 세부 매뉴얼 렌더링
│   │   ├── routine/           # 4주 훈련 루틴 & 타이머 페이지
│   │   │   └── page.tsx       # 인터랙티브 타이머 & 체크리스트
│   │   ├── login/             # Supabase Auth 로그인/회원가입
│   │   │   └── page.tsx
│   │   └── profile/           # 마이페이지 & 훈련 이력
│   │       └── page.tsx
│   ├── components/            # UI 컴포넌트
│   │   ├── common/            # Header, BottomNav, Card, Modal
│   │   ├── manuals/           # ManualCard, MarkdownRenderer
│   │   ├── timer/             # StopWatch, IntervalTimer, RoutineChecklist
│   │   └── auth/              # LoginForm, SignupForm
│   ├── content/               # 6개 마크다운 문서 (앱 포함 정적 자원)
│   │   ├── 01_장비및그립.md
│   │   ├── 02_풋워크및스텝.md
│   │   ├── 03_기본스트로크.md
│   │   ├── 04_서브및리시브.md
│   │   ├── 05_경기규칙및매너.md
│   │   └── 06_훈련루틴.md
│   ├── lib/                   # 유틸리티 및 클라이언트 설정
│   │   ├── supabase/          # Supabase Client (`client.ts`, `server.ts`, `middleware.ts`)
│   │   ├── markdown.ts        # 마크다운 파일 파싱 유틸리티 (gray-matter)
│   │   └── store/             # Zustand 상태 관리 (`useTrainingStore.ts`, `useAuthStore.ts`)
│   ├── styles/                # 글로벌 CSS & 테마 변수 (Modern Dark)
│   │   └── globals.css
│   └── types/                 # TypeScript 데이터 타입 정의
│       ├── manual.ts
│       ├── training.ts
│       └── supabase.ts
├── spec.md                    # 프로젝트 요구사항 명세서
├── plan.md                    # 기술 아키텍처 및 구현 계획서 (본 문서)
└── tasks.md                   # 상세 개발 태스크 목록 (다음 단계)
```

---

## 3. 핵심 모듈별 상세 설계 (Module Design)

### 3.1 M-01. 마크다운 콘텐츠 파서 (Content Pipeline)
- **책임**: `src/content/` 폴더 내 6개 마크다운 파일 읽기 및 파싱.
- **구현 방식**: `gray-matter`로 메타데이터 추출, `next-mdx-remote` 또는 `remark/rehype` 파서 활용.
- **주요 함수**:
  - `getAllManuals()`: 6개 매뉴얼 목록 및 메타정보 반환
  - `getManualBySlug(slug)`: 특정 매뉴얼 본문 HTML/Markdown 파싱 데이터 반환

### 3.2 M-02. 오프라인-퍼스트 상태 관리 (Zustand + Sync)
- **책임**: 유저의 훈련 루틴 완료 체크, 타이머 상태, 오프라인 임시 저장 관리.
- **구현 방식**:
  - Zustand `persist` 미들웨어를 활용하여 LocalStorage에 최우선 반영.
  - 네트워크 연결 및 로그인 상태 확인 후 Supabase `user_training_logs` 테이블로 데이터 비동기 동기화.

### 3.3 M-03. Supabase 연동 (Auth & SSR Client)
- **책임**: 사용자 이메일 인증 및 훈련 로그 DB 저장.
- **구현 방식**:
  - `@supabase/ssr` 패키지를 이용하여 Next.js App Router의 Server Component 및 Client Component에 안전한 쿠키 기반 인증 구현.
  - Next.js `middleware.ts`를 작성하여 보호된 라우트 (`/profile` 등) 세션 검증.

### 3.4 M-04. 4주 훈련 루틴 인터랙티브 타이머 (Interactive Timer)
- **책임**: 세트별 인터벌 카운트다운, 쉬는 시간 타이머, 세트 완료 딩동 알림음(Web Audio API).
- **구성 요소**:
  - **주차 선택 탭**: 1주차~4주차 선택
  - **세트 체크리스트 UI**: 각 주차별 훈련 항목(예: 스플릿 스텝 50회) 체크박스
  - **인터벌 타이머 Modal/Card**: 훈련 시간 / 휴식 시간 카운트다운

### 3.5 M-05. PWA & 오프라인 캐싱 (PWA Engine)
- **책임**: PWA 설치 및 서비스 워커를 통한 오프라인 동작 보장.
- **구현 방식**:
  - `@ducanh2912/next-pwa` 설정 적용
  - App Shell 및 `manuals/*` 정적 페이지 캐싱
  - Standalone 디스플레이 설정 및 스포티 다크 모드 `theme_color` (`#0D1117`)

---

## 4. 단계별 구현 마일스톤 (Implementation Phases)

### 📌 Phase 1: 프로젝트 기반 및 PWA 디자인 시스템 구축
- Next.js 14 (App Router) 초기화 및 TypeScript 설정
- PWA 설정 (`manifest.json`, 서비스 워커, PWA 메타 태그)
- 스포티 다크 테마 글로벌 CSS 정의 (`globals.css` 및 CSS Variables)
- 하단 고정 스티키 네비게이션 바 및 공통 Layout 구축 (`Lucide React` 아이콘 적용)

### 📌 Phase 2: 마크다운 매뉴얼 파서 및 뷰어 개발
- 6개 마크다운 문서를 `src/content/` 폴더로 배치
- 마크다운 파일 파싱 유틸리티 (`src/lib/markdown.ts`) 작성
- 매뉴얼 목록 페이지 (`/manuals`) 및 상세 뷰어 페이지 (`/manuals/[slug]`) 구현
- 오프라인 상에서도 매뉴얼이 조회가 가능하도록 정적 경로 생성 (`generateStaticParams`)

### 📌 Phase 3: Supabase 백엔드 연동 & Auth
- Supabase 프로젝트 생성 및 테이블 쿼리 실행 (`profiles`, `user_training_logs`)
- Supabase SSR 인스턴스 생성 유틸리티 (`src/lib/supabase/`) 구현
- 이메일/비밀번호 로그인 및 회원가입 페이지 (`/login`) 작성
- 마이페이지 (`/profile`) 및 프로필 수정 기능 구현

### 📌 Phase 4: 4주 완성 훈련 인터랙티브 타이머 & 체크리스트
- Zustand 훈련 상태 스토어 (`useTrainingStore.ts`) 작성 및 LocalStorage 연동
- 주차별 훈련 루틴 데이터 구조화 및 체크리스트 UI 구현
- 인터랙티브 스톱워치 / 카운트다운 타이머 컴포넌트 개발
- 훈련 완료 시 Supabase DB 연동 자동 저장 및 이력 조회 구현

### 📌 Phase 5: 오프라인 캐싱 검증 & Vercel 최종 배포
- PWA 서비스 워커 캐싱 전략 및 오프라인 네트워크 차단 테스트
- 모바일 디바이스 뷰포트 반응형 UI 최종 검증
- Vercel 연동 및 환경 변수(`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`) 설정 후 자동 배포

---

## 5. 리스크 관리 및 대응 방안 (Risk & Mitigation)

1. **오프라인 상태 데이터 유실 리스크**:
   - **대응**: 모든 훈련 완료 기록 및 진행 상황은 먼저 LocalStorage(Zustand Persist)에 기록되며, 온라인 복구 시 Supabase로 대기 큐(Queue) 데이터를 자동 털어넣도록 설계.
2. **PWA 오프라인 캐싱 미작동 이슈**:
   - **대응**: Next.js App Router의 `generateStaticParams`를 활용해 6개 매뉴얼 페이지를 정적 HTML(SSG)로 사전 생성하여 서비스 워커 캐시 안정성 확보.
