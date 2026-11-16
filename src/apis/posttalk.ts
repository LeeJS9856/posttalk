import { UPLOAD_TIMEOUT_MS, request } from '@/apis/api';

/**
 * POSTALK 백엔드 엔드포인트. 응답 모양은 docs/백엔드_API.md 의 예시를 따른다.
 * 예시에 없던 필드도 올 수 있고, 있던 필드가 비어 올 수도 있어 대부분 선택으로 둔다.
 */

export type ApiAdType = 'photo' | 'video';
export type ApiAssetType = 'food_photo' | 'video_clip';
export type ApiSubmissionStatus = 'draft' | 'published';

export type ShotRequest = {
  shotKey: string;
  assetType?: ApiAssetType;
  prompt?: string;
  helperText?: string;
};

/* ---------- 작업 공간 ---------- */

export type GuestSession = { storeId: string; canPublish?: boolean };

export const openGuestSession = (
  body: { storeName?: string; marketName?: string },
  signal?: AbortSignal,
): Promise<GuestSession> => request('/api/guest-session', { method: 'POST', body, signal });

/* ---------- 업로드 ---------- */

export type UploadedFile = {
  bucket: string;
  filePath: string;
  fileName?: string;
  mimeType?: string;
  fileSize?: number;
};

export const uploadFile = (
  { file, storeId, assetType }: { file: File; storeId: string; assetType: ApiAssetType },
  signal?: AbortSignal,
): Promise<UploadedFile> => {
  const form = new FormData();
  form.append('file', file);
  form.append('storeId', storeId);
  form.append('assetType', assetType);
  return request('/api/uploads', { method: 'POST', body: form, signal, timeoutMs: UPLOAD_TIMEOUT_MS });
};

/* ---------- 제작 ---------- */

export type StartSessionBody = {
  storeId: string;
  adType: ApiAdType;
  menuIntro: string;
  storeSpecialty: string;
  cardNewsTheme?: 'minimal' | 'christmas';
  cardNewsStyle?: string;
  reelsConcept?: 'simple' | 'christmas';
  /**
   * 릴스 메뉴 1~3개. 보내지 않으면 서버가 menuIntro 를 메뉴 한 개로 치고 영상 4개만 요구한다.
   * 메뉴 수에 따라 영상이 4·6·8개로 늘어난다.
   */
  reelsMenus?: { name: string }[];
};

export type StartedSession = {
  sessionId: string;
  adType?: ApiAdType;
  status?: string;
  currentRequest?: ShotRequest | null;
};

export const startAdSession = (
  body: StartSessionBody,
  signal?: AbortSignal,
): Promise<StartedSession> => request('/api/ad-sessions/start', { method: 'POST', body, signal });

export type ShotReview = {
  passed?: boolean;
  recommendedAction?: 'proceed' | 'retake' | string;
  summary?: string;
  feedback?: string[];
};

/**
 * 사진·영상 한 장 제출 결과.
 * - 통과: response 'success', 다음 장 안내는 request.
 * - 다시 찍기: response 'fail', retryMessage 를 사용자에게 보여 준다.
 * - 마지막 장: status 'generating', generationJobId · submissionId.
 */
export type ShotResult = {
  sessionId?: string;
  response?: 'success' | 'fail' | string;
  status?: string;
  request?: ShotRequest | null;
  review?: ShotReview;
  retryMessage?: string;
  submissionId?: string;
  generationJobId?: string;
};

export type SubmitShotBody = UploadedFile & { durationSeconds?: number };

export const submitShot = (
  sessionId: string,
  kind: ApiAdType,
  body: SubmitShotBody,
  signal?: AbortSignal,
): Promise<ShotResult> =>
  request(`/api/ad-sessions/${sessionId}/${kind === 'photo' ? 'photos' : 'videos'}`, {
    method: 'POST',
    body,
    signal,
  });

export type GeneratedAsset = { assetId?: string; url?: string; promptKey?: string };

export type AdSession = {
  sessionId: string;
  adType?: ApiAdType;
  status?: string;
  createdAt?: string;
  intro?: { menuIntro?: string; storeSpecialty?: string };
  store?: { storeName?: string; marketName?: string; primarySubject?: string };
  currentRequest?: ShotRequest | null;
  submission?: {
    submissionId?: string;
    caption?: string | null;
    hashtags?: string[];
    status?: ApiSubmissionStatus;
  } | null;
  generation?: {
    jobId?: string;
    status?: string;
    failureReason?: string | null;
    resultUrl?: string | null;
    generatedAssets?: GeneratedAsset[];
  } | null;
};

export const getAdSession = (sessionId: string, signal?: AbortSignal): Promise<AdSession> =>
  request(`/api/ad-sessions/${sessionId}`, { signal });

/* ---------- 진행률 ---------- */

export type GenerationStatus = 'queued' | 'processing' | 'completed' | 'failed';

export type GenerationProgress = {
  jobId?: string;
  status?: GenerationStatus | string;
  percent?: number | null;
  /** true 면 percent 가 실제 진행이 아니라 서버의 어림값이다. */
  estimated?: boolean;
  stage?: string | null;
  message?: string | null;
  failureReason?: string | null;
};

export const getGenerationProgress = (
  jobId: string,
  signal?: AbortSignal,
): Promise<GenerationProgress> => request(`/api/generation-jobs/${jobId}/progress`, { signal });

/* ---------- 보관함 ---------- */

export type ArchiveItem = {
  submissionId: string;
  title?: string;
  status?: ApiSubmissionStatus;
  statusLabel?: string;
  thumbnailUrl?: string | null;
  generatedAssetUrl?: string | null;
  publishCaption?: string | null;
  instagramPermalink?: string | null;
  mediaType?: ApiAdType;
  createdAt?: string;
  /** 릴스는 generated_video(영상)와 video_thumbnail(썸네일)이 함께 온다. */
  previewAssets?: { index?: number; sortOrder?: number; url?: string; assetType?: string }[];
};

export type ArchiveData = {
  summary?: { storeName?: string; counts?: { all?: number; draft?: number; published?: number } };
  items?: ArchiveItem[];
};

export const getArchive = (
  query: {
    storeId: string;
    mediaType: ApiAdType;
    status?: 'all' | ApiSubmissionStatus;
    limit?: number;
    submissionId?: string;
  },
  signal?: AbortSignal,
): Promise<ArchiveData> => request('/api/archive', { query, signal });

/**
 * 인스타그램 게시.
 *
 * 주소와 본문 모양이 아직 명세에 없다(2026-11-16). 백엔드가 알려 주면 이 함수만 고친다.
 * 게시는 외부 서비스를 거쳐 오래 걸릴 수 있어 업로드와 같은 시간 제한을 쓴다.
 */
export const publishAd = (
  submissionId: string,
  signal?: AbortSignal,
): Promise<{ status?: ApiSubmissionStatus; instagramPermalink?: string }> =>
  request(`/api/submissions/${submissionId}/publish`, {
    method: 'POST',
    signal,
    timeoutMs: UPLOAD_TIMEOUT_MS,
  });
