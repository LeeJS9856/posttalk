import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { IDLE_EXEMPT_PATHS, IDLE_EXEMPT_PREFIXES, IDLE_RESET_MS } from '@/constants/navigation';
import { useAdDraft } from '@/hooks/useAdDraft';

/** 화면을 만졌다고 보는 입력. 스크롤만 해도 사람이 있는 것이다. */
const ACTIVITY_EVENTS = ['pointerdown', 'keydown', 'touchstart', 'scroll', 'input'] as const;

const isExempt = (pathname: string): boolean =>
  IDLE_EXEMPT_PATHS.includes(pathname) ||
  IDLE_EXEMPT_PREFIXES.some((prefix) => pathname.startsWith(prefix));

/**
 * 공용 기기에서 관람객이 중간에 떠나면 처음으로 되돌린다. 화면을 그리지 않는다.
 * 갤러리 선택 창이 떠 있는 동안은 페이지가 포커스를 잃는다. 그동안은 세지 않는다.
 */
const IdleReset = (): null => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { resetDraft } = useAdDraft();

  useEffect(() => {
    if (isExempt(pathname)) return;

    let timer: number | undefined;
    const stop = (): void => window.clearTimeout(timer);
    const restart = (): void => {
      stop();
      if (document.visibilityState === 'hidden' || !document.hasFocus()) return;
      timer = window.setTimeout(() => {
        resetDraft();
        void navigate('/', { replace: true });
      }, IDLE_RESET_MS);
    };

    restart();
    ACTIVITY_EVENTS.forEach((name) =>
      window.addEventListener(name, restart, { passive: true, capture: true }),
    );
    window.addEventListener('focus', restart);
    window.addEventListener('blur', stop);
    document.addEventListener('visibilitychange', restart);

    return () => {
      stop();
      ACTIVITY_EVENTS.forEach((name) =>
        window.removeEventListener(name, restart, { capture: true }),
      );
      window.removeEventListener('focus', restart);
      window.removeEventListener('blur', stop);
      document.removeEventListener('visibilitychange', restart);
    };
  }, [pathname, navigate, resetDraft]);

  return null;
};

export default IdleReset;
