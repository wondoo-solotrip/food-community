# 결제 규칙 (결제 SSOT)

결제와 관련된 **모든** 규칙(결제창 연동·환경변수·웹훅·결제 원장·결제취소·결제 내역·참여자 수)은 이 문서가 유일한 기준이다.
결제 코드를 추가·수정하기 전에 반드시 이 문서를 따르고, 규칙이 바뀌면 이 문서를 먼저 고친다.

## 현재 범위 (v1.3 — 웹훅 + 결제 원장 실기록)

| 영역 | 상태 |
| --- | --- |
| 상품 조회 | `product` 테이블 실데이터 (`src/lib/products.ts`) |
| 결제창 | **포트원 V2 실연동** — 카드(`CARD`) · 원화(`KRW`) 일반결제 |
| 웹훅 | **실연동** — `/api/portone/webhook` 서명 검증 + 단건조회 재확인 |
| 결제 기록 | **`payment` 테이블 실기록** (insert-only 원장, `src/lib/payments.ts`) |
| 참여자 수 | 원장 집계 — PAYMENT − CANCEL 행 수 |
| 결제취소 | `src/lib/paidEvents.ts` 메모리 목업 — 포트원 취소 API 미호출 |
| 결제·취소 내역 화면 | `src/lib/paidEvents.ts` 메모리 목업 (원장 미반영) |

## 포트원 결제창 (V2 브라우저 SDK)

- SDK 는 `@portone/browser-sdk/v2` 하나만 쓴다. V1(`IMP.*`) API 혼용 금지.
- 결제창 호출은 `src/lib/portone/payment.ts` 의 `requestEventPayment` **한 곳**에서만 한다. 화면 컴포넌트에서 `PortOne.requestPayment` 직접 호출 금지. 브라우저 SDK 라 클라이언트 컴포넌트에서만 import 한다.
- `paymentId` 는 매 시도마다 `crypto.randomUUID()` 로 새로 만든다. 이 값이 포트원 결제 건 ID 이자 원장의 `transaction_key` 이고, 서버 검증·취소 API 도 이 값으로 조회한다.
- `orderName`(상품명)·`totalAmount`(가격)는 항상 **DB 에서 조회한 `product` 값**을 쓴다. 상세 페이지 Server Component 가 `getProduct` 로 읽어 뷰 모델(`title`/`price`)로 내려준다. 표기 문자열(`priceLabel`)을 되파싱하거나 금액을 하드코딩하지 않는다.
- `customData` 로 `{ productId, userId }`(`PaymentCustomData` 타입)를 실어 보낸다. 웹훅이 단건조회 응답에서 이 값을 되읽어 결제 건을 상품·사용자와 잇는다. 그래서 **결제는 로그인 필수** — 미로그인이면 결제창을 열지 않고 안내 Toast 를 보여준다(상세 페이지가 `getCurrentUser` 로 userId 를 내려준다).
- `currency: 'KRW'` · `payMethod: 'CARD'` 고정. 다른 결제수단·화폐를 열려면 이 문서부터 고친다.
- `redirectUrl` 은 결제 완료 페이지(`/events/[id]/complete`)다.

## 결과 처리 (반환값·리다이렉트 두 흐름 모두 지원)

- `redirectUrl` 만 주고 `forceRedirect` 는 켜지 않는다 → PC 는 반환값(프로미스), 모바일은 리다이렉트로 결과가 온다. 호출부는 두 흐름을 모두 처리해야 한다.
- **반환값 흐름**: `payment.code !== undefined` 면 실패다(사용자가 결제창을 닫은 경우 포함) — 메시지를 바텀시트 안 `Toast(type="error")` 로 보여준다. 성공이면 `/events/[id]/complete?paymentId=...` 로 이동한다. 반환값이 `undefined` 로 리졸브되면 리다이렉트가 시작된 것 — 화면 상태를 건드리지 않는다.
- **리다이렉트 흐름**: 포트원이 `redirectUrl` 에 쿼리로 결과를 붙인다 — 성공 `?paymentId=`, 실패 `?code=&message=`.
- 완료 페이지(`/events/[id]/complete`)는 `code` 쿼리가 있으면 완료 화면을 그리지 않고 상세(`/events/[id]`)로 `redirect` 한다. 실패 사유 표기는 아직 없다 — 개선하려면 이 문서부터 고친다.
- 완료 페이지는 상품 정보만 보여준다(원장 조회 미연동). `paymentId` 쿼리는 아직 화면에서 쓰지 않는다.

## 결제 웹훅 (`/api/portone/webhook`)

- 수신점은 Route Handler `POST /api/portone/webhook` 하나다. 포트원 콘솔 > 결제알림(Webhook) 관리에 이 주소를 등록한다(웹훅 버전 **2024-04-25** · Content-Type `application/json`). 로컬 개발은 터널링 주소로 등록한다.
- **서명 검증 필수**: `@portone/server-sdk` 의 `Webhook.verify` 로 Standard Webhooks 서명을 검증한다(`PORTONE_WEBHOOK_SECRET`). 실패하면 400 으로 끊고 아무것도 기록하지 않는다.
- **페이로드를 신뢰하지 않는다**: 웹훅에서는 `paymentId` 만 꺼내고, 결제 내용은 반드시 단건조회 API(`getPayment`, `PORTONE_API_SECRET`)로 재확인한다(`syncPaymentLedger`).
- 상태 매핑: `PAID` → PAYMENT 행 기록. `CANCELLED`(전액취소) → PAYMENT 행을 먼저 보장한 뒤 CANCEL 행 기록(취소 웹훅이 먼저 오거나 결제 웹훅이 유실돼도 원장이 맞도록). `PARTIAL_CANCELLED` 는 **미지원** — 기록하지 않고 로그만 남긴다. 그 외 상태·모르는 `type`·빌링키 웹훅은 에러 없이 무시한다.
- **위조 방어**: 단건조회 결과의 `customData`(productId·userId, UUID 형식)와 DB 상품을 대조해 금액(`amount.total === product.price`)·화폐(`KRW`)·주문명(`orderName === product.name`)이 하나라도 다르면 기록하지 않는다(로그만 남긴다). 인증 결제 금액은 브라우저에서 조작될 수 있기 때문이다.
- 응답 규약: 검증 실패·위조 의심은 4xx/200 으로 끝내고, 일시 오류(DB 실패 등)만 5xx 를 돌려줘 포트원 재전송(최대 5회, exponential backoff)을 받는다.

## 결제 원장 (`payment` 테이블)

- **insert-only** 다: 행은 수정·삭제하지 않고 결제·취소 행을 쌓기만 한다. 기록·집계 코드는 `src/lib/payments.ts` **한 곳**에만 둔다.
- `type` 으로 구분한다: `'PAYMENT'`(결제) · `'CANCEL'`(취소). DB 제약 `payment_type_check` 가 강제한다.
- `transaction_key`(= 포트원 `paymentId`, uuid)가 한 결제 건의 **그룹 키**다. 한 건의 결제·취소 행이 이 값으로 묶인다.
- `amount` 부호 규칙: 결제 **+**, 취소 **-**. DB 제약 `payment_amount_sign_check` 가 강제한다. 값은 단건조회의 `amount.total` 을 쓴다(전액취소만 있어 취소 행은 `-amount.total`).
- **중복결제 검증(2중)**: ① 기록 전에 같은 `(transaction_key, type)` 행을 조회해 있으면 웹훅 재전송으로 보고 끝낸다. ② 동시 수신이 ①을 같이 통과해도 유니크 인덱스 `payment_transaction_key_type_key` 가 막는다 — insert 가 23505 로 실패하면 이미 기록된 것으로 처리한다.
- `payment_snapshot` 에 단건조회 응답 원본(jsonb)을 남기고 `payment.payment_snapshot_id` 가 가리킨다. 원장 insert 실패 시 방금 만든 스냅샷은 거둬들인다.
- RLS: `payment` · `payment_snapshot` 은 정책 없이 닫혀 있다. 웹훅은 사용자 세션이 없으므로 서비스 롤 클라이언트(`createSupabaseAdminClient`, `SUPABASE_SERVICE_ROLE_KEY`)로만 쓴다. 서비스 롤은 사용자 세션이 없는 서버 작업에만 쓰고, 요청 사용자 권한으로 처리할 수 있는 곳에는 쓰지 않는다.
- **참여자 수 = 해당 상품의 PAYMENT 행 수 − CANCEL 행 수**(`countParticipants`). 서비스 키 미설정이면 0 으로 접고 경고 로그만 남긴다(서버가 죽지 않게 하는 네이버 키 방식).

## 환경변수

- `NEXT_PUBLIC_PORTONE_STORE_ID` / `NEXT_PUBLIC_PORTONE_CHANNEL_KEY` — 결제창 식별자. 비밀값이 아니라서(포트원 콘솔 > 결제연동 > 연동 정보) 예외적으로 `NEXT_PUBLIC_` 을 쓴다. 접근은 `src/lib/portone/env.ts` 로만. 키가 없으면 null → 결제 버튼이 안내 Toast 로 알린다.
- `PORTONE_API_SECRET`(단건조회·취소용) / `PORTONE_WEBHOOK_SECRET`(웹훅 서명 검증용) — **서버 전용, `NEXT_PUBLIC_` 절대 금지**. 접근은 `src/lib/portone/serverEnv.ts` 로만 하고, 이 모듈은 `server-only` 다.
- `SUPABASE_SERVICE_ROLE_KEY` — 원장 기록·참여자 수 집계용 서비스 롤 키. 서버 전용.
- 테스트 채널 → 실결제 채널 전환은 코드가 아니라 env 값만 바꾼다. 웹훅 시크릿은 테스트/실연동 모드별로 따로 발급된다.

## 결제취소

- 마이페이지 `결제 취소` 는 확인 모달 → `src/lib/paidEvents.ts` 의 `cancelPayment` 로 **메모리에서** 옮길 뿐이다. 포트원 취소 API 는 호출하지 않는다. 새로고침하면 초기 목업으로 돌아온다.
- 단, 포트원 콘솔 등에서 **전액취소가 실제로 일어나면** `Transaction.Cancelled` 웹훅이 원장에 CANCEL 행을 기록하고 참여자 수에서 빠진다.
- 실 취소를 붙일 때: BFF(서버)에서 `POST https://api.portone.io/payments/{paymentId}/cancel` 을 `Authorization: PortOne {PORTONE_API_SECRET}` 인증으로 호출한다. 브라우저에서 직접 호출 금지. 부분취소는 열지 않는다(열려면 원장 부호 규칙부터 이 문서에서 다시 정한다).

## 화면 흐름·상품 규칙

- 유료 상품(강연·모임)은 `product` 테이블 실데이터다. 조회는 `src/lib/products.ts`(`listProducts` / `getProduct`) → `/api/products`(GET) · `/api/products/[id]`(GET). 등록·수정 API 는 없다 — 상품은 운영진이 DB 에 직접 넣는다.
- `product` 는 RLS 로 보호된다: `status = 'Public'` 인 행만 공개 조회(`product_select_public`), 쓰기 정책 없음. 조회 쿼리도 `.eq('status', 'Public')` 을 함께 건다.
- 상품 이미지는 `product-image` 버킷의 `image_path_main`(메인 배너) / `image_path_detail`(상세 히어로) 경로만 저장하고, 주소는 `SUPABASE_STORAGE_URL` 로 조립한다(`publicStorageUrl`).
- 모임 일시(`event_at`)는 UTC 로 저장되고 표기는 항상 KST — 날짜·금액 표기는 `src/lib/eventFormat.ts`(순수 모듈)에서만 만든다.
- 화면: 메인 상단 배너(`/` → `/events/[id]`, 최신 공개 상품 1건) → 모임 상세 + 결제 바텀시트(`/events/[id]`) → 포트원 결제창 → 결제 완료(`/events/[id]/complete`) → 마이페이지 `결제 내역` 탭(`/mypage?tab=payments`). 상세·완료 페이지는 Server Component 가 `getProduct` 로 읽어 표기까지 끝낸 뷰 모델을 클라이언트 뷰에 넘긴다.
- 메인 배너는 `image_path_main` 이미지 한 장을 통짜로 채운다(2:1 비율, 최대 높이 320px 가운데 크롭). 정원 게이지는 `src/components/ui/ProgressBar.tsx`.
- 정원이 다 차면(`remaining <= 0`) 결제 버튼이 비활성화된다(PRD v1.1). 참여자 수는 원장 집계라 웹훅이 도착해야 갱신된다.
- 마이페이지 탭은 `?tab=posts|payments|cancellations` 로 딥링크한다. 결제·취소 내역은 아직 `src/lib/paidEvents.ts` 목업이다 — 실제 결제 건은 내역 화면에 나타나지 않는다.

## 향후 작업

- 결제 완료 페이지·마이페이지 결제/취소 내역을 원장(`payment`) 실데이터로 교체(`paidEvents.ts` 목업 제거).
- 마이페이지 `결제 취소` 를 포트원 취소 API 실호출로 교체(BFF 경유, 위 결제취소 규칙).
- 완료 페이지에서 `paymentId` 로 원장/단건조회를 확인해 "결제 확인 중 → 확정" 상태 표기(웹훅 도착 전 새로고침 대비).
