import type { AdStatus } from '@/constants/status';

export type ArchiveFormat = 'photo' | 'video';
export type StatusFilter = 'all' | AdStatus;

export type ArchivedAd = {
  date: string;
  format: ArchiveFormat;
  id: number;
  image: string;
  status: AdStatus;
  title: string;
};

export const ARCHIVE_FILTERS: ReadonlyArray<{ label: string; value: StatusFilter }> = [
  { label: '전체', value: 'all' },
  { label: '승인 대기중', value: 'pending' },
  { label: '보충 필요', value: 'supplement' },
  { label: '게시 완료', value: 'posted' },
];

export const ARCHIVED_ADS: readonly ArchivedAd[] = [
  { id: 1, format: 'photo', title: '전대 쭈꾸미', date: '2026.07.30', status: 'posted', image: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=960&q=85' },
  { id: 2, format: 'photo', title: '담양 쌍고숯불갈비', date: '2026.07.30', status: 'pending', image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=960&q=85' },
  { id: 3, format: 'photo', title: '득량만 오늘의 메뉴', date: '2026.07.28', status: 'supplement', image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=960&q=85' },
];
