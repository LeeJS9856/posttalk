export const NAV_ITEMS = [
  { id: 'home', label: '홈', path: '/' },
  { id: 'create', label: '광고', path: '/create' },
  { id: 'archive', label: '보관함', path: '/archive' },
  { id: 'my', label: '마이', path: '/my' },
] as const;

export type NavItemId = (typeof NAV_ITEMS)[number]['id'];
