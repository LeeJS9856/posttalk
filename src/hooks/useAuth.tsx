import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';

import { AUTH_STORAGE_KEY, FIXED_ACCOUNT } from '@/constants/auth';

type AuthContextValue = {
  isSignedIn: boolean;
  /** 맞으면 true. 틀리면 false 를 돌려주고 상태를 바꾸지 않는다. */
  signIn: (username: string, password: string) => boolean;
  signOut: () => void;
};

/** 시크릿 모드나 저장소가 막힌 기기에서는 읽기와 쓰기가 모두 던진다. */
const readStored = (): boolean => {
  try {
    return window.localStorage.getItem(AUTH_STORAGE_KEY) === 'true';
  } catch {
    return false;
  }
};

const writeStored = (value: boolean): void => {
  try {
    if (value) window.localStorage.setItem(AUTH_STORAGE_KEY, 'true');
    else window.localStorage.removeItem(AUTH_STORAGE_KEY);
  } catch {
    // 저장에 실패해도 이번 세션은 그대로 쓴다. 새로고침하면 다시 로그인한다.
  }
};

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }): React.JSX.Element => {
  const [isSignedIn, setIsSignedIn] = useState(readStored);

  const signIn = useCallback((username: string, password: string): boolean => {
    const matched =
      username === FIXED_ACCOUNT.username && password === FIXED_ACCOUNT.password;
    if (!matched) return false;

    writeStored(true);
    setIsSignedIn(true);
    return true;
  }, []);

  const signOut = useCallback(() => {
    writeStored(false);
    setIsSignedIn(false);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({ isSignedIn, signIn, signOut }),
    [isSignedIn, signIn, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// oxlint-disable-next-line react/only-export-components -- 훅과 프로바이더가 같은 컨텍스트를 공유한다
export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider.');
  return context;
};
