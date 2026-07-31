# 🏸 배드민턴 입문 가이드 & 4주 훈련 루틴 PWA (spec.md)

## 1. 프로젝트 개요 (Overview)

 본 사양서(spec.md)는 배드민턴 입문자를 위한 **기초 매뉴얼 조회** 및 **4주 완성 훈련 루틴 타이머/체크리스트**를 제공하는 **PWA(Progressive Web App)** 애플리케이션의 기능 및 사양을 정의합니다.

- **개발 방식**: SDD (Spec-Driven Development / 명세 기반 개발)
- **앱 형태**: PWA (오프라인 지원 및 모바일 웹 앱 설치 가능)
- **데이터베이스 & 인증**: Supabase (PostgreSQL, Auth)
- **배포 플랫폼**: Vercel

---

## 2. 기술 스택 (Tech Stack)

| 구분 | 기술 / 도구 | 비고 |
| :--- | :--- | :--- |
| **Framework** | Next.js 14+ (App Router) | React 기반, Vercel 최적화 및 SSR/Client 캐싱 |
| **PWA** | Next.js PWA (Serwist / Custom Service Worker) | 오프라인 캐싱, `manifest.json` 제공 |
| **Backend / DB** | Supabase | Supabase Auth (이메일/비밀번호), Postgres Database |
| **Styling** | Vanilla CSS / CSS Modules & CSS Variables | 스포티 모던 다크 테마, 네온 그린 포인트 (`#00FF66`, `#121212`) |
| **Deployment** | Vercel | Automatic CI/CD |

---

## 3. 핵심 사용자 경험 & 디자인 시스템 (Design System)

- **디자인 테마**: **스포티 모던 다크 테마 (Sporty Modern Dark)**
  - Background: `#0D1117` (Deep Dark) / `#161B22` (Card Dark)
  - Primary Accent: `#00FF66` (Neon Green / Shuttlecock Energy)
  - Secondary Accent: `#00E5FF` (Cyan Neon)
  - Text: `#F0F6FC` (High Contrast White) / `#8B949E` (Muted Gray)
- **UI/UX 특성**:
  - 모바일 퍼스트(Mobile-First) 뷰포트 레이아웃
  - 하단 고정 스티키 네비게이션 바 (홈, 매뉴얼, 훈련 타이머, 마이페이지)
  - 훈련 타이머 실행 시 스포티한 인터랙티브 그래픽 및 세트 알림

---

## 4. 상세 기능 명세 (Functional Requirements)

### F-01: 6대 배드민턴 기초 매뉴얼 콘텐츠 시스템
- **설명**: 제공된 6개의 마크다운 기반 문서의 콘텐츠를 카테고리별로 최적화된 UI로 제공.
- **포함 매뉴얼**:
  1. **장비 및 그립**: 라켓(무게/밸런스/샤프트), 거트 장력, 전용화, 이스턴/백핸드 그립 Visual Guide
  2. **풋워크 및 스텝**: 준비 자세, 6방향 스텝, 스플릿 스텝, 섀도 풋워크
  3. **기본 스트로크**: 하이클리어, 드라이브, 드롭샷, 스매시, 헤어핀
  4. **서브 및 리시브**: 숏서브/롱서브, 리시브 스탠스 및 카운터
  5. **경기 규칙 및 매너**: 점수판 계산법(21점 라모), 코트 라인, 매너 수칙
  6. **4주 훈련 루틴**: 1주차~4주차 단계별 훈련 목표 및 일일 루틴
- **특징**: 오프라인 상태에서도 6개 매뉴얼 전 항목 조회 가능.

### F-02: 4주 완성 훈련 루틴 타이머 & 일일 체크리스트
- **설명**: 6번 매뉴얼(훈련 루틴)을 바탕으로 한 실제 인터랙티브 훈련 가이드.
- **주요 기능**:
  - **주차별 훈련 선택**: 1주차(그립&빈스윙) ~ 4주차(실전 패턴)
  - **인터랙티브 타이머/스톱워치**: 훈련 시간(예: 30분, 1분 x 5세트 등) 인터벌 타이머 기능
  - **일일 체크리스트**: 당일 완료한 훈련 항목 체크 (예: 제자리 빈스윙 100회 x 3세트 완료)
  - **Supabase 동기화**: 로그인 유저의 일별 훈련 달성 기록을 Supabase DB에 자동 저장

### F-03: Supabase 이메일/비밀번호 회원가입 및 로그인 (Auth)
- **설명**: 사용자 데이터의 동기화 및 훈련 일지 개별 관리를 위한 인증 기능.
- **주요 기능**:
  - 이메일 / 비밀번호 회원가입 & 로그인
  - 프로필 관리 (닉네임, 선호 라켓/장력 설정)
  - 로그인 상태 유지 및 세션 관리 (Supabase Client/Server Auth)

### F-04: PWA 오프라인 지원 및 설치 가능성 (A2HS)
- **설명**: 네트워크 환경이 불안정한 체육관에서도 동작하는 PWA.
- **주요 기능**:
  - **Service Worker 오프라인 캐싱**: 정적 웹 자원 및 6개 매뉴얼 데이터 캐싱
  - **`manifest.json`**: 앱 아이콘, 스플래시 화면, standalone 테마 컬러 정의
  - **홈 화면에 추가 (Add to Home Screen)** 안내 banner/button 지원

---

## 5. 데이터베이스 스키마 명세 (Supabase Database)

### 5.1 `profiles` (사용자 프로필 테이블)
```sql
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  nickname TEXT,
  preferred_racket_weight TEXT, -- 예: '4U'
  preferred_tension TEXT,       -- 예: '24 lbs'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
```

### 5.2 `user_training_logs` (훈련 루틴 수행 기록 테이블)
```sql
CREATE TABLE public.user_training_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  week_number INT NOT NULL,     -- 1, 2, 3, 4주차
  routine_date DATE NOT NULL,   -- 훈련 날짜
  completed_items JSONB NOT NULL DEFAULT '[]'::jsonb, -- 완료한 세부 루틴 ID 목록
  total_duration_seconds INT DEFAULT 0, -- 총 수행 시간(초)
  memo TEXT,                    -- 당일 훈련 메모
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
```

---

## 6. 비기능적 요구사항 (Non-Functional Requirements)

1. **오프라인 우선 (Offline-First)**:
   - 네트워크 연결이 끊어져도 6개 배드민턴 매뉴얼과 인터랙티브 타이머 기본 동작이 차단되지 않아야 함.
2. **성능 & 렌더링**:
   - 모바일 기기에서의 60fps 인터랙션 (타이머 카운트다운, 스텝 애니메이션)
   - Vercel Edge/CDN을 통한 빠른 초기 로딩 speed index < 1.5s
3. **보안 & 접근 제어**:
   - Supabase RLS (Row Level Security) 적용으로 타인의 훈련 기록 접근 차단.

---

## 7. SDD (Spec-Driven Development) 다음 단계 안내

본 `spec.md` 작성이 완료되면 다음 단계인 `plan.md` (아키텍처 및 구현 계획)와 `tasks.md` (단계별 작업 태스크 목록) 문서 작성을 진행합니다.
