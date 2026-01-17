# CLAUDE.md - 12주의 법칙 대시보드

이 파일은 Claude Code가 이 프로젝트를 이해하는 데 사용됩니다.

## 프로젝트 개요

브라이언 P. 모건의 "12주의 법칙(12 Week Year)" 방법론을 기반으로 한 개인 생산성 대시보드입니다.

## 기술 스택

- **프레임워크**: Next.js 16 (App Router)
- **언어**: TypeScript
- **스타일링**: Tailwind CSS v4
- **UI 컴포넌트**: shadcn/ui
- **상태 관리**: Zustand
- **패키지 관리**: pnpm

## 프로젝트 구조

```
src/
├── app/                    # Next.js App Router 페이지
├── components/
│   ├── atoms/              # 기본 UI 요소 (GuideTooltip, SectionHeader)
│   ├── molecules/          # 조합된 컴포넌트 (각종 Card 컴포넌트)
│   ├── organisms/          # 페이지 수준 컴포넌트 (Dashboard)
│   └── ui/                 # shadcn/ui 컴포넌트
├── stores/                 # Zustand 스토어
├── types/                  # TypeScript 타입 정의
└── lib/                    # 유틸리티 함수
mocks/                      # 목업 데이터
```

## 주요 명령어

- `pnpm dev` - 개발 서버 시작
- `pnpm build` - 프로덕션 빌드
- `pnpm lint` - 린트 검사

## 12주 법칙 핵심 개념

- **12주 사이클**: 1년 대신 12주를 하나의 단위로 사용
- **비전 & 목표**: 감정적으로 연결된 1-3개의 핵심 목표
- **주간 계획**: 목표를 주간 단위 행동으로 분해
- **일일 실행**: 매일 핵심 3가지 행동 집중
- **주간 점수판**: 리드 지표(선행)와 래그 지표(후행) 추적
- **85% 실행률**: 성공의 기준

## 코드 컨벤션

- 컴포넌트: PascalCase (예: VisionCard.tsx)
- 함수/변수: camelCase
- 타입: PascalCase, interface 우선 사용
- 파일명: 컴포넌트는 PascalCase, 그 외는 camelCase

## 스타일 가이드

- 미니멀한 디자인 유지
- Tailwind 유틸리티 클래스 사용
- 색상: gray 톤 기반, 포인트 색상은 blue, green, orange
- 간격: Tailwind spacing scale 사용 (gap-4, p-4 등)
