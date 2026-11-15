import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import { isAbortError } from '@/apis/api';
import { openGuestSession } from '@/apis/posttalk';
import { useAuth } from '@/hooks/useAuth';
import { useShop } from '@/hooks/useShop';

type WorkspaceStatus = 'idle' | 'loading' | 'ready' | 'error';

type WorkspaceContextValue = {
  /** 게스트 작업 공간 번호. 열리기 전에는 null 이다. */
  storeId: string | null;
  status: WorkspaceStatus;
  error: string | null;
  /** 열기에 실패했을 때 다시 연다. 자동으로 다시 시도하지 않는다. */
  retry: () => void;
};

const WorkspaceContext = createContext<WorkspaceContextValue | null>(null);

/**
 * 게스트 작업 공간. 로그인하면 고정 키로 작업 공간을 열고 storeId 를 들고 있는다.
 * 모든 기기가 같은 키를 써서 어느 기기에서든 같은 보관함이 보인다.
 */
export const WorkspaceProvider = ({ children }: { children: ReactNode }): React.JSX.Element => {
  const { isSignedIn } = useAuth();
  const { profile } = useShop();

  const [storeId, setStoreId] = useState<string | null>(null);
  const [status, setStatus] = useState<WorkspaceStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    if (!isSignedIn) {
      setStoreId(null);
      setStatus('idle');
      setError(null);
      return;
    }

    const controller = new AbortController();
    setStatus('loading');
    setError(null);

    openGuestSession(
      {
        storeName: profile.name || undefined,
        marketName: profile.marketName || undefined,
      },
      controller.signal,
    )
      .then((session) => {
        setStoreId(session.storeId);
        setStatus('ready');
      })
      .catch((cause: unknown) => {
        if (isAbortError(cause)) return;
        setStatus('error');
        setError(cause instanceof Error ? cause.message : '작업 공간을 열지 못했어요.');
      });

    return () => controller.abort();
    // 가게 이름은 작업 공간을 처음 열 때만 보낸다. 고칠 때마다 다시 열지 않는다.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSignedIn, attempt]);

  const retry = useCallback(() => setAttempt((count) => count + 1), []);

  const value = useMemo<WorkspaceContextValue>(
    () => ({ storeId, status, error, retry }),
    [storeId, status, error, retry],
  );

  return <WorkspaceContext.Provider value={value}>{children}</WorkspaceContext.Provider>;
};

// oxlint-disable-next-line react/only-export-components -- 훅과 프로바이더가 같은 컨텍스트를 공유한다
export const useWorkspace = (): WorkspaceContextValue => {
  const context = useContext(WorkspaceContext);
  if (!context) throw new Error('useWorkspace must be used within WorkspaceProvider.');
  return context;
};
