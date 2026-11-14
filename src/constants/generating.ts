import type { AdFormat } from '@/constants/home';

export type GenerateStep = {
  key: string;
  label: string;
};

/** 마지막 단계만 포맷에 따라 갈린다. */
export const buildSteps = (format: AdFormat): GenerateStep[] => [
  { key: 'media', label: '사진 다듬기' },
  { key: 'script', label: '문구 얹기' },
  { key: 'render', label: format === 'reels' ? '영상으로 잇기' : '카드로 묶기' },
];

/**
 * 생성에 걸리는 시간. 아직 실측값이 아니다.
 * 생성 API 가 붙으면 진행률 응답이 단계를 알려주고, 이 값은 안내 문구에만 쓴다.
 */
export const ESTIMATED_SECONDS = 60;

/** 올린 재료를 넘기는 간격. */
export const SLIDE_INTERVAL_MS = 2600;

/** 생성 결과로 받을 광고 번호. 생성 API 가 붙기 전까지 쓰는 표본이다. */
export const SAMPLE_GENERATED_AD_ID = 'sample-1';
