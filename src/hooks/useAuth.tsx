import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';

const LOGIN_STORAGE_KEY = 'posttalk-login-session';

type AuthContextValue = {
  isLoggedIn: boolean;
  login: (id: string) => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

const getInitialLoginState = (): boolean => {
  try {
    return Boolean(window.localStorage.getItem(LOGIN_STORAGE_KEY));
  } catch {
    return false;
  }
};

export const AuthProvider = ({ children }: { children: ReactNode }): React.JSX.Element => {
  const [isLoggedIn, setIsLoggedIn] = useState(getInitialLoginState);

  const value = useMemo<AuthContextValue>(() => ({
    isLoggedIn,
    login: (id) => {
      window.localStorage.setItem(LOGIN_STORAGE_KEY, JSON.stringify({ id }));
      setIsLoggedIn(true);
    },
  }), [isLoggedIn]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider.');

  return context;
};
