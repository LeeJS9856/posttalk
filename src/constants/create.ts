import type { AdFormat } from '@/constants/home';

export type AdFormatOption = {
  id: AdFormat;
  label: string;
  /** 버튼 이름 아래 한 줄 설명. 무엇을 받는지. */
  description: string;
};

export const AD_FORMAT_OPTIONS: readonly AdFormatOption[] = [
  { id: 'card_news', label: '카드뉴스', description: '사진으로 넘겨 보는 카드 4장' },
  { id: 'reels', label: '릴스', description: '영상에 자막·음악 넣은 세로 영상' },
];

export const DEFAULT_AD_FORMAT: AdFormat = 'card_news';
