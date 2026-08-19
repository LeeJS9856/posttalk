import type { AdStatus } from '@/constants/status';

export type ArchiveFormat = 'photo' | 'video';
export type StatusFilter = 'all' | AdStatus;

export type ArchivedAd = {
  caption?: string;
  date: string;
  format: ArchiveFormat;
  id: string;
  images: readonly string[];
  status: AdStatus;
  title: string;
  thumbnailUrl?: string;
};

export const ARCHIVE_FILTERS: ReadonlyArray<{ label: string; value: StatusFilter }> = [
  { label: '전체', value: 'all' },
  { label: '승인 대기중', value: 'pending' },
  { label: '반려됨', value: 'supplement' },
  { label: '게시 완료', value: 'posted' },
];
