import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';

import type { AdFormat } from '@/constants/create';
import type { VoiceQuestionKey } from '@/constants/questions';

type DraftAssetType = 'menu_board' | 'food_photo';

type DraftAsset = {
  file: File;
  previewUrl: string;
};

type AdDraft = {
  answers: Partial<Record<VoiceQuestionKey, string>>;
  foodPhoto?: DraftAsset;
  format: AdFormat;
  generatedResultUrl?: string;
  jobId?: string;
  menuBoard?: DraftAsset;
  submissionId?: string;
};

type AdDraftContextValue = {
  draft: AdDraft;
  resetDraft: (format?: AdFormat) => void;
  setAnswer: (key: VoiceQuestionKey, answer: string) => void;
  setAsset: (assetType: DraftAssetType, file: File) => void;
  setGeneration: ({ jobId, submissionId }: { jobId: string; submissionId: string }) => void;
  setGeneratedResultUrl: (resultUrl: string) => void;
};

const createInitialDraft = (format: AdFormat = 'photo'): AdDraft => ({ answers: {}, format });

const revokePreviewUrl = (asset?: DraftAsset): void => {
  if (asset?.previewUrl.startsWith('blob:')) URL.revokeObjectURL(asset.previewUrl);
};

const AdDraftContext = createContext<AdDraftContextValue | null>(null);

export const AdDraftProvider = ({ children }: { children: ReactNode }): React.JSX.Element => {
  const [draft, setDraft] = useState<AdDraft>(createInitialDraft);

  const value = useMemo<AdDraftContextValue>(() => ({
    draft,
    resetDraft: (format = 'photo') => setDraft((current) => {
      revokePreviewUrl(current.menuBoard);
      revokePreviewUrl(current.foodPhoto);
      return createInitialDraft(format);
    }),
    setAnswer: (key, answer) => setDraft((current) => ({
      ...current,
      answers: { ...current.answers, [key]: answer },
    })),
    setAsset: (assetType, file) => setDraft((current) => {
      const assetKey = assetType === 'menu_board' ? 'menuBoard' : 'foodPhoto';
      revokePreviewUrl(current[assetKey]);

      return {
        ...current,
        [assetKey]: {
          file,
          previewUrl: URL.createObjectURL(file),
        },
      };
    }),
    setGeneration: ({ jobId, submissionId }) => setDraft((current) => ({ ...current, jobId, submissionId })),
    setGeneratedResultUrl: (generatedResultUrl) => setDraft((current) => ({ ...current, generatedResultUrl })),
  }), [draft]);

  return <AdDraftContext.Provider value={value}>{children}</AdDraftContext.Provider>;
};

export const useAdDraft = (): AdDraftContextValue => {
  const context = useContext(AdDraftContext);
  if (!context) throw new Error('useAdDraft must be used within AdDraftProvider.');
  return context;
};
