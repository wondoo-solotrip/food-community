import 'server-only';

/**
 * 포트원 V2 서버 전용 비밀키 접근 지점 — 결제 단건조회·웹훅 서명 검증에 쓴다.
 * 절대 클라이언트에 노출 금지(NEXT_PUBLIC_ 금지)라서 공개 식별자용 `env.ts` 와 파일을 분리했다.
 * 규칙: .claude/rules/payment.md
 */
function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`환경변수 ${name} 가 설정되지 않았습니다. .env.local 을 확인하세요.`);
  }
  return value;
}

export const portoneServerEnv = {
  /** V2 API Secret — 결제 단건조회(`Authorization: PortOne {secret}`) 인증 */
  get apiSecret() {
    return required('PORTONE_API_SECRET');
  },
  /** 웹훅 시크릿 — Standard Webhooks 서명 검증(포트원 콘솔 > 결제알림(Webhook) 관리에서 발급) */
  get webhookSecret() {
    return required('PORTONE_WEBHOOK_SECRET');
  },
};
