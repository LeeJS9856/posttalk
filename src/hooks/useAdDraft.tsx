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
import { uploadAsset } from '@/apis/creation';
import type { ShotRequest, UploadedFile } from '@/apis/posttalk';
import type { AdFormat } from '@/constants/home';
import type { SuggestionThemeId } from '@/constants/themes';
import { useWorkspace } from '@/hooks/useWorkspace';

export type DraftMenu = {
  name: string;
  description: string;
};

/** 카드뉴스 사진을 뒤에서 올린 상태. 다 올라가야 제출할 수 있다. */
export type UploadState =
  | { status: 'uploading' }
  | { status: 'done'; uploaded: UploadedFile }
  | { status: 'error'; message: string };

/** 정보 입력 화면이 넘기는 값. */
export type StoreInfo = {
  storeName: string;
  marketName: string;
  storeDescription: string;
  menus: DraftMenu[];
  /** 카드뉴스 디자인 요청. 비우면 콘셉트에 맞춰 정해 둔 문장을 보낸다. 릴스는 쓰지 않는다. */
  cardNewsStyle: string;
};

export type CapturedAsset = {
  file: File;
  previewUrl: string;
  /** 사진인지 영상인지. 목록 썸네일과 확인 화면이 갈린다. */
  kind: 'photo' | 'video';
  /** 어떤 장면이었는지. 장면 수를 서버가 정하므로 목록이 이 이름으로 칸을 그린다. */
  shotKey: string;
  label: string;
  /** 카드뉴스만: 찍자마자 뒤에서 올린 결과. 릴스는 서버가 받아 준 뒤에 담겨 없다. */
  upload?: UploadState;
  /** 카드뉴스만: 제출했더니 서버가 다시 찍으라고 한 문구. 다시 찍으면 지운다. */
  rejection?: string;
};

/** 서버의 제작 세션. 세션을 열고 장면을 하나씩 제출하면 마지막 장에서 생성이 시작된다. */
type DraftSession = {
  sessionId: string;
  /** 서버가 요구하는 다음 장. 서버 안내 문구를 카메라 화면에 띄운다. */
  nextShot: ShotRequest | null;
  /** 마지막 장을 제출하면 채워진다. */
  jobId?: string;
  submissionId?: string;
  /** 카드뉴스만: 서버가 받아 준 장 수. 이 앞의 칸은 서버에 들어가 다시 찍을 수 없다. */
  submittedCount?: number;
};

type AdDraft = {
  format: AdFormat;
  theme: SuggestionThemeId;
  /** 이번 광고의 가게 이름. 관람객마다 다르므로 프로필이 아니라 초안에 둔다. */
  storeName: string;
  /** 시장·지역. 비우면 서버 기본값(전통시장)이 들어간다. */
  marketName: string;
  storeDescription: string;
  menus: DraftMenu[];
  /** 카드뉴스 디자인 요청. 비우면 콘셉트 기본 문장이 나간다. 릴스는 쓰지 않는다. */
  cardNewsStyle: string;
  /**
   * 장면 번호를 키로 둔다. 촬영물은 메모리에만 둔다.
   * 릴스는 서버가 받아 준 장면만, 카드뉴스는 찍은 장면 전부(제출 전 포함)를 담는다.
   */
  captures: Record<number, CapturedAsset>;
  session: DraftSession | null;
};

type AdDraftContextValue = {
  draft: AdDraft;
  setConcept: (value: { format: AdFormat; theme: SuggestionThemeId }) => void;
  setStoreInfo: (value: StoreInfo) => void;
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
  /** 카드뉴스: 찍은 사진을 칸에 넣고 바로 뒤에서 올린다. 같은 칸을 다시 찍으면 바꾼다. */
  putPhoto: (sceneIndex: number, file: File, scene: { shotKey: string; label: string }) => void;
  /** 카드뉴스: 올리지 못한 사진을 다시 올린다. */
  retryUploads: () => void;
  /** 카드뉴스: 서버가 받아 준 장 수와 다음 요청을 적는다. */
  markSubmitted: (count: number, nextShot: ShotRequest | null) => void;
  /** 카드뉴스: 서버가 다시 찍으라고 한 칸에 문구를 단다. */
  rejectCapture: (sceneIndex: number, message: string) => void;
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
  marketName: '',
  storeDescription: '',
  cardNewsStyle: '',
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
  const { storeId } = useWorkspace();
  /** 칸마다 진행 중인 업로드. 같은 칸을 다시 찍거나 초안을 버리면 끊는다. */
  const uploadsRef = useRef(new Map<number, AbortController>());

  const abortUploads = useCallback(() => {
    uploadsRef.current.forEach((controller) => controller.abort());
    uploadsRef.current.clear();
  }, []);

  // 생성 작업이 있는 동안만 탭에 적어 둔다. 초기화되거나 새 세션을 열면 지운다.
  const { format } = draft;
  const { sessionId, jobId, submissionId } = draft.session ?? {};
  useEffect(() => {
    writeStoredGeneration(sessionId && jobId ? { format, sessionId, jobId, submissionId } : null);
  }, [format, sessionId, jobId, submissionId]);

  const setConcept = useCallback(
    (value: { format: AdFormat; theme: SuggestionThemeId }) => {
      abortUploads();
      setDraft((current) => ({ ...current, ...value, ...withoutSession(current) }));
    },
    [abortUploads],
  );

  const setStoreInfo = useCallback(
    (value: StoreInfo) => {
      abortUploads();
      setDraft((current) => ({ ...current, ...value, ...withoutSession(current) }));
    },
    [abortUploads],
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

  /** 한 칸을 올린다. 끝났을 때 그 칸의 사진이 그대로일 때만 결과를 적는다(그사이 다시 찍었을 수 있다). */
  const startUpload = useCallback(
    (sceneIndex: number, file: File) => {
      uploadsRef.current.get(sceneIndex)?.abort();
      uploadsRef.current.delete(sceneIndex);
      // 작업 공간이 아직 안 열렸으면 '올리는 중'으로 줄 세워 둔다. 열리는 순간 아래 효과가 올린다.
      // 기기를 켜자마자 찍으면 작업 공간보다 사진이 먼저 온다.
      if (!storeId) return;

      const controller = new AbortController();
      uploadsRef.current.set(sceneIndex, controller);

      const settle = (upload: UploadState): void =>
        setDraft((current) => {
          const asset = current.captures[sceneIndex];
          if (!asset || asset.file !== file) return current;
          return { ...current, captures: { ...current.captures, [sceneIndex]: { ...asset, upload } } };
        });

      uploadAsset(file, storeId, controller.signal)
        .then((uploaded) => settle({ status: 'done', uploaded }))
        .catch((cause: unknown) => {
          if (isAbortError(cause)) return;
          settle({
            status: 'error',
            message: cause instanceof Error ? cause.message : '올리지 못했어요.',
          });
        })
        .finally(() => {
          if (uploadsRef.current.get(sceneIndex) === controller) {
            uploadsRef.current.delete(sceneIndex);
          }
        });
    },
    [storeId],
  );

  // 줄 서 있던 사진(올리는 중인데 진행 중인 요청이 없는 칸)을 작업 공간이 열리면 올린다.
  useEffect(() => {
    if (!storeId) return;
    Object.entries(draft.captures).forEach(([index, asset]) => {
      const sceneIndex = Number(index);
      if (asset.upload?.status === 'uploading' && !uploadsRef.current.has(sceneIndex)) {
        startUpload(sceneIndex, asset.file);
      }
    });
  }, [storeId, draft.captures, startUpload]);

  const putPhoto = useCallback(
    (sceneIndex: number, file: File, scene: { shotKey: string; label: string }) => {
      // 업데이트 함수는 StrictMode 에서 두 번 불린다. 주소는 밖에서 한 번만 만든다.
      const previewUrl = URL.createObjectURL(file);
      setDraft((current) => {
        revoke(current.captures[sceneIndex]);
        return {
          ...current,
          captures: {
            ...current.captures,
            // 릴스도 이 길로 영상을 올린다. 사진으로 박아 두면 목록·생성 대기의 썸네일이 깨진다.
            [sceneIndex]: {
              file,
              previewUrl,
              kind: file.type.startsWith('video/') ? 'video' : 'photo',
              ...scene,
              upload: { status: 'uploading' },
            },
          },
        };
      });
      startUpload(sceneIndex, file);
    },
    [startUpload],
  );

  const retryUploads = useCallback(() => {
    const failed = Object.entries(draft.captures).filter(
      ([, asset]) => asset.upload?.status === 'error',
    );
    if (failed.length === 0) return;
    setDraft((current) => {
      const captures = { ...current.captures };
      failed.forEach(([index]) => {
        const asset = captures[Number(index)];
        if (asset) captures[Number(index)] = { ...asset, upload: { status: 'uploading' } };
      });
      return { ...current, captures };
    });
    failed.forEach(([index, asset]) => startUpload(Number(index), asset.file));
  }, [draft.captures, startUpload]);

  const markSubmitted = useCallback((count: number, nextShot: ShotRequest | null) => {
    setDraft((current) =>
      current.session
        ? { ...current, session: { ...current.session, submittedCount: count, nextShot } }
        : current,
    );
  }, []);

  const rejectCapture = useCallback((sceneIndex: number, message: string) => {
    setDraft((current) => {
      const asset = current.captures[sceneIndex];
      if (!asset) return current;
      return {
        ...current,
        captures: { ...current.captures, [sceneIndex]: { ...asset, rejection: message } },
      };
    });
  }, []);

  const setGeneration = useCallback((value: { jobId: string; submissionId?: string }) => {
    setDraft((current) =>
      current.session ? { ...current, session: { ...current.session, ...value } } : current,
    );
  }, []);

  const resetDraft = useCallback(() => {
    abortUploads();
    setDraft((current) => {
      Object.values(current.captures).forEach(revoke);
      return createInitialDraft();
    });
  }, [abortUploads]);

  const value = useMemo<AdDraftContextValue>(
    () => ({
      draft,
      setConcept,
      setStoreInfo,
      setSession,
      acceptCapture,
      setNextShot,
      putPhoto,
      retryUploads,
      markSubmitted,
      rejectCapture,
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
      putPhoto,
      retryUploads,
      markSubmitted,
      rejectCapture,
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
