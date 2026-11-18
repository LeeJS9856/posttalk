import { useSyncExternalStore } from 'react';

/**
 * 홈 화면 설치 상태.
 *
 * `beforeinstallprompt` 는 화면이 뜨자마자, 리액트가 올라오기 전에 한 번만 날아온다.
 * 그래서 컴포넌트가 아니라 이 파일이 읽히는 순간 잡아 둔다. 놓치면 설치 창을 열 길이 없다.
 */

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
};

/** `ready` 설치 창을 띄울 수 있다 · `manual` 브라우저 메뉴로 안내해야 한다 · `installed` 이미 앱이다 */
export type InstallState = 'ready' | 'manual' | 'installed';

let deferred: BeforeInstallPromptEvent | null = null;
let installed = false;

const listeners = new Set<() => void>();
const emit = (): void => listeners.forEach((listen) => listen());

if (typeof window !== 'undefined') {
  window.addEventListener('beforeinstallprompt', (event) => {
    // 브라우저가 알아서 띄우는 배너를 막는다. 체험 중에 끼어들면 관람객이 길을 잃는다.
    event.preventDefault();
    deferred = event as BeforeInstallPromptEvent;
    emit();
  });

  window.addEventListener('appinstalled', () => {
    deferred = null;
    installed = true;
    emit();
  });
}

/** 홈 화면에서 연 앱인지. iOS 는 display-mode 대신 navigator.standalone 을 쓴다. */
const isStandalone = (): boolean => {
  if (typeof window === 'undefined') return false;
  if (window.matchMedia('(display-mode: standalone)').matches) return true;
  return (navigator as Navigator & { standalone?: boolean }).standalone === true;
};

const subscribe = (listen: () => void): (() => void) => {
  listeners.add(listen);
  return () => listeners.delete(listen);
};

const getSnapshot = (): InstallState => {
  if (installed || isStandalone()) return 'installed';
  return deferred ? 'ready' : 'manual';
};

/** 설치 창을 띄우고 관람객이 받아들였는지 돌려준다. 한 번 쓴 이벤트는 다시 못 쓴다. */
export const promptInstall = async (): Promise<boolean> => {
  const event = deferred;
  if (!event) return false;

  deferred = null;
  emit();

  await event.prompt();
  const { outcome } = await event.userChoice;
  return outcome === 'accepted';
};

/** 사파리는 설치 창을 열어 주지 않는다. 공유 메뉴로 안내해야 해서 따로 가린다. */
export const isIosSafari = (): boolean => {
  if (typeof navigator === 'undefined') return false;
  const ua = navigator.userAgent;
  if (/iphone|ipad|ipod/i.test(ua)) return true;
  // 아이패드는 맥인 척한다. 손가락이 닿는 맥은 없으니 이걸로 가린다.
  return navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1;
};

export const useInstallState = (): InstallState =>
  useSyncExternalStore(subscribe, getSnapshot, () => 'manual' as const);
