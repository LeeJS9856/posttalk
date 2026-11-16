import type { AdFormat } from '@/constants/home';

export type AdFormatOption = {
  id: AdFormat;
  label: string;
};

export const AD_FORMAT_OPTIONS: readonly AdFormatOption[] = [
  { id: 'card_news', label: '카드뉴스' },
  { id: 'reels', label: '릴스' },
];

export const DEFAULT_AD_FORMAT: AdFormat = 'card_news';
