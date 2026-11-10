export const NAV_ITEMS = [
  { id: 'home', label: '홈', path: '/' },
  { id: 'create', label: '광고', path: '/create' },
  { id: 'archive', label: '보관함', path: '/archive' },
  { id: 'my', label: '마이', path: '/my' },
] as const;

export type NavItemId = (typeof NAV_ITEMS)[number]['id'];

/** 이번 범위에서 화면을 만들지 않는 메뉴. 진입 대신 안내 문구를 띄운다. */
export const UNBUILT_PATHS: readonly string[] = ['/my'];

export const UNBUILT_NOTICE = '준비 중인 메뉴예요.';
