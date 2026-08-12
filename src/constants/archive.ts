import type { AdStatus } from '@/constants/status';

export type ArchiveFormat = 'photo' | 'video';
export type StatusFilter = 'all' | AdStatus;

export type ArchivedAd = {
  date: string;
  format: ArchiveFormat;
  id: number;
  images: readonly string[];
  status: AdStatus;
  title: string;
  videoSrc?: string;
};

export const ARCHIVE_FILTERS: ReadonlyArray<{ label: string; value: StatusFilter }> = [
  { label: '전체', value: 'all' },
  { label: '승인 대기중', value: 'pending' },
  { label: '보충 필요', value: 'supplement' },
  { label: '게시 완료', value: 'posted' },
];

export const ARCHIVED_ADS: readonly ArchivedAd[] = [
  {
    id: 1,
    format: 'photo',
    title: '전대 쭈꾸미',
    date: '2026.07.30',
    status: 'posted',
    images: [
      'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=960&q=85',
      'https://images.unsplash.com/photo-1559847844-5315695dadae?auto=format&fit=crop&w=960&q=85',
      'https://images.unsplash.com/photo-1562565652-a0d8f0c59eb4?auto=format&fit=crop&w=960&q=85',
    ],
  },
  {
    id: 2,
    format: 'photo',
    title: '담양 쌍고숯불갈비',
    date: '2026.07.30',
    status: 'pending',
    images: [
      'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=960&q=85',
      'https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=960&q=85',
      'https://images.unsplash.com/photo-1574484284002-952d92456975?auto=format&fit=crop&w=960&q=85',
    ],
  },
  {
    id: 3,
    format: 'photo',
    title: '득량만 오늘의 메뉴',
    date: '2026.07.28',
    status: 'supplement',
    images: [
      'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=960&q=85',
      'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=960&q=85',
    ],
  },
  {
    id: 4,
    format: 'video',
    title: '득량만 매장 이야기',
    date: '2026.07.26',
    status: 'posted',
    images: [],
    videoSrc: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
  },
];
