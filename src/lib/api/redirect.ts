/**
 * 외부 도메인으로의 오픈 리다이렉트를 막기 위해 앱 내부 경로만 허용한다.
 * (`//evil.com`, `https://evil.com` 등은 모두 기본값으로 대체)
 */
export function safeNextPath(value: string | null | undefined, fallback = '/'): string {
  if (!value) return fallback;
  if (!value.startsWith('/') || value.startsWith('//')) return fallback;
  return value;
}
