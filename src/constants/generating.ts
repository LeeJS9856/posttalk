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
 * 생성에 걸리는 시간. 운영 서버에서 카드뉴스 한 편이 약 58초 걸렸다(2026-11-15 실측).
 * 서버 진행률이 추정값(estimated)이면 이 시간을 기준으로 단계를 넘긴다.
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
 * - 서버가 실제 percent 를 주면 단계 수로 구간을 나눈다.
 * - 서버 percent 가 추정값이거나 없으면 흐른 시간으로 짐작한다. 서버는 끝날 때까지 50%(추정)만 보내서,
 *   그대로 쓰면 1분 내내 한 단계에 멈춰 보인다.
 * 둘 중 앞선 쪽을 쓰고, 마지막 단계는 완료 응답이 올 때까지 넘기지 않는다.
 */
export const stepIndexOf = (
  progress: GenerationProgress | null,
  stepCount: number,
  elapsedSeconds: number,
): number => {
  const last = stepCount - 1;
  const byTime = Math.floor((elapsedSeconds / ESTIMATED_SECONDS) * stepCount);
  const isRealPercent = typeof progress?.percent === 'number' && progress.estimated !== true;
  const byServer = isRealPercent
    ? Math.floor(((progress?.percent ?? 0) / 100) * stepCount)
    : progress?.status === 'processing'
      ? 1
      : 0;
  return Math.min(last, Math.max(byServer, byTime));
};
