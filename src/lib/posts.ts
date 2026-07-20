/**
 * design.pen 하이파이 페이지(01 Main / 02 Detail / 05 My Page)에 사용된 게시글 목업 데이터.
 * mediaClass는 디자인의 이미지 플레이스홀더 fill과 1:1 대응하는 프리미티브 토큰 유틸리티입니다.
 */
export interface Post {
  id: string;
  title: string;
  location: string;
  /** 이미지 플레이스홀더 배경 토큰 클래스 (bg-brand-100 등) — imageUrl 없을 때 폴백 */
  mediaClass?: string;
  /** 실사진 썸네일 URL (01 Main 카드 / 05 My Page 게시글) */
  imageUrl?: string;
  /** 상세 히어로 전용 이미지 URL (02 Detail Page) — 없으면 imageUrl 사용 */
  detailImageUrl?: string;
  bodyTitle: string;
  bodyText: string;
}

const BODY_TITLE = '오늘 이 식당 어때요?';
const BODY_TEXT =
  '신선한 채소와 매콤한 고추장이 균형 있게 어울려요. 점심 메뉴를 고르기 어려운 날에 부담 없이 추천하기 좋은 게시글입니다.';

export const popularPosts: Post[] = [
  {
    id: 'bibimbap',
    title: '비빔밥 맛집',
    location: '서울 강남구',
    mediaClass: 'bg-brand-100',
    imageUrl:
      'https://images.unsplash.com/photo-1652189689895-0f43754815ef?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    bodyTitle: BODY_TITLE,
    bodyText: BODY_TEXT,
  },
  {
    id: 'basil-pasta',
    title: '바질 파스타',
    location: '서울 구로구',
    mediaClass: 'bg-sage-100',
    imageUrl:
      'https://images.unsplash.com/photo-1589227365423-d87e646beaac?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    bodyTitle: BODY_TITLE,
    bodyText: BODY_TEXT,
  },
  {
    id: 'cream-latte',
    title: '크림 라떼',
    location: '서울 동대문구',
    mediaClass: 'bg-teal-100',
    imageUrl:
      'https://images.unsplash.com/photo-1497636577773-f1231844b336?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    bodyTitle: BODY_TITLE,
    bodyText: BODY_TEXT,
  },
  {
    id: 'strawberry-cake',
    title: '딸기 케이크',
    location: '서울 강동구',
    mediaClass: 'bg-amber-100',
    imageUrl:
      'https://images.unsplash.com/photo-1685614691757-bdeefeef24a2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    detailImageUrl:
      'https://images.unsplash.com/photo-1720275371273-0830b5424564?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    bodyTitle: BODY_TITLE,
    bodyText: BODY_TEXT,
  },
];

export const myPosts: Post[] = [
  {
    id: 'mandu',
    title: '철산역 뒤편 손만두집',
    location: '서울 강동구',
    imageUrl:
      'https://images.unsplash.com/photo-1681747941445-c0714e0a4592?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    bodyTitle: BODY_TITLE,
    bodyText: BODY_TEXT,
  },
  {
    id: 'kalguksu',
    title: '구로시장 새벽 칼국수',
    location: '서울 구로구',
    imageUrl:
      'https://images.unsplash.com/photo-1668665771959-b217076ddde3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    bodyTitle: BODY_TITLE,
    bodyText: BODY_TEXT,
  },
];

export function findPost(id: string): Post | undefined {
  return [...popularPosts, ...myPosts].find((post) => post.id === id);
}
