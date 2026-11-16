import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';

import {
  AUTH_STORAGE_KEY,
  GUEST_KEY_STORAGE_KEY,
  findAccount,
  findAccountByGuestKey,
  type ExhibitionAccount,
} from '@/constants/auth';

type AuthContextValue = {
  isSignedIn: boolean;
  /** 지금 로그인한 계정. 가게 정보를 계정별로 가르는 데 쓴다. */
  account: ExhibitionAccount | null;
  /** 맞으면 true. 틀리면 false 를 돌려주고 상태를 바꾸지 않는다. */
  signIn: (username: string, password: string) => boolean;
  signOut: () => void;
};

/** 시크릿 모드나 저장소가 막힌 기기에서는 읽기와 쓰기가 모두 던진다. */
const readStored = (): boolean => {
  try {
    // 키가 없으면 어느 보관함인지 정할 수 없다. 계정이 하나였던 시절에 남은 상태다.
    return (
      window.localStorage.getItem(AUTH_STORAGE_KEY) === 'true' &&
      Boolean(window.localStorage.getItem(GUEST_KEY_STORAGE_KEY))
    );
  } catch {
    return false;
  }
};

/** 로그인 상태와 작업 공간 키를 함께 남긴다. 키가 있어야 어느 보관함인지 정해진다. */
const writeStored = (guestKey: string | null): void => {
  try {
    if (guestKey) {
      window.localStorage.setItem(AUTH_STORAGE_KEY, 'true');
      window.localStorage.setItem(GUEST_KEY_STORAGE_KEY, guestKey);
    } else {
      window.localStorage.removeItem(AUTH_STORAGE_KEY);
      window.localStorage.removeItem(GUEST_KEY_STORAGE_KEY);
    }
  } catch {
    // 저장에 실패해도 이번 세션은 그대로 쓴다. 새로고침하면 다시 로그인한다.
  }
};

const AuthContext = createContext<AuthContextValue | null>(null);

const readAccount = (): ExhibitionAccount | null => {
  try {
    const key = window.localStorage.getItem(GUEST_KEY_STORAGE_KEY);
    return key ? (findAccountByGuestKey(key) ?? null) : null;
  } catch {
    return null;
  }
};

export const AuthProvider = ({ children }: { children: ReactNode }): React.JSX.Element => {
  const [isSignedIn, setIsSignedIn] = useState(readStored);
  const [account, setAccount] = useState<ExhibitionAccount | null>(readAccount);

  const signIn = useCallback((username: string, password: string): boolean => {
    const found = findAccount(username.trim(), password);
    if (!found) return false;

    writeStored(found.guestKey);
    setAccount(found);
    setIsSignedIn(true);
    return true;
  }, []);

  const signOut = useCallback(() => {
    writeStored(null);
    setAccount(null);
    setIsSignedIn(false);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({ isSignedIn, account, signIn, signOut }),
    [isSignedIn, account, signIn, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// oxlint-disable-next-line react/only-export-components -- 훅과 프로바이더가 같은 컨텍스트를 공유한다
export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider.');
  return context;
};
