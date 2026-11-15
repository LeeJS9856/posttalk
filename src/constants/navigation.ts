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

/**
 * 이만큼 아무도 만지지 않으면 처음으로 돌아간다. 관람객이 중간에 떠나면
 * 다음 관람객이 앞사람의 입력과 사진이 남은 화면에서 시작하게 된다.
 */
export const IDLE_RESET_MS = 90_000;

/**
 * 오래 두어도 처음으로 돌리지 않는 화면.
 * - 홈·로그인: 이미 처음이다.
 * - 생성 대기: 관람객이 화면만 보며 기다린다. 떠나면 결과를 놓친다.
 * - 마이: 운영자가 가게 정보를 고치는 곳이다.
 */
export const IDLE_EXEMPT_PATHS: readonly string[] = ['/', '/login', '/create/generating'];
export const IDLE_EXEMPT_PREFIXES: readonly string[] = ['/my'];
