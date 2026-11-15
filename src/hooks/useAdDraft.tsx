import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import type { ShotRequest } from '@/apis/posttalk';
import type { AdFormat } from '@/constants/home';
import type { SuggestionThemeId } from '@/constants/themes';

export type DraftMenu = {
  name: string;
  description: string;
};

export type CapturedAsset = {
  file: File;
  previewUrl: string;
  /** 사진인지 영상인지. 목록 썸네일과 확인 화면이 갈린다. */
  kind: 'photo' | 'video';
  /** 어떤 장면이었는지. 장면 수를 서버가 정하므로 목록이 이 이름으로 칸을 그린다. */
  shotKey: string;
  label: string;
};

/** 서버의 제작 세션. 세션을 열고 장면을 하나씩 제출하면 마지막 장에서 생성이 시작된다. */
type DraftSession = {
  sessionId: string;
  /** 서버가 요구하는 다음 장. 서버 안내 문구를 카메라 화면에 띄운다. */
  nextShot: ShotRequest | null;
  /** 마지막 장을 제출하면 채워진다. */
  jobId?: string;
  submissionId?: string;
};

type AdDraft = {
  format: AdFormat;
  theme: SuggestionThemeId;
  /** 이번 광고의 가게 이름. 관람객마다 다르므로 프로필이 아니라 초안에 둔다. */
  storeName: string;
  storeDescription: string;
  menus: DraftMenu[];
  /** 서버가 받아 준 장면만 담는다. 장면 번호를 키로 둔다. 촬영물은 메모리에만 둔다. */
  captures: Record<number, CapturedAsset>;
  session: DraftSession | null;
};

type AdDraftContextValue = {
  draft: AdDraft;
  setConcept: (value: { format: AdFormat; theme: SuggestionThemeId }) => void;
  setStoreInfo: (value: { storeName: string; storeDescription: string; menus: DraftMenu[] }) => void;
  setSession: (value: { sessionId: string; nextShot: ShotRequest | null }) => void;
  /** 서버가 통과시킨 장면을 저장하고 다음 장 안내를 갱신한다. */
  acceptCapture: (
    sceneIndex: number,
    file: File,
    scene: { shotKey: string; label: string },
    nextShot: ShotRequest | null,
  ) => void;
  /** 서버에서 다시 받아 온 다음 장 안내로 바꾼다. */
  setNextShot: (nextShot: ShotRequest | null) => void;
  setGeneration: (value: { jobId: string; submissionId?: string }) => void;
  resetDraft: () => void;
};

/**
 * 생성 중인 작업을 탭에 적어 두는 키. 생성 대기 중 새로고침하거나 브라우저가 탭을 다시 띄워도
 * 서버는 계속 만들고 있으므로, 이 값으로 진행률을 이어서 묻는다. 탭을 닫으면 사라진다.
 */
const GENERATION_STORAGE_KEY = 'posttalk.generation';

type StoredGeneration = {
  format: AdFormat;
  sessionId: string;
  jobId: string;
  submissionId?: string;
};

const readStoredGeneration = (): StoredGeneration | null => {
  try {
    const raw = window.sessionStorage.getItem(GENERATION_STORAGE_KEY);
    if (!raw) return null;
    const value = JSON.parse(raw) as Partial<StoredGeneration>;
    return value.sessionId && value.jobId && value.format
      ? (value as StoredGeneration)
      : null;
  } catch {
    return null;
  }
};

const writeStoredGeneration = (value: StoredGeneration | null): void => {
  try {
    if (value) window.sessionStorage.setItem(GENERATION_STORAGE_KEY, JSON.stringify(value));
    else window.sessionStorage.removeItem(GENERATION_STORAGE_KEY);
  } catch {
    // 저장소를 못 쓰는 환경이면 새로고침 때 이어 보기만 안 될 뿐이다.
  }
};

const createInitialDraft = (): AdDraft => ({
  format: 'card_news',
  theme: 'christmas',
  storeName: '',
  storeDescription: '',
  menus: [],
  captures: {},
  session: null,
});

/** 첫 렌더에서만 쓴다. 생성 중이던 작업이 있으면 그 세션으로 시작한다. 찍은 재료는 메모리라 없다. */
const restoreDraft = (): AdDraft => {
  const stored = readStoredGeneration();
  if (!stored) return createInitialDraft();
  return {
    ...createInitialDraft(),
    format: stored.format,
    session: {
      sessionId: stored.sessionId,
      nextShot: null,
      jobId: stored.jobId,
      submissionId: stored.submissionId,
    },
  };
};

const revoke = (asset?: CapturedAsset): void => {
  if (asset?.previewUrl.startsWith('blob:')) URL.revokeObjectURL(asset.previewUrl);
};

/** 형식·콘셉트·소개가 바뀌면 이미 연 세션은 쓸 수 없다. 찍어둔 재료와 함께 버린다. */
const withoutSession = (current: AdDraft): Pick<AdDraft, 'captures' | 'session'> => {
  Object.values(current.captures).forEach(revoke);
  return { captures: {}, session: null };
};

const AdDraftContext = createContext<AdDraftContextValue | null>(null);

export const AdDraftProvider = ({ children }: { children: ReactNode }): React.JSX.Element => {
  const [draft, setDraft] = useState<AdDraft>(restoreDraft);

  // 생성 작업이 있는 동안만 탭에 적어 둔다. 초기화되거나 새 세션을 열면 지운다.
  const { format } = draft;
  const { sessionId, jobId, submissionId } = draft.session ?? {};
  useEffect(() => {
    writeStoredGeneration(sessionId && jobId ? { format, sessionId, jobId, submissionId } : null);
  }, [format, sessionId, jobId, submissionId]);

  const setConcept = useCallback((value: { format: AdFormat; theme: SuggestionThemeId }) => {
    setDraft((current) => ({ ...current, ...value, ...withoutSession(current) }));
  }, []);

  const setStoreInfo = useCallback(
    (value: { storeName: string; storeDescription: string; menus: DraftMenu[] }) => {
      setDraft((current) => ({ ...current, ...value, ...withoutSession(current) }));
    },
    [],
  );

  const setSession = useCallback((value: { sessionId: string; nextShot: ShotRequest | null }) => {
    setDraft((current) => ({ ...current, session: { ...value } }));
  }, []);

  const acceptCapture = useCallback(
    (
      sceneIndex: number,
      file: File,
      scene: { shotKey: string; label: string },
      nextShot: ShotRequest | null,
    ) => {
      setDraft((current) => {
        revoke(current.captures[sceneIndex]);
        return {
          ...current,
          captures: {
            ...current.captures,
            [sceneIndex]: {
              file,
              previewUrl: URL.createObjectURL(file),
              kind: file.type.startsWith('video/') ? 'video' : 'photo',
              ...scene,
            },
          },
          session: current.session ? { ...current.session, nextShot } : current.session,
        };
      });
    },
    [],
  );

  const setNextShot = useCallback((nextShot: ShotRequest | null) => {
    setDraft((current) =>
      current.session ? { ...current, session: { ...current.session, nextShot } } : current,
    );
  }, []);

  const setGeneration = useCallback((value: { jobId: string; submissionId?: string }) => {
    setDraft((current) =>
      current.session ? { ...current, session: { ...current.session, ...value } } : current,
    );
  }, []);

  const resetDraft = useCallback(() => {
    setDraft((current) => {
      Object.values(current.captures).forEach(revoke);
      return createInitialDraft();
    });
  }, []);

  const value = useMemo<AdDraftContextValue>(
    () => ({
      draft,
      setConcept,
      setStoreInfo,
      setSession,
      acceptCapture,
      setNextShot,
      setGeneration,
      resetDraft,
    }),
    [
      draft,
      setConcept,
      setStoreInfo,
      setSession,
      acceptCapture,
      setNextShot,
      setGeneration,
      resetDraft,
    ],
  );

  return <AdDraftContext.Provider value={value}>{children}</AdDraftContext.Provider>;
};

// oxlint-disable-next-line react/only-export-components -- 훅과 프로바이더가 같은 컨텍스트를 공유한다
export const useAdDraft = (): AdDraftContextValue => {
  const context = useContext(AdDraftContext);
  if (!context) throw new Error('useAdDraft must be used within AdDraftProvider.');
  return context;
};
