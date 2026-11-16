import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';

import { isAbortError } from '@/apis/api';
import { getArchive, type ApiAdType } from '@/apis/posttalk';
import { fromArchiveItem, type AdItem } from '@/constants/ads';
import { useWorkspace } from '@/hooks/useWorkspace';

type LoadStatus = 'loading' | 'ready' | 'error';

/** 보관함이 한 번에 돌려주는 최대 개수. */
const ARCHIVE_LIMIT = 50;
const MEDIA_TYPES: readonly ApiAdType[] = ['photo', 'video'];

/**
 * 받아 둔 목록을 다시 받지 않고 그대로 쓰는 시간.
 * 결과 주소는 서명 URL 이고 유효기간이 60분이라, 그보다 훨씬 짧게 잡아 만료를 만나지 않게 한다.
 */
const STALE_MS = 60_000;

type Cached = {
  storeId: string;
  ads: AdItem[];
  /** 받은 시각. 오래됐는지 재는 데 쓴다. */
  loadedAt: number;
};

type AdsContextValue = {
  ads: AdItem[];
  status: LoadStatus;
  error: string | null;
  /** 지금 바로 다시 받는다. 실패 화면의 다시 시도에 쓴다. */
  reload: () => void;
  /** 오래됐을 때만 조용히 다시 받는다. 화면에 들어올 때 부른다. */
  revalidate: () => void;
  /** 받아 둔 것을 낡은 것으로 표시한다. 광고를 새로 만든 뒤에 부른다. */
  invalidate: () => void;
};

const newestFirst = (a: AdItem, b: AdItem): number =>
  (b.createdAt ?? '').localeCompare(a.createdAt ?? '');

const AdsContext = createContext<AdsContextValue | null>(null);

/**
 * 작업 공간의 광고 전체. 홈·보관함·마이가 같은 목록을 본다.
 *
 * 화면마다 따로 받으면 탭을 옮길 때마다 2초를 기다린다. 서버가 요청 하나에 1.8초를 쓰는데
 * 그 시간은 항목 수와 무관해 프론트가 줄일 수 없다. 그래서 한 번 받은 것을 같이 쓰고,
 * 들어올 때마다 오래됐을 때만 뒤에서 새로 받는다. 받아 둔 것이 있으면 기다리지 않고 그걸 먼저 그린다.
 */
export const AdsProvider = ({ children }: { children: ReactNode }): React.JSX.Element => {
  const { storeId, status: workspaceStatus, error: workspaceError, retry } = useWorkspace();

  const [cached, setCached] = useState<Cached | null>(null);
  const [error, setError] = useState<string | null>(null);
  const inFlight = useRef<AbortController | null>(null);

  useEffect(() => () => inFlight.current?.abort(), []);

  const load = useCallback(async (id: string): Promise<void> => {
    inFlight.current?.abort();
    const controller = new AbortController();
    inFlight.current = controller;

    try {
      const results = await Promise.all(
        MEDIA_TYPES.map((mediaType) =>
          getArchive({ storeId: id, mediaType, status: 'all', limit: ARCHIVE_LIMIT }, controller.signal),
        ),
      );
      const merged = results
        .flatMap((result) => result.items ?? [])
        .filter((item) => Boolean(item.submissionId))
        .map(fromArchiveItem)
        .sort(newestFirst);

      setCached({ storeId: id, ads: merged, loadedAt: Date.now() });
      setError(null);
    } catch (cause: unknown) {
      if (isAbortError(cause)) return;
      // 받아 둔 것이 있으면 지우지 않는다. 낡은 목록이 빈 화면보다 낫다.
      setError(cause instanceof Error ? cause.message : '광고를 불러오지 못했어요.');
    }
  }, []);

  const fresh = cached && cached.storeId === storeId ? cached : null;

  // 작업 공간이 열리면 한 번 받는다. 서버와 맞추는 일이라 이펙트가 맞는 자리다.
  useEffect(() => {
    if (!storeId) return;
    if (cached?.storeId === storeId) return;
    // oxlint-disable-next-line react/set-state-in-effect -- 상태는 응답이 온 뒤에 바뀐다. 동기 호출이 아니다
    void load(storeId);
  }, [storeId, cached?.storeId, load]);

  const reload = useCallback(() => {
    if (workspaceStatus === 'error') {
      retry();
      return;
    }
    if (storeId) void load(storeId);
  }, [workspaceStatus, retry, storeId, load]);

  const invalidate = useCallback(() => {
    setCached((current) => (current ? { ...current, loadedAt: 0 } : current));
  }, []);

  /**
   * 화면이 들어올 때마다 불린다. 호출 쪽이 이펙트에서 부르므로 함수 정체가 바뀌면 안 되고,
   * 안에서 보는 값은 늘 최신이어야 해서 ref 로 한 겹 감싼다.
   */
  const revalidateRef = useRef<() => void>(() => {});
  useEffect(() => {
    revalidateRef.current = () => {
      if (!storeId) return;
      if (fresh && Date.now() - fresh.loadedAt < STALE_MS) return;
      void load(storeId);
    };
  });

  const revalidate = useCallback(() => revalidateRef.current(), []);

  const value = useMemo<AdsContextValue>(() => {
    if (workspaceStatus === 'error') {
      return { ads: [], status: 'error', error: workspaceError, reload, revalidate, invalidate };
    }
    if (fresh) {
      // 받아 둔 것이 있으면 뒤에서 다시 받는 중이어도 그대로 보여 준다.
      return { ads: fresh.ads, status: 'ready', error: null, reload, revalidate, invalidate };
    }
    if (error) {
      return { ads: [], status: 'error', error, reload, revalidate, invalidate };
    }
    return { ads: [], status: 'loading', error: null, reload, revalidate, invalidate };
  }, [workspaceStatus, workspaceError, fresh, error, reload, revalidate, invalidate]);

  return <AdsContext.Provider value={value}>{children}</AdsContext.Provider>;
};

/** 화면에서 쓴다. 들어올 때 오래됐으면 조용히 새로 받는다. */
// oxlint-disable-next-line react/only-export-components -- 훅과 프로바이더가 같은 컨텍스트를 공유한다
export const useAds = (): AdsContextValue => {
  const context = useContext(AdsContext);
  if (!context) throw new Error('useAds must be used within AdsProvider.');

  const { revalidate } = context;
  useEffect(() => {
    revalidate();
  }, [revalidate]);

  return context;
};
