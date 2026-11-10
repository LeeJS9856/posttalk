import photoSample from '@/assets/photo-ex1.jpg';
import videoSample from '@/assets/video-ex.mp4';

import type { AdFormat } from '@/constants/home';

export type AdFormatOption = {
  id: AdFormat;
  label: string;
  description: string;
  sample: string;
  sampleKind: 'image' | 'video';
};

/** 결과물 샘플은 이전 프로젝트의 산출물을 쓴다. 콘셉트별 샘플이 나오면 교체한다. */
export const AD_FORMAT_OPTIONS: readonly AdFormatOption[] = [
  {
    id: 'card_news',
    label: '카드뉴스',
    description: '사진 여러 장으로',
    sample: photoSample,
    sampleKind: 'image',
  },
  {
    id: 'reels',
    label: '릴스',
    description: '짧은 영상으로',
    sample: videoSample,
    sampleKind: 'video',
  },
];

export const DEFAULT_AD_FORMAT: AdFormat = 'card_news';
