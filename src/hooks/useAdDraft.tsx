import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';

import type { AdFormat } from '@/constants/home';
import type { ScriptLine } from '@/constants/script';
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

type AdDraft = {
  format: AdFormat;
  theme: SuggestionThemeId;
  storeDescription: string;
  menus: DraftMenu[];
  /** 장면 번호를 키로 둔다. 촬영물은 메모리에만 두고 기기에 저장하지 않는다. */
  captures: Record<number, CapturedAsset>;
  /** 자막. 재료를 찍는 동안 AI 가 만들어 두고, 생성 전에 고칠 수 있다. */
  script: ScriptLine[];
};

type AdDraftContextValue = {
  draft: AdDraft;
  setConcept: (value: { format: AdFormat; theme: SuggestionThemeId }) => void;
  setStoreInfo: (value: { storeDescription: string; menus: DraftMenu[] }) => void;
  setCapture: (sceneIndex: number, file: File) => void;
  setScript: (lines: ScriptLine[]) => void;
  setScriptLine: (sceneIndex: number, text: string) => void;
  resetDraft: () => void;
};

const createInitialDraft = (): AdDraft => ({
  format: 'card_news',
  theme: 'christmas',
  storeDescription: '',
  menus: [],
  captures: {},
  script: [],
});

const revoke = (asset?: CapturedAsset): void => {
  if (asset?.previewUrl.startsWith('blob:')) URL.revokeObjectURL(asset.previewUrl);
};

const AdDraftContext = createContext<AdDraftContextValue | null>(null);

export const AdDraftProvider = ({ children }: { children: ReactNode }): React.JSX.Element => {
  const [draft, setDraft] = useState<AdDraft>(createInitialDraft);

  const setConcept = useCallback((value: { format: AdFormat; theme: SuggestionThemeId }) => {
    setDraft((current) => ({ ...current, ...value }));
  }, []);

  const setStoreInfo = useCallback((value: { storeDescription: string; menus: DraftMenu[] }) => {
    setDraft((current) => {
      // 메뉴가 바뀌면 장면 구성이 달라지므로 찍어둔 재료와 자막을 비운다.
      Object.values(current.captures).forEach(revoke);
      return { ...current, ...value, captures: {}, script: [] };
    });
  }, []);

  const setCapture = useCallback((sceneIndex: number, file: File) => {
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
      };
    });
  }, []);

  const setScript = useCallback((lines: ScriptLine[]) => {
    setDraft((current) => ({ ...current, script: lines }));
  }, []);

  const setScriptLine = useCallback((sceneIndex: number, text: string) => {
    setDraft((current) => ({
      ...current,
      script: current.script.map((line) =>
        line.sceneIndex === sceneIndex ? { ...line, text } : line,
      ),
    }));
  }, []);

  const resetDraft = useCallback(() => {
    setDraft((current) => {
      Object.values(current.captures).forEach(revoke);
      return createInitialDraft();
    });
  }, []);

  const value = useMemo<AdDraftContextValue>(
    () => ({ draft, setConcept, setStoreInfo, setCapture, setScript, setScriptLine, resetDraft }),
    [draft, setConcept, setStoreInfo, setCapture, setScript, setScriptLine, resetDraft],
  );

  return <AdDraftContext.Provider value={value}>{children}</AdDraftContext.Provider>;
};

// oxlint-disable-next-line react/only-export-components -- 훅과 프로바이더가 같은 컨텍스트를 공유한다
export const useAdDraft = (): AdDraftContextValue => {
  const context = useContext(AdDraftContext);
  if (!context) throw new Error('useAdDraft must be used within AdDraftProvider.');
  return context;
};
