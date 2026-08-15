/**
 * 포트원 V2 결제창 식별자 접근 지점.
 *
 * storeId·channelKey 는 결제창을 띄우기 위한 공개 식별자라 브라우저에 노출돼도 된다
 * (네이버 지도 Client ID 와 같은 성격 — 포트원 콘솔 > 결제연동 > 연동 정보에서 확인).
 * 그래서 예외적으로 NEXT_PUBLIC_ 접두사를 쓰고, 이 모듈은 클라이언트에서 import 해도 된다.
 *
 * 반대로 V2 API Secret(결제 단건조회·취소·웹훅 검증용)은 절대 여기에 두지 않는다 —
 * 서버 전용 env(PORTONE_API_SECRET)로만 쓴다. 규칙: .claude/rules/payment.md
 */
export interface PortonePaymentKeys {
  storeId: string;
  channelKey: string;
}

export const portoneEnv = {
  /** 키가 하나라도 비어 있으면 null — 호출부가 설정 안내 메시지로 바꿔 준다(네이버 키와 같은 방식). */
  get paymentKeys(): PortonePaymentKeys | null {
    const storeId = process.env.NEXT_PUBLIC_PORTONE_STORE_ID;
    const channelKey = process.env.NEXT_PUBLIC_PORTONE_CHANNEL_KEY;
    if (!storeId || !channelKey) return null;
    return { storeId, channelKey };
  },
};
