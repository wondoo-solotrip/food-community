import type { PlaceSelection } from '@/lib/placeSelection';

/**
 * 게시글 등록 화면(`/register`)이 장소 등록 화면(`/register/place`)에 다녀오는 동안
 * 입력값을 붙들고 있는 임시 보관소.
 *
 * 두 화면은 별도 라우트라 컴포넌트 상태가 유지되지 않는다. 장소 선택값만이라면
 * `placeSelection.ts` 처럼 쿼리스트링으로 넘기면 되지만, 선택해 둔 사진은 `File` 객체라
 * URL 로도 sessionStorage 로도 옮길 수 없다. 클라이언트 라우팅(`router.push`) 동안에는
 * 모듈이 그대로 살아 있으므로 여기에 담아 두고 돌아왔을 때 그대로 복원한다.
 *
 * 새로고침하면 사라진다(파일 핸들을 되살릴 방법이 없다). 그때는 빈 폼으로 시작한다.
 * 브라우저에서만 쓰는 순수 모듈이라 `server-only` 를 붙이지 않는다.
 */
export interface PlaceDraft {
  title: string;
  content: string;
  /** 미리보기 URL 은 화면이 다시 만든다(회수 책임도 화면에 있다). 여기엔 원본 파일만 둔다. */
  photos: File[];
  /** 지도 정보(장소명·주소·좌표). 아직 장소를 고르지 않았으면 null 이고, 등록은 막힌다. */
  location: PlaceSelection | null;
}

const EMPTY_DRAFT: PlaceDraft = { title: '', content: '', photos: [], location: null };

let draft: PlaceDraft | null = null;

/** 보관된 초안. 없으면(첫 진입·새로고침 직후) null. */
export function readPlaceDraft(): PlaceDraft | null {
  return draft;
}

export function writePlaceDraft(next: PlaceDraft): void {
  draft = next;
}

/** 일부만 갱신한다. 보관된 초안이 없으면 빈 초안 위에 얹는다. */
export function patchPlaceDraft(patch: Partial<PlaceDraft>): void {
  draft = { ...(draft ?? EMPTY_DRAFT), ...patch };
}

/** 등록을 마쳤거나 사용자가 등록을 취소했을 때 비운다. */
export function clearPlaceDraft(): void {
  draft = null;
}
