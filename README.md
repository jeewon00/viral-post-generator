# 생성 서비스 (Creation Service)

AI를 활용한 바이럴 글 생성 웹서비스입니다. 타겟 유저 정보를 입력하면 커뮤니티에서 자연스럽게 바이럴될 수 있는 글을 자동으로 생성합니다.

## 주요 기능

- **타겟 기반 글 생성** — 연령대, 성별, 직업, 관심 분야 등 타겟 정보를 설정하면 해당 타겟에 맞는 바이럴 글 3개를 생성
- **다양한 바이럴 방식** — 후기형, 꿀팁형, 비교형, 질문형, 스토리텔링 중 선택
- **톤 설정** — 반말(기본), 존댓말, 유머, 감성, 직설 등 톤앤매너 설정
- **원클릭 복사** — 생성된 글을 바로 복사하여 커뮤니티에 게시

## 기술 스택

- **Frontend** — Next.js 16 (App Router), React, TypeScript, Tailwind CSS
- **Form** — react-hook-form
- **AI** — DeepSeek API

## 시작하기

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경 변수 설정

`.env.local` 파일을 생성하고 DeepSeek API 키를 입력합니다.

```
DEEPSEEK_API_KEY=your_api_key_here
```

API 키는 [platform.deepseek.com](https://platform.deepseek.com)에서 발급받을 수 있습니다.

### 3. 개발 서버 실행

```bash
npm run dev
```

[http://localhost:3000](http://localhost:3000)에서 확인할 수 있습니다.

### 4. 빌드

```bash
npm run build
npm start
```

## 프로젝트 구조

```
src/
├── app/
│   ├── api/generate/route.ts   # DeepSeek API 호출
│   ├── layout.tsx
│   ├── page.tsx
│   └── icon.svg                # 파비콘
├── components/
│   ├── ui/                     # RadioGroup, CheckboxGroup, SectionHeader, Spinner
│   ├── Header.tsx
│   ├── GenerateForm.tsx        # 3섹션 입력 폼
│   └── ResultPanel.tsx         # 결과 표시
├── constants/form-options.ts   # 폼 옵션 상수
└── types/form.ts               # FormData 타입
```
