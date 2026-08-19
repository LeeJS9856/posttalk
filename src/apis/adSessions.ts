import { api, type ApiSuccessResponse } from '@/apis/api';

export type AdSessionRequest = {
  assetType: 'menu_board' | 'food_photo' | string;
  helperText?: string;
  prompt: string;
  shotKey?: string;
};

export type AdSessionStartData = {
  currentRequest?: AdSessionRequest;
  request?: AdSessionRequest;
  session?: { id?: string; sessionId?: string };
  sessionId?: string;
  status?: string;
};

export type AdSessionPhotoData = {
  request?: AdSessionRequest;
  response: 'fail' | 'success';
  retryMessage?: string;
  state?: string;
  status: 'collecting' | 'generating' | string;
};

export type GeneratedAsset = {
  filePath?: string;
  publicUrl?: string;
  resultUrl?: string;
  url?: string;
};

export type AdSessionData = {
  draft?: {
    assetCount?: number;
    caption?: string;
    hashtags?: string[] | string;
    preparedAt?: string;
    promptCount?: number;
  };
  generation?: {
    generatedAssets?: Array<GeneratedAsset | string>;
    resultUrl?: string | null;
    status?: string;
  };
  intro?: {
    combinedText?: string;
    menuIntro?: string;
    storeSpecialty?: string;
  };
  status?: string;
  submission?: {
    caption?: string;
    hashtags?: string[] | string;
    id?: string;
    submissionId?: string;
  };
};

export const startAdSession = ({ adType, menuIntro, storeId, storeSpecialty }: {
  adType: 'photo';
  menuIntro: string;
  storeId: string;
  storeSpecialty: string;
}) => api<ApiSuccessResponse<AdSessionStartData>>({
  path: '/api/ad-sessions/start',
  method: 'POST',
  body: { storeId, adType, menuIntro, storeSpecialty },
});

export const submitAdSessionPhoto = ({ asset, sessionId }: {
  asset: { bucket: string; fileName?: string; filePath: string; fileSize?: number; mimeType?: string };
  sessionId: string;
}) => api<ApiSuccessResponse<AdSessionPhotoData>>({
  path: `/api/ad-sessions/${encodeURIComponent(sessionId)}/photos`,
  method: 'POST',
  body: asset,
});

export const getAdSession = ({ sessionId, signal }: { sessionId: string; signal?: AbortSignal }) =>
  api<ApiSuccessResponse<AdSessionData>>({
    path: `/api/ad-sessions/${encodeURIComponent(sessionId)}`,
    signal,
  });
