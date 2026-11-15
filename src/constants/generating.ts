import type { GenerationProgress } from '@/apis/posttalk';
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

/** 생성에 실패해 홈으로 돌아갈 때 홈에 넘기는 표시. 홈이 안내 줄을 한 번 띄운다. */
export const GENERATION_FAILED_NOTICE = 'generation-failed';

/** 진행률을 묻는 간격. 백엔드가 2~3초를 권한다. */
export const POLL_INTERVAL_MS = 2500;

/**
 * 진행률 응답을 화면의 단계 번호로 바꾼다.
 * percent 가 있으면 단계 수로 구간을 나누고, 없으면 상태(queued · processing)로 짐작한다.
 */
export const stepIndexOf = (progress: GenerationProgress | null, stepCount: number): number => {
  if (!progress) return 0;
  if (typeof progress.percent === 'number') {
    return Math.min(stepCount - 1, Math.floor((progress.percent / 100) * stepCount));
  }
  return progress.status === 'processing' ? 1 : 0;
};
