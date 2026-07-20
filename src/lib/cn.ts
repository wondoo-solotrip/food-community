/** 조건부 클래스명 결합 — falsy 값은 제외합니다. */
export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ');
}
