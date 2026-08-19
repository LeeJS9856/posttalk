import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

import { getMerchantQr, type MerchantSession } from '@/apis/merchantQr';

type MerchantSessionContextValue = {
  errorMessage: string | null;
  isLoading: boolean;
  session: MerchantSession | null;
};

const MerchantSessionContext = createContext<MerchantSessionContextValue | null>(null);
const SESSION_STORAGE_KEY = 'posttalk-merchant-session';

const getQrToken = (): string | null => new URLSearchParams(window.location.search).get('qrToken');

const getStoredSession = (): MerchantSession | null => {
  const storedSession = sessionStorage.getItem(SESSION_STORAGE_KEY);
  if (!storedSession) return null;

  try {
    return JSON.parse(storedSession) as MerchantSession;
  } catch {
    sessionStorage.removeItem(SESSION_STORAGE_KEY);
    return null;
  }
};

export const MerchantSessionProvider = ({ children }: { children: ReactNode }): React.JSX.Element => {
  const [session, setSession] = useState<MerchantSession | null>(getStoredSession);
  const [isLoading, setIsLoading] = useState(() => Boolean(getQrToken()));
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const qrToken = getQrToken();
    if (!qrToken) {
      setIsLoading(false);
      return;
    }

    const controller = new AbortController();

    const loadMerchantSession = async (): Promise<void> => {
      try {
        const response = await getMerchantQr({ qrToken, signal: controller.signal });
        const { qr } = response.data;

        if (!qr.isAssigned || !qr.store) {
          throw new Error('QR 코드에 연결된 가게 정보가 없어요.');
        }

        const nextSession: MerchantSession = {
          qrToken: qr.qrToken,
          qrPayload: `posttalk://qr-login/${qr.qrToken}`,
          storeId: qr.store.id,
          marketName: qr.store.marketName,
          storeName: qr.store.storeName,
          submitterName: qr.store.ownerName ?? qr.store.storeName,
          submitterAffiliation: qr.store.storeName,
        };

        sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(nextSession));
        setSession(nextSession);
      } catch (error) {
        if (!(error instanceof DOMException && error.name === 'AbortError')) {
          sessionStorage.removeItem(SESSION_STORAGE_KEY);
          setSession(null);
          setErrorMessage(error instanceof Error ? error.message : 'QR 정보를 불러오지 못했어요.');
        }
      } finally {
        if (!controller.signal.aborted) setIsLoading(false);
      }
    };

    void loadMerchantSession();
    return () => controller.abort();
  }, []);

  const value = useMemo<MerchantSessionContextValue>(() => ({ errorMessage, isLoading, session }), [errorMessage, isLoading, session]);

  return <MerchantSessionContext.Provider value={value}>{children}</MerchantSessionContext.Provider>;
};

export const useMerchantSession = (): MerchantSessionContextValue => {
  const context = useContext(MerchantSessionContext);
  if (!context) throw new Error('useMerchantSession must be used within a MerchantSessionProvider.');

  return context;
};
