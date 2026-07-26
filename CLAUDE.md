# UI 작업 지침

Storybook = 디자인 SSOT.

- 모든 UI 작업 전 `src/stories/` 확인 → 기존 스토리/컴포넌트 재사용.
- 컴포넌트: `src/components/ui/`, `src/components/foundation/`.
- 토큰: `src/tokens/`, `src/styles/tokens.css`. 하드코딩 값 금지.
- 기존 컴포넌트로 불가할 때만 신규 생성 → 즉시 `src/stories/ui/*.stories.tsx` 추가.
- 스토리에 없는 variant/size/state 임의 생성 금지.
- 스토리와 구현 불일치 시 스토리 기준.

# 해상도 / 반응형 지침

- 콘텐츠 컨테이너: `mx-auto w-full`, 좌우 `px-5`.
- 최대 너비: 그리드/리스트 페이지 `max-w-7xl`(1280px), 폼 `max-w-2xl`, 로그인 `max-w-md`.
- 카드 그리드: `grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4`.
- 브레이크포인트: 기본(모바일) 2열 → `md` 3열 → `xl` 4열.
- 1280px 초과 시 그리드 확장 금지, 중앙 정렬 유지.

# PWA 지침

설치형(홈화면) 배포만 한다. 서비스워커·오프라인·푸시알림은 **넣지 않는다**.

| 대상 | 파일 | 비고 |
| --- | --- | --- |
| 설치 정보 | `src/app/manifest.ts` | `/manifest.webmanifest` 로 나간다. link 태그는 Next 가 자동으로 붙인다 |
| 메타 태그 | `src/app/layout.tsx` | `appleWebApp`(스플래시 포함) · `viewport.themeColor` |
| iOS 스플래시 목록 | `src/lib/pwa/appleSplash.ts` | **생성 파일**. 손으로 고치지 말 것 |
| 아이콘·스플래시 생성 | `scripts/generate-pwa-assets.py` | `npm run pwa:assets` (macOS 전용: `sips` + Pillow) |
| 원본 로고 | `logo.svg` (repo 루트) | 2048×2048. 주황 심볼 + 워드마크 |

- 자산은 전부 `logo.svg` 한 장에서 나온다. 로고가 바뀌면 파일만 갈아 끼우고 `npm run pwa:assets` 를 다시 돌린다. 개별 PNG 를 손으로 만들지 않는다.
- 생성물: `src/app/favicon.ico`(16·32·48·64) · `src/app/icon.svg` · `src/app/apple-icon.png`(180) · `public/icons/icon-{192,512}.png` · `public/icons/icon-maskable-{192,512}.png` · `public/splash/apple-splash-*.png`(기기 20종 × 세로·가로).
- 홈화면 아이콘은 **심볼만** 쓴다(워드마크는 작은 크기에서 뭉갠다). 스플래시는 로고 전체를 가운데 놓는다.
- `background_color` · `theme_color` · 스플래시 배경은 모두 `#FFFDF7`(= `--color-background-screen`)로 맞춰 둔다. 스플래시 → 첫 화면에서 배경이 튀지 않게 하려는 것이니 앱 배경색을 바꾸면 이 값들도 같이 바꾼다.
- favicon.ico 안의 PNG 는 RGBA 여야 한다. RGB 로 넣으면 Next 빌드가 `unable to decode image data` 로 죽는다.
- iOS 는 manifest 로 스플래시를 만들어 주지 않아 기기 해상도마다 `apple-touch-startup-image` 를 붙여야 한다. 새 기기가 나오면 `APPLE_DEVICES` 에 (CSS 폭, 높이, DPR) 을 추가하고 스크립트를 다시 돌린다. 목록에 없는 기기는 배경색만 보인다(동작에는 지장 없음).
- 서비스워커가 없어서 Android Chrome 은 정식 설치 프롬프트(WebAPK) 대신 `홈 화면에 추가` 바로가기만 제안할 수 있다. 의도된 선택이다.

# 데이터 접근 지침 (BFF)

모든 Supabase API는 **Next.js BFF를 경유**해서만 호출한다.

- 클라이언트 컴포넌트에서 `@supabase/supabase-js` 직접 import 금지. 브라우저 번들에 Supabase 클라이언트가 포함되면 안 된다.
- 모든 DB/Auth/Storage 접근은 서버 측 코드에서만 수행: Route Handler(`src/app/api/**/route.ts`), Server Action, Server Component.
- 클라이언트는 자체 API 라우트(`/api/*`)만 `fetch` 한다. Supabase URL을 클라이언트에서 직접 호출 금지.
- Supabase 클라이언트 생성은 `src/lib/supabase/server.ts` 한 곳으로 통일하고, 각 라우트에서 개별 생성 금지.
- 서비스 키(`SUPABASE_SERVICE_ROLE_KEY`) 등 비밀값은 서버 전용 env로만 사용. `NEXT_PUBLIC_*` 접두사로 노출 금지.
- 도메인별 데이터 접근 로직은 `src/lib/`의 서버 모듈(예: `src/lib/posts.ts`)에 두고, Route Handler는 얇게 유지(검증 → 서버 모듈 호출 → 응답).
- 응답/에러 형태는 API 라우트 레이어에서 정규화하여 반환하고, Supabase 원본 에러를 그대로 클라이언트에 노출하지 않는다.
- 소셜 로그인 콜백도 동일 원칙: OAuth 코드 교환과 세션 쿠키 설정은 서버 Route Handler에서 처리한다.

## 구성 (이미 구축됨 — 새로 만들지 말고 재사용)

| 계층 | 파일 | 역할 |
| --- | --- | --- |
| 클라이언트 → BFF | `src/lib/api/client.ts` | `apiFetch()` — `/api/*` 외 호출 차단 |
| 응답 정규화 | `src/lib/api/response.ts` | `handleRoute` / `jsonOk` / `ApiError` |
| 세션 갱신 | `src/proxy.ts`, `src/lib/supabase/session.ts` | 요청마다 토큰 갱신 |
| Supabase 클라이언트 | `src/lib/supabase/server.ts` | 유일한 생성 지점 (`server-only`) |
| 환경변수 | `src/lib/supabase/env.ts` | `SUPABASE_URL` / `SUPABASE_PUBLISHABLE_KEY` / `SUPABASE_STORAGE_BUCKET` / `SUPABASE_PROFILE_IMAGE_BUCKET` / `SUPABASE_STORAGE_URL` |
| Storage 주소 | `src/lib/supabase/storage.ts` | 경로 → 공개 URL 조립 (`publicStorageUrl`) |
| DB 타입 | `src/lib/supabase/database.types.ts` | Supabase 생성 타입 (스키마 변경 시 재생성) |
| 도메인 모듈 | `src/lib/auth.ts`, `src/lib/profile.ts`, `src/lib/places.ts`, `src/lib/placeSearch.ts`, `src/lib/reverseGeocode.ts` | 실제 쿼리는 여기에만 |
| 클라이언트 세션 | `src/hooks/useSession.ts` | `/api/auth/session` 만 호출하는 로그인 상태 훅 |
| 네이버 키 | `src/lib/naver/env.ts` | `naverSearchEnv`(`NAVER_SEARCH_CLIENT_ID`/`_SECRET`) · `naverMapsEnv`(`NAVER_MAP_CLIENT_SECRET`) — 모두 서버 전용 |
| 장소 선택 상태 | `src/lib/placeSelection.ts` | 장소 등록 ↔ 검색 화면이 주고받는 `name`/`addr`/`lat`/`lng` (순수 모듈) |
| 게시글 초안 | `src/lib/placeDraft.ts` | 게시글 등록 ↔ 장소 등록 화면을 오갈 때 제목·내용·사진(`File`)·선택 장소를 붙들어 두는 메모리 보관소 |
| 좌표 → 주소 | `src/hooks/useReverseGeocode.ts` | `/api/reverse-geocode` 만 호출하는 디바운스 조회 훅 |

Route Handler: `/api/auth/google`(POST) · `/api/auth/callback`(GET) · `/api/auth/session`(GET·DELETE) · `/api/profile`(GET·PATCH) · `/api/places`(GET·POST) · `/api/places/[id]`(GET·PATCH·DELETE) · `/api/place-search`(GET) · `/api/reverse-geocode`(GET).

- 새 도메인 추가 시: `src/lib/<domain>.ts`(서버 모듈) → `src/app/api/<domain>/route.ts`(얇은 핸들러) 순서.
- `src/lib/posts.ts`는 디자인 목업 데이터다. 실데이터는 `src/lib/places.ts`(`place` 테이블)를 쓴다.
- 신규 가입 시 `public.profile` 행은 DB 트리거(`on_auth_user_created`)가 생성한다. 앱 코드에서 따로 만들지 않는다.
- `place` / `place_image` / `profile` 은 RLS 로 보호된다: 조회는 공개, 쓰기는 본인 소유 행만.
- 맛집 삭제는 **소프트 삭제**다. `place.deleted_at` 에 시각만 기록하고 행·사진·Storage 파일은 남긴다. RLS(`place_select_active` / `place_image_select_active`)가 삭제된 글과 그 사진을 조회에서 제외하며, `src/lib/places.ts` 의 모든 조회도 `.is('deleted_at', null)` 을 함께 건다(새 조회를 추가할 때도 반드시 붙일 것).
- 소프트 삭제는 일반 UPDATE 가 아니라 `soft_delete_place(place_id)` RPC(SECURITY DEFINER, `authenticated` 만 실행 가능, 함수 안에서 `auth.uid()` 로 본인 글 확인)로 수행한다. Postgres 가 UPDATE 후의 새 행에도 SELECT 정책을 적용해서, `deleted_at` 을 찍는 순간 그 행이 스스로에게 안 보여 RLS 위반(42501)이 나기 때문이다.
- 프로필 이미지: `profile-image` 버킷에 `uuidv4.<ext>` 로 업로드하고 `profile.image_path` 에는 파일 경로만 저장한다. 주소는 `SUPABASE_STORAGE_URL` 로 조립한다.
- `PATCH /api/profile` 은 이미지가 있으면 `multipart/form-data`(`nickname`, `image`), 없으면 JSON(`{ nickname }`) 을 받는다. 이미지 교체 시 이전 파일은 서버가 삭제한다.
- 맛집 사진: `place-image` 버킷에 `uuidv4.<ext>` 로 업로드하고 `place_image.image_path` 에는 파일 경로만 저장한다. 게시글은 항상 사진 1~3장을 유지한다.
- `POST /api/places` 는 `multipart/form-data`(`title`, `content`, `images` n개 + 지도 정보 `name`/`address`/`lat`/`lng`). 제목 필수 · 내용 10자 이상 · 지도 정보 네 값 모두 필수다.
- `PATCH /api/places/[id]` 는 본인 글만 수정한다. 사진을 바꾸면 `multipart/form-data`(`keepImageIds` n개 + `images` n개 → 유지 + 신규로 교체), 글만 고치면 JSON(`{ title?, content?, location? }`). 지도 정보는 multipart 면 `name`/`address`/`lat`/`lng` 필드로, JSON 이면 `location` 객체로 보낸다.
- `DELETE /api/places/[id]` 는 본인 글만 소프트 삭제한다(`{ id }` 반환). 이미 삭제된 글은 조회 단계에서 404 다. 마이페이지 `내가 쓴 글` 의 X 버튼 → 확인 모달이 진입점이다.
- 폼 파싱 헬퍼는 `src/lib/api/form.ts` 에 모아 둔다(라우트는 값만 꺼내고 검증은 도메인 모듈이 한다).

## 지도 정보 (필수값)

- 게시글의 지도 정보는 `place` 의 `name`(장소명) · `address`(지번주소) · `lat` · `lng` 네 컬럼이다. **네 값은 항상 함께 있거나 함께 없다.**
- 도메인 모델에서는 `Place.location: PlaceLocation | null` 한 덩어리로만 다룬다. 화면에서 `place.address` 처럼 개별 컬럼을 꺼내 쓰지 않는다.
- 등록·수정 시 네 값이 모두 있어야 통과한다. 검증은 `src/lib/places.ts` 의 `normalizePlaceLocation` 한 곳에서만 하고, 라우트는 값만 넘긴다.
- 검증은 이미지 업로드보다 **먼저** 돌린다. 값이 모자란 요청 때문에 Storage 에 고아 파일이 올라가지 않게 하기 위해서다.
- 수정(`updatePlace`)에서 `location` 을 보내면 네 값을 모두 채워야 한다(일부만 바꾸는 부분 수정 불가). 컬럼 하나만 갱신하면 DB 제약에 걸린다.
- 위치가 없는 글(지도 연동 이전 글)은 `location` 없이 수정할 수 없다 — 고치는 김에 채우게 막아 둔다.
- DB 제약: `place_map_location_complete`(네 값 all-or-nothing + 위경도 범위) · `place_address_not_blank`. `address` 의 `등록 대기중` 기본값은 제거됐다.
- 지도 연동 이전에 등록된 행(`name`/`lat`/`lng` NULL, `address = '등록 대기중'`)이 남아 있어 컬럼 자체는 nullable 이다. 좌표를 지어내지 않으려고 그대로 뒀고, 화면에서는 `위치 미등록` 으로 표시하며 상세의 지도 섹션이 숨겨진다.
- 등록 플로우는 `/register`(제목·내용·사진) → `/register/place`(지도) → `/register` 로 되돌아온다. 두 화면 사이의 입력값은 `src/lib/placeDraft.ts` 가 붙들어 둔다(사진 `File` 은 쿼리스트링·sessionStorage 로 옮길 수 없어서다). 새로고침하면 초안이 사라지고 빈 폼으로 시작한다.
- 상세 화면(`/posts/[id]`)의 미니 지도는 `NaverMap` 에 DB 좌표를 그대로 넘겨 기본 마커를 세운다(등록 화면과 달리 `centerPin` 을 쓰지 않는다).

## 장소 검색 (네이버 지역검색)

- `GET /api/place-search?query=` 가 NCP API Hub 지역검색(`https://naverapihub.apigw.ntruss.com/search/v1/local`)을 서버에서 호출한다. 인증키는 헤더(`X-NCP-APIGW-API-KEY-ID` / `X-NCP-APIGW-API-KEY`)로만 보내고 브라우저에 노출하지 않는다.
- 응답의 `mapx`(경도) / `mapy`(위도) 는 WGS84 를 1e7 배한 정수라 `src/lib/placeSearch.ts` 에서 `/1e7` 로 나눠 `lat`/`lng` 로 정규화한다. 화면에서는 항상 `lat`/`lng` 만 쓴다. `title` 의 `<b>` 강조 태그도 여기서 제거한다.
- 지역검색은 한 번에 최대 5건(`display`)까지만 준다. 결과 0건은 에러가 아니라 직접입력 화면의 진입 조건이다.
- 선택 결과는 `/register/place?name=&addr=&lat=&lng=` 쿼리로 장소 등록 화면에 돌려준다. 두 화면은 별도 라우트라 컴포넌트 상태가 유지되지 않으므로 `src/lib/placeSelection.ts` 의 `parsePlaceSelection`/`placeSelectionQuery` 로만 값을 주고받는다.
- 검색 결과가 없어 장소명을 직접 입력한 경우엔 `name` 만 교체하고 주소·좌표는 직전 선택값(없으면 `DEFAULT_PLACE_SELECTION` = 서울시청)을 유지한다. 그 뒤 장소 등록 화면에서 지도를 움직여 위치를 직접 잡을 수 있다.

## 리버스 지오코딩 (좌표 → 주소)

- 장소 등록 화면(`/register/place`)의 지도는 **핀고정 + 지도이동** 방식이다. 핀은 화면 정중앙에 붙박이라 `핀 위치 = 지도 중심`이고, 좌표는 이 화면에서 바뀔 수 있다. `NaverMap` 의 `centerPin` 을 켜면 네이버 기본 마커 대신 이 방식으로 동작한다.
- 중심 좌표는 `idle`(이동·확대가 모두 멎은 뒤 1회) 이벤트에서만 올려보낸다. 드래그 중 매 프레임 호출을 피하고, 소수점 7자리로 반올림해 투영 왕복에서 생기는 끝자리 잡음을 없앤다.
- 부모가 돌려준 좌표가 prop 으로 되돌아왔을 때 다시 `setCenter` 하면 `이동 → idle → 이동` 이 반복돼 지도가 튄다. 그래서 `NaverMap` 은 현재 중심과 prop 이 같으면(오차 1e-7) 옮기지 않고, 호출부도 같은 좌표면 상태를 그대로 둔다.
- `GET /api/reverse-geocode?lat=&lng=` 가 네이버 지도 REST(`https://maps.apigw.ntruss.com/map-reversegeocode/v2/gc`)를 서버에서 호출한다. `coords` 는 **`경도,위도`** 순서다(위도가 먼저가 아니다).
- 주소는 지번(`orders=addr`)만 쓴다. `region.area1~area4`(시/도 → 리)에 `land` 의 번지(`number1[-number2]`, `type === '2'` 면 `산` 접두)를 합쳐 한 줄로 만든다. 조립은 `src/lib/reverseGeocode.ts` 에서만 한다.
- 주소가 없는 좌표(바다 위 등, `status.code === 3`)는 에러가 아니라 빈 주소로 내려보내고 화면이 안내 문구를 고른다.
- 인증키는 `maps.js` 와 같은 Maps Application 이지만 REST 는 Client Secret 이 필요하다. `NAVER_MAP_CLIENT_SECRET`(서버 전용)을 쓰고, Client ID 는 안 넣으면 `NEXT_PUBLIC_NAVER_MAP_CLIENT_ID` 를 그대로 쓴다. 해당 API 를 구독하지 않은 키로 호출하면 401(`Permission Denied — A subscription to the API is required`)이 난다.
