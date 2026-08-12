import type { AdStatus } from '@/constants/status';

export type ReviewStatus = Exclude<AdStatus, 'posted'>;

export const DEMO_REVIEW_ADS: ReadonlyArray<{ id: number; status: ReviewStatus }> = [
  { id: 1, status: 'pending' },
  { id: 2, status: 'supplement' },
];

export const REVIEW_DESCRIPTION: Record<ReviewStatus, string> = {
  pending: '운영팀에서 내용을 확인하고 있어요',
  supplement: '사진을 한 장 더 올려주세요',
};
