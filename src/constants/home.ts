import photoEx1 from '@/assets/photo-ex1.jpg';
import photoEx2 from '@/assets/photo-ex2.jpg';
import photoEx3 from '@/assets/photo-ex3.jpg';
import photoEx4 from '@/assets/photo-ex4.jpg';

export type AdFormat = 'card_news' | 'reels';

export type HomeAd = {
  adId: string;
  title: string;
  format: AdFormat;
  thumbnailUrl: string;
};

export const AD_FORMAT_LABEL: Record<AdFormat, string> = {
  card_news: '카드뉴스',
  reels: '릴스',
};

/**
 * 광고 목록 API 가 붙기 전까지 쓰는 표본.
 * 이전 프로젝트의 결과물 샘플 이미지를 그대로 쓴다.
 */
export const SAMPLE_ADS: readonly HomeAd[] = [
  { adId: 'sample-1', title: '창억떡', format: 'card_news', thumbnailUrl: photoEx1 },
  { adId: 'sample-2', title: '버터쿠키', format: 'reels', thumbnailUrl: photoEx2 },
  { adId: 'sample-3', title: '소금빵', format: 'card_news', thumbnailUrl: photoEx3 },
  { adId: 'sample-4', title: '쑥떡', format: 'reels', thumbnailUrl: photoEx4 },
];

export const HOME_AD_PREVIEW_COUNT = 4;
