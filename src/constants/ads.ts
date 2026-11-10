import food from '@/assets/food.webp';
import photoEx1 from '@/assets/photo-ex1.jpg';
import photoEx2 from '@/assets/photo-ex2.jpg';
import photoEx3 from '@/assets/photo-ex3.jpg';
import photoEx4 from '@/assets/photo-ex4.jpg';
import videoEx from '@/assets/video-ex.mp4';
import type { AdFormat } from '@/constants/home';

export type AdStatus = 'unpublished' | 'published' | 'failed';

export const AD_STATUS_LABEL: Record<AdStatus, string> = {
  unpublished: '아직 안 올렸어요',
  published: '올렸어요',
  failed: '만들지 못했어요',
};

export type AdDetail = {
  adId: string;
  title: string;
  format: AdFormat;
  status: AdStatus;
  caption: string;
  /** 카드뉴스의 카드들. 릴스는 비운다. */
  cards: string[];
  /** 릴스 영상. 카드뉴스는 비운다. */
  videoUrl?: string;
  /** 올린 날짜. 올린 광고만 있다. */
  publishedAt?: string;
  /** 올라간 게시물 주소. 올린 광고만 있다. */
  postUrl?: string;
};

/**
 * 광고 상세 조회 API 가 붙기 전까지 쓰는 표본.
 * 이전 프로젝트의 결과물 샘플을 그대로 쓴다.
 */
export const SAMPLE_AD_DETAILS: readonly AdDetail[] = [
  {
    adId: 'sample-1',
    title: '창억떡',
    format: 'card_news',
    status: 'unpublished',
    caption:
      '매일 아침 직접 쪄내는 떡, 창억떡집에서 만나보세요 🧧\n#창억떡 #떡집 #동네맛집',
    cards: [photoEx1, photoEx2, photoEx3, photoEx4, food],
  },
  {
    adId: 'sample-2',
    title: '버터쿠키',
    format: 'reels',
    status: 'unpublished',
    caption: '버터를 아끼지 않고 구웠어요 🍪\n#버터쿠키 #수제쿠키',
    cards: [],
    videoUrl: videoEx,
  },
  {
    adId: 'sample-3',
    title: '소금빵',
    format: 'card_news',
    status: 'published',
    caption: '겉은 바삭 속은 촉촉한 소금빵 🥐\n#소금빵 #동네빵집',
    cards: [photoEx3, photoEx1, photoEx2],
    publishedAt: '2026-11-10',
    postUrl: 'https://www.instagram.com/',
  },
  {
    adId: 'sample-4',
    title: '쑥떡',
    format: 'reels',
    status: 'published',
    caption: '봄 쑥으로 빚은 쑥떡 🌿\n#쑥떡 #떡집',
    cards: [],
    videoUrl: videoEx,
    publishedAt: '2026-11-08',
    postUrl: 'https://www.instagram.com/',
  },
];

export const findAdDetail = (adId: string | undefined): AdDetail | undefined =>
  SAMPLE_AD_DETAILS.find((ad) => ad.adId === adId);

/** 2026-11-10 을 11월 10일로. 연도는 전시 기간 안이라 적지 않는다. */
export const formatPublishedAt = (value: string): string => {
  const [, month, day] = value.split('-');
  return `${Number(month)}월 ${Number(day)}일`;
};
