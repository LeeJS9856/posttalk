export type AdStatus = 'pending' | 'supplement' | 'posted';

export const STATUS_COPY: Record<AdStatus, string> = {
  pending: '승인 대기중',
  supplement: '반려됨',
  posted: '게시 완료',
};
