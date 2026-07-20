# UI 작업 지침

Storybook = 디자인 SSOT.

- 모든 UI 작업 전 `src/stories/` 확인 → 기존 스토리/컴포넌트 재사용.
- 컴포넌트: `src/components/ui/`, `src/components/foundation/`.
- 토큰: `src/tokens/`, `src/styles/tokens.css`. 하드코딩 값 금지.
- 기존 컴포넌트로 불가할 때만 신규 생성 → 즉시 `src/stories/ui/*.stories.tsx` 추가.
- 스토리에 없는 variant/size/state 임의 생성 금지.
- 스토리와 구현 불일치 시 스토리 기준.
