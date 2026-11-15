import type { AdFormat } from '@/constants/home';

export type AdFormatOption = {
  id: AdFormat;
  label: string;
  /** 무엇을 찍고 무엇을 받는지. 형식의 차이를 한 줄로 알린다. 백엔드 명세의 장수 그대로다. */
  flow: string;
};

export const AD_FORMAT_OPTIONS: readonly AdFormatOption[] = [
  { id: 'card_news', label: '카드뉴스', flow: '사진 6장 → 카드 3장' },
  { id: 'reels', label: '릴스', flow: '영상 4개 → 13초 영상' },
];

export const DEFAULT_AD_FORMAT: AdFormat = 'card_news';
