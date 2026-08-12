export type AdStatus = 'pending' | 'supplement' | 'posted';

export const STATUS_COPY: Record<AdStatus, string> = {
  pending: '승인 대기중',
  supplement: '보충 필요',
  posted: '게시 완료',
};
