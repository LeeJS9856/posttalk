import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';

import type { AdSessionRequest } from '@/apis/adSessions';
import type { AdFormat } from '@/constants/create';
import type { VoiceQuestionKey } from '@/constants/questions';

type DraftAssetType = 'menu_board' | 'food_photo';

type DraftAsset = {
  file: File;
  previewUrl: string;
};

export type SessionPhotoAsset = DraftAsset & {
  assetType: string;
};

export type VideoClip = DraftAsset & {
  duration: number;
  stepIndex: number;
};

type AdDraft = {
  answers: Partial<Record<VoiceQuestionKey, string>>;
  currentRequest?: AdSessionRequest;
  foodPhoto?: DraftAsset;
  format: AdFormat;
  generatedAssets?: string[];
  generatedResultUrl?: string;
  jobId?: string;
  menuBoard?: DraftAsset;
  retryMessage?: string;
  sessionId?: string;
  sessionPhoto?: SessionPhotoAsset;
  submissionId?: string;
  submissionCaption?: string;
  submissionHashtags?: string[];
  videoClips: VideoClip[];
};

type AdDraftContextValue = {
  draft: AdDraft;
  resetDraft: (format?: AdFormat) => void;
  setAnswer: (key: VoiceQuestionKey, answer: string) => void;
  setAsset: (assetType: DraftAssetType, file: File) => void;
  setCurrentRequest: (request: AdSessionRequest) => void;
  setGenerationResult: ({ generatedAssets, resultUrl, submissionId, caption, hashtags }: {
    caption?: string;
    generatedAssets: string[];
    hashtags?: string[];
    resultUrl?: string;
    submissionId?: string;
  }) => void;
  setGeneration: ({ jobId, submissionId }: { jobId: string; submissionId: string }) => void;
  setGeneratedResultUrl: (resultUrl: string) => void;
  setRetryMessage: (message?: string) => void;
  setSession: ({ sessionId, request }: { sessionId: string; request: AdSessionRequest }) => void;
  setSessionPhoto: (assetType: string, file: File) => void;
  setVideoClip: ({ duration, file, stepIndex }: { duration: number; file: File; stepIndex: number }) => void;
};

const createInitialDraft = (format: AdFormat = 'photo'): AdDraft => ({ answers: {}, format, videoClips: [] });

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
      revokePreviewUrl(current.sessionPhoto);
      current.videoClips.forEach(revokePreviewUrl);
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
    setCurrentRequest: (currentRequest) => setDraft((current) => ({ ...current, currentRequest, retryMessage: undefined })),
    setGenerationResult: ({ generatedAssets, resultUrl, submissionId, caption, hashtags }) => setDraft((current) => ({
      ...current,
      generatedAssets,
      generatedResultUrl: resultUrl,
      submissionId: submissionId ?? current.submissionId,
      submissionCaption: caption,
      submissionHashtags: hashtags,
    })),
    setGeneration: ({ jobId, submissionId }) => setDraft((current) => ({ ...current, jobId, submissionId })),
    setGeneratedResultUrl: (generatedResultUrl) => setDraft((current) => ({ ...current, generatedResultUrl })),
    setRetryMessage: (retryMessage) => setDraft((current) => ({ ...current, retryMessage })),
    setSession: ({ sessionId, request }) => setDraft((current) => ({ ...current, sessionId, currentRequest: request, retryMessage: undefined })),
    setSessionPhoto: (assetType, file) => setDraft((current) => {
      revokePreviewUrl(current.sessionPhoto);
      return {
        ...current,
        sessionPhoto: { assetType, file, previewUrl: URL.createObjectURL(file) },
      };
    }),
    setVideoClip: ({ duration, file, stepIndex }) => setDraft((current) => {
      const previousClip = current.videoClips.find((clip) => clip.stepIndex === stepIndex);
      revokePreviewUrl(previousClip);
      const videoClip: VideoClip = { duration, file, stepIndex, previewUrl: URL.createObjectURL(file) };

      return {
        ...current,
        videoClips: [...current.videoClips.filter((clip) => clip.stepIndex !== stepIndex), videoClip]
          .sort((first, second) => first.stepIndex - second.stepIndex),
      };
    }),
  }), [draft]);

  return <AdDraftContext.Provider value={value}>{children}</AdDraftContext.Provider>;
};

export const useAdDraft = (): AdDraftContextValue => {
  const context = useContext(AdDraftContext);
  if (!context) throw new Error('useAdDraft must be used within AdDraftProvider.');
  return context;
};
