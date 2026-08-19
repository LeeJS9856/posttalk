import archiveIcon from '@/assets/icons/archive.svg?raw';
import campaignIcon from '@/assets/icons/campaign.svg?raw';
import homeIcon from '@/assets/icons/home.svg?raw';
// import myIcon from '@/assets/icons/my.svg?raw';

export const NAV_ITEMS = [
  { label: '홈', icon: homeIcon, path: '/' },
  { label: '광고 제작', icon: campaignIcon, path: '/create' },
  { label: '보관함', icon: archiveIcon, path: '/archive' },
  // 나중에 마이 페이지를 추가할 때 다시 활성화합니다.
  // { label: '마이', icon: myIcon, path: '/my' },
] as const;
