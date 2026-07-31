# 🏸 배드민턴 입문 가이드 & 4주 훈련 루틴 PWA (tasks.md)

 본 문서는 `spec.md` 및 `plan.md`를 바탕으로 한 단계별 구체적 실행 태스크(tasks.md)입니다.
 **모든 태스크는 구현 완료 후 해당 검증 테스트(Test)를 반드시 수행합니다.**

---

## 📌 Phase 1: 프로젝트 기반 환경 및 PWA 디자인 시스템 구축

### taskList-1.1: Next.js 14+ App Router 프로젝트 초기화 및 의존성 라이브러리 설치
- **설명**: Next.js 프로젝트 생성 및 주요 패키지(`lucide-react`, `@supabase/supabase-js`, `@supabase/ssr`, `zustand`, `gray-matter`, `remark`, `rehype-html`) 설치
- **작업 내용**:
  - `package.json` 설정 및 TypeScript 환경 구성
  - 필요 패키지 설치
- **테스트 (Test Procedure)**:
  - 🧪 **실행 커맨드**: `npm run build` 및 `npm run dev`
  - 🧪 **검증 기준**: 에러 없이 로컬 서버(`http://localhost:3000`)가 렌더링되며 build 성공 메시지가 출력되어야 함.

### taskList-1.2: PWA Manifest & Service Worker 메타 설정
- **설명**: 오프라인 지원 및 모바일 앱 설치(A2HS)를 위한 PWA 설정
- **작업 내용**:
  - `public/manifest.json` 파일 생성 (앱 이름, 테마 색상 `#0D1117`, 아이콘 경로 등)
  - `public/icons/` 폴더에 192x192, 512x512 PWA 앱 아이콘 배치
  - `next.config.js`에 PWA 서비스 워커 설정 연동
- **테스트 (Test Procedure)**:
  - 🧪 **실행 커맨드**: `npm run build` 실행 후 개발자 도구 (Chrome DevTools) 열기
  - 🧪 **검증 기준**:
    1. DevTools > **Application > Manifest** 항목에서 manifest.json 정상 인식 확인
    2. DevTools > **Application > Service Workers** 항목에 서비스 워커 등록 확인
    3. Lighthouse 검사에서 **PWA 항목 통과** 확인

### taskList-1.3: 스포티 다크 UI 디자인 시스템 & 글로벌 레이아웃 구축
- **설명**: 네온 그린 포인트의 다크 테마 CSS 및 하단 고정 네비게이션 바 레이아웃 작성
- **작업 내용**:
  - `src/styles/globals.css`: 다크 테마 변수 (`--bg-primary: #0D1117`, `--accent-primary: #00FF66`) 정의
  - `src/components/common/Header.tsx`: 상단 앱 타이틀 및 프로필 숏컷
  - `src/components/common/BottomNav.tsx`: 하단 고정 네비게이션 (홈, 매뉴얼, 훈련, 마이페이지 - `Lucide React` 아이콘 적용)
  - `src/app/layout.tsx`: Root Layout 조합
- **테스트 (Test Procedure)**:
  - 🧪 **실행 방식**: 브라우저 뷰포트를 모바일 기기 크기(예: iPhone 14 / 390px)로 변경
  - 🧪 **검증 기준**:
    1. 하단 네비게이션 바가 스티키로 고정되어 노출되는지 확인
    2. 탭 클릭 시 주소 변경 및 스포티 다크 모드 스타일이 정상 적용되는지 visual 확인

---

## 📌 Phase 2: 6대 배드민턴 매뉴얼 파서 및 오프라인 정적 뷰어 개발

### taskList-2.1: [x] 마크다운 파일 배치 및 파서 유틸리티 개발 완료
- **설명**: 기존 6개 마크다운 매뉴얼 파일 파싱 및 데이터 구조화
- **작업 내용**:
  - `src/content/` 디렉토리에 `01_장비및그립.md` ~ `06_훈련루틴.md` 파일 저장
  - `src/lib/markdown.ts`: 마크다운 메타데이터 파싱 및 HTML 변환 함수 구현 (`getAllManuals`, `getManualBySlug`)
- **테스트 (Test Procedure)**:
  - 🧪 **실행 커맨드**: `npx tsx src/lib/markdown.ts` 또는 유닛 테스트 스크립트 실행
  - 🧪 **검증 기준**: 6개 파일의 `slug`, `title`, `contentHtml` 데이터가 올바르게 파싱되어 객체 배열로 반환되어야 함. (테스트 통과 ✅)

### taskList-2.2: [x] 매뉴얼 목록 및 상세 뷰어 UI 개발 완료 (`/manuals`, `/manuals/[slug]`)
- **설명**: 입문자가 읽기 편한 카드형 매뉴얼 목록 UI 및 렌더링 뷰어 작성
- **작업 내용**:
  - `src/app/manuals/page.tsx`: 6개 매뉴얼 카테고리 그리드 카드로 표시
  - `src/app/manuals/[slug]/page.tsx`: 마크다운 HTML 렌더링, 목차(TOC) 및 이전/다음 매뉴얼 이동 버튼
  - Next.js `generateStaticParams`를 적용하여 정적 페이지(SSG) 사전 생성
- **테스트 (Test Procedure)**:
  - 🧪 **실행 커맨드**: `npm run build`
  - 🧪 **검증 기준**:
    1. 빌드 출력 로그에 `/manuals/01-equipment`, `/manuals/02-footwork` 등 6개 정적 페이지가 성공적으로 생성됨을 확인
    2. 브라우저에서 표, 인용구, 코드 블록 등이 스포티 다크 디자인 테마로 정상 스타일링되는지 확인

---

## 📌 Phase 3: Supabase 백엔드 연동 & 사용자 인증 (Auth)

### taskList-3.1: Supabase 데이터베이스 테이블 및 RLS 스키마 구축
- **설명**: 유저 프로필 및 훈련 로그를 위한 Supabase DB 테이블 생성
- **작업 내용**:
  - Supabase SQL Editor를 통해 `profiles` 및 `user_training_logs` 테이블 생성 DDL 실행
  - Row Level Security (RLS) 정책 설정 (본인 데이터만 SELECT/INSERT/UPDATE 가능하도록 설정)
- **테스트 (Test Procedure)**:
  - 🧪 **실행 방식**: Supabase 대시보드 Table Editor 및 SQL Editor 실행
  - 🧪 **검증 기준**: 테이블 생성 확인 및 RLS 활성화(Enabled) 상태 표시 검증

### taskList-3.2: Supabase SSR 인증 클라이언트 및 로그인 UI 개발 (`/login`)
- **설명**: 이메일/비밀번호 방식의 사용자 인증 구현
- **작업 내용**:
  - `src/lib/supabase/client.ts`, `server.ts`, `middleware.ts` 작성
  - `src/app/login/page.tsx`: 이메일/비밀번호 로그인 및 회원가입 폼 컴포넌트
- **테스트 (Test Procedure)**:
  - 🧪 **실행 방식**: 브라우저에서 테스트 계정 회원가입 후 로그인 시도
  - 🧪 **검증 기준**:
    1. 회원가입 성공 시 Supabase Auth 대시보드 및 `profiles` 테이블에 유저 생성 확인
    2. 로그인 성공 시 인증 쿠키가 생성되고 프로필 페이지로 리다이렉트 확인

### taskList-3.3: 마이페이지 및 프로필 관리 개발 (`/profile`)
- **설명**: 선호 장비(라켓 무게, 거트 장력) 설정 및 개인 정보 관리 UI
- **작업 내용**:
  - `src/app/profile/page.tsx`: 유저 프로필 정보 표시 및 수정 폼
  - 선호 라켓 무게(3U/4U/5U), 장력(20~26 lbs) 선택 옵션 제공 및 Supabase DB 저장
- **테스트 (Test Procedure)**:
  - 🧪 **실행 방식**: 프로필 수정 페이지에서 선호 장비를 '4U / 24lbs'로 변경 후 [저장] 클릭
  - 🧪 **검증 기준**: 새로고침 후에도 수정된 정보가 남아있고 Supabase `profiles` DB에 업데이트됨을 확인

---

## 📌 Phase 4: 4주 완성 훈련 인터랙티브 타이머 & 체크리스트 개발

### taskList-4.1: Zustand 오프라인-퍼스트 훈련 스토어 구현
- **설명**: 훈련 진행 상황을 LocalStorage에 우선 기록하는 스토어 개발
- **작업 내용**:
  - `src/lib/store/useTrainingStore.ts`: `persist` 미들웨어를 적용한 Zustand 스토어 정의
  - 훈련 항목 체크/해제, 타이머 시간 기록, 온라인 시 Supabase Sync 메서드 작성
- **테스트 (Test Procedure)**:
  - 🧪 **실행 방식**: 브라우저 콘솔에서 Zustand action 호출 테스트
  - 🧪 **검증 기준**: 개발자 도구 **Application > Local Storage**에 `training-storage` 키로 상태가 즉시 반영되는지 확인

### taskList-4.2: 4주 훈련 루틴 체크리스트 & Supabase 동기화 UI (`/routine`)
- **설명**: 훈련 6번 매뉴얼 데이터 기반 주차별 체크리스트 작성
- **작업 내용**:
  - `src/app/routine/page.tsx`: 1주차~4주차 탭 전환 UI
  - 주차별 세부 루틴 항목(예: 제자리 빈스윙 100회 x 3세트) 체크박스 UI
  - 로그인 상태일 경우 체크 완료 시 Supabase `user_training_logs` 테이블로 동기화
- **테스트 (Test Procedure)**:
  - 🧪 **실행 방식**: 1주차 항목 2개 체크 후 페이지 새로고침 및 네트워크 탭 확인
  - 🧪 **검증 기준**: 새로고침 후에도 체크 상태가 유지되며, 네트워크 연결 시 Supabase `user_training_logs`에 INSERT/UPDATE 쿼리 전송 확인

### taskList-4.3: 인터랙티브 인터벌 타이머 컴포넌트 개발
- **설명**: 훈련 세트 시간 및 쉬는 시간 카운트다운 타이머
- **작업 내용**:
  - `src/components/timer/IntervalTimer.tsx`: 시작, 일시정지, 리셋 버튼
  - Web Audio API를 활용한 세트 종료 시 신호음(Beep/Chime) 재생 유틸 구현
- **테스트 (Test Procedure)**:
  - 🧪 **실행 방식**: 타이머 10초 설정 후 [시작] 버튼 클릭
  - 🧪 **검증 기준**: 10초 카운트다운 후 0초 도달 시 완료 소리(Beep)가 재생되고 휴식 모드로 자동 전환되는지 확인

---

## 📌 Phase 5: PWA 오프라인 통합 테스트 및 Vercel 배포

### taskList-5.1: PWA 오프라인 지원 및 캐싱 통합 테스트
- **설명**: 인터넷 연결이 끊긴 상태에서의 앱 동작 검증
- **작업 내용**:
  - Chrome DevTools Network 탭에서 `Offline` 모드 활성화
  - 6개 매뉴얼 페이지 접근 및 훈련 타이머 실행 테스트
- **테스트 (Test Procedure)**:
  - 🧪 **실행 방식**: DevTools > Network > **Offline** 체크 후 브라우저 새로고침
  - 🧪 **검증 기준**:
    1. 공룡 게임/네트워크 오류 화면이 아닌 앱 화면이 오프라인 캐시로 정상 출력
    2. 매뉴얼 6종 읽기 및 타이머 카운트다운이 오프라인 상태에서도 정상 동작

### taskList-5.2: Vercel 프로덕션 배포 및 최종 검증
- **설명**: Vercel에 프로젝트 연결 및 자동 배포
- **작업 내용**:
  - GitHub/GitLab 리포지토리 연동 및 Vercel 프로젝트 생성
  - Vercel 환경 변수 설정 (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`)
  - Production Build 실행
- **테스트 (Test Procedure)**:
  - 🧪 **실행 커맨드 / URL**: Vercel 배포 URL (예: `https://badminton-pwa.vercel.app`) 접속
  - 🧪 **검증 기준**:
    1. 스마트폰(iOS/Android) 브라우저 접속 시 "홈 화면에 앱 추가" 프롬프트 확인
    2. 회원가입/로그인, 6대 매뉴얼 조회, 훈련 루틴 체크리스트 및 타이머의 정상 동작 확인
