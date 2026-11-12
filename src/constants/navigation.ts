export const NAV_ITEMS = [
  { id: 'home', label: '홈', path: '/' },
  { id: 'create', label: '광고', path: '/create' },
  { id: 'archive', label: '보관함', path: '/archive' },
  { id: 'my', label: '마이', path: '/my' },
] as const;

export type NavItemId = (typeof NAV_ITEMS)[number]['id'];

import type { NavigateFunction } from 'react-router-dom';

/**
 * 앞 화면으로 돌아간다.
 *
 * navigate(경로) 로 돌아가면 기록이 쌓여, 돌아온 화면에서 뒤로 가기를 누를 때
 * 방금 빠져나온 화면이 다시 나온다. 기록을 하나 물러서는 것으로 처리한다.
 * 주소를 직접 쳐서 들어와 물러설 기록이 없을 때만 경로로 간다.
 */
export const goBackTo = (navigate: NavigateFunction, fallback: string): void => {
  if (window.history.length > 1) {
    navigate(-1);
    return;
  }
  navigate(fallback, { replace: true });
};
