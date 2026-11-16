import { useCallback, useEffect, useState } from 'react';

import { isAbortError } from '@/apis/api';
import { getArchive, type ApiAdType } from '@/apis/posttalk';
import { fromArchiveItem, type AdItem } from '@/constants/ads';
import { useWorkspace } from '@/hooks/useWorkspace';

type LoadStatus = 'loading' | 'ready' | 'error';

/** 어느 요청의 결과인지 함께 들고 다닌다. */
type Loaded = {
  key: string;
  status: Exclude<LoadStatus, 'loading'>;
  ads: AdItem[];
  error: string | null;
};

/** 보관함이 한 번에 돌려주는 최대 개수. */
const ARCHIVE_LIMIT = 50;
const MEDIA_TYPES: readonly ApiAdType[] = ['photo', 'video'];

const newestFirst = (a: AdItem, b: AdItem): number =>
  (b.createdAt ?? '').localeCompare(a.createdAt ?? '');

/**
 * 작업 공간의 광고 전체. 보관함 API 는 형식을 하나씩만 돌려주어 카드뉴스와 릴스를 따로 불러 합친다.
 * 서명 URL 은 만료되므로 화면을 열 때마다 새로 받는다.
 */
export const useAds = (): {
  ads: AdItem[];
  status: LoadStatus;
  error: string | null;
  reload: () => void;
} => {
  const { storeId, status: workspaceStatus, error: workspaceError, retry } = useWorkspace();
  const [attempt, setAttempt] = useState(0);
  /**
   * 받아 둔 결과에 어느 요청의 것인지 붙여 둔다.
   * 이펙트 안에서 loading 으로 되돌리면 렌더가 한 번 더 돌고, 앞선 요청의 결과가
   * 늦게 도착해 섞일 수 있다. 키가 다르면 그냥 로딩으로 친다.
   */
  const [loaded, setLoaded] = useState<Loaded | null>(null);
  const requestKey = storeId ? `${storeId}:${attempt}` : '';

  useEffect(() => {
    if (!storeId) return;

    const controller = new AbortController();

    Promise.all(
      MEDIA_TYPES.map((mediaType) =>
        getArchive({ storeId, mediaType, status: 'all', limit: ARCHIVE_LIMIT }, controller.signal),
      ),
    )
      .then((results) => {
        const merged = results
          .flatMap((result) => result.items ?? [])
          .filter((item) => Boolean(item.submissionId))
          .map(fromArchiveItem)
          .sort(newestFirst);
        setLoaded({ key: requestKey, status: 'ready', ads: merged, error: null });
      })
      .catch((cause: unknown) => {
        if (isAbortError(cause)) return;
        setLoaded({
          key: requestKey,
          status: 'error',
          ads: [],
          error: cause instanceof Error ? cause.message : '광고를 불러오지 못했어요.',
        });
      });

    return () => controller.abort();
  }, [storeId, requestKey]);

  // 작업 공간이 안 열렸으면 그것부터 다시 연다.
  const reload = useCallback(() => {
    if (workspaceStatus === 'error') retry();
    else setAttempt((count) => count + 1);
  }, [workspaceStatus, retry]);

  // 작업 공간부터 열리지 않았으면 그 상태를 그대로 보여 준다.
  if (workspaceStatus === 'error') {
    return { ads: [], status: 'error', error: workspaceError, reload };
  }
  if (!storeId) return { ads: [], status: 'loading', error: null, reload };

  const current = loaded?.key === requestKey ? loaded : null;
  if (!current) return { ads: [], status: 'loading', error: null, reload };

  return { ads: current.ads, status: current.status, error: current.error, reload };
};
