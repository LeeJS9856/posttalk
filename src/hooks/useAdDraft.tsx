import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';

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
  storeDescription: string;
  menus: DraftMenu[];
  /** 서버가 받아 준 장면만 담는다. 장면 번호를 키로 둔다. 촬영물은 메모리에만 둔다. */
  captures: Record<number, CapturedAsset>;
  session: DraftSession | null;
};

type AdDraftContextValue = {
  draft: AdDraft;
  setConcept: (value: { format: AdFormat; theme: SuggestionThemeId }) => void;
  setStoreInfo: (value: { storeDescription: string; menus: DraftMenu[] }) => void;
  setSession: (value: { sessionId: string; nextShot: ShotRequest | null }) => void;
  /** 서버가 통과시킨 장면을 저장하고 다음 장 안내를 갱신한다. */
  acceptCapture: (sceneIndex: number, file: File, nextShot: ShotRequest | null) => void;
  setGeneration: (value: { jobId: string; submissionId?: string }) => void;
  resetDraft: () => void;
};

const createInitialDraft = (): AdDraft => ({
  format: 'card_news',
  theme: 'christmas',
  storeDescription: '',
  menus: [],
  captures: {},
  session: null,
});

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
  const [draft, setDraft] = useState<AdDraft>(createInitialDraft);

  const setConcept = useCallback((value: { format: AdFormat; theme: SuggestionThemeId }) => {
    setDraft((current) => ({ ...current, ...value, ...withoutSession(current) }));
  }, []);

  const setStoreInfo = useCallback((value: { storeDescription: string; menus: DraftMenu[] }) => {
    setDraft((current) => ({ ...current, ...value, ...withoutSession(current) }));
  }, []);

  const setSession = useCallback((value: { sessionId: string; nextShot: ShotRequest | null }) => {
    setDraft((current) => ({ ...current, session: { ...value } }));
  }, []);

  const acceptCapture = useCallback(
    (sceneIndex: number, file: File, nextShot: ShotRequest | null) => {
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
            },
          },
          session: current.session ? { ...current.session, nextShot } : current.session,
        };
      });
    },
    [],
  );

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
      setGeneration,
      resetDraft,
    }),
    [draft, setConcept, setStoreInfo, setSession, acceptCapture, setGeneration, resetDraft],
  );

  return <AdDraftContext.Provider value={value}>{children}</AdDraftContext.Provider>;
};

// oxlint-disable-next-line react/only-export-components -- 훅과 프로바이더가 같은 컨텍스트를 공유한다
export const useAdDraft = (): AdDraftContextValue => {
  const context = useContext(AdDraftContext);
  if (!context) throw new Error('useAdDraft must be used within AdDraftProvider.');
  return context;
};
