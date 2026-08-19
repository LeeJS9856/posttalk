import { api, type ApiSuccessResponse } from '@/apis/api';
import type { MerchantSession } from '@/apis/merchantQr';
import type { AdFormat } from '@/constants/create';

export type UploadAssetType = 'menu_board' | 'food_photo' | string;

export type UploadedAsset = {
  assetType: string;
  bucket: string;
  fileName: string;
  filePath: string;
  fileSize: number;
  mimeType: string;
};

export type PhotoCheckResult = {
  review: {
    feedback: string[];
    passed: boolean;
    recommendedAction: string;
    score: number;
    summary: string;
  };
};

type SubmissionData = { submissionId: string };
type GenerationJobData = { jobId: string; submissionId: string; status: string };
type GenerationResultData = { status: string; resultUrl?: string | null };

export const uploadAsset = async ({ assetType, file, session }: { assetType: UploadAssetType; file: File; session: MerchantSession }): Promise<UploadedAsset> => {
  const body = new FormData();
  body.append('assetType', assetType);
  body.append('storeId', session.storeId);
  body.append('qrToken', session.qrToken);
  body.append('file', file);

  const response = await api<ApiSuccessResponse<UploadedAsset>>({
    path: '/api/uploads',
    method: 'POST',
    body,
  });

  return response.data;
};

export const checkPhoto = async ({ asset, assetType, session, shotOrder }: { asset: UploadedAsset; assetType: UploadAssetType; session: MerchantSession; shotOrder: number }): Promise<PhotoCheckResult> => {
  const response = await api<ApiSuccessResponse<PhotoCheckResult>>({
    path: '/api/photo-check',
    method: 'POST',
    body: {
      qrToken: session.qrToken,
      bucket: asset.bucket,
      filePath: asset.filePath,
      assetType,
      category: session.category ?? 'restaurant_food',
      shotOrder,
    },
  });

  return response.data;
};

export const createSubmission = async ({
  answers,
  assets,
  session,
}: {
  answers: {
    appealPoint: string;
    extraMessage?: string;
    peakSalesTime?: string;
    popularMenuNotes?: string;
    storeType: string;
    targetCustomer?: string;
    targetMenuName: string;
  };
  assets: UploadedAsset[];
  session: MerchantSession;
}): Promise<SubmissionData> => {
  const response = await api<ApiSuccessResponse<SubmissionData>>({
    path: '/api/submissions',
    method: 'POST',
    body: {
      qrToken: session.qrToken,
      title: answers.targetMenuName,
      ...answers,
      assets: assets.map((asset, sortOrder) => ({ ...asset, sortOrder })),
    },
  });

  return response.data;
};

export const startGeneration = async ({ format, submissionId }: { format: AdFormat; submissionId: string }): Promise<GenerationJobData> => {
  const isVideo = format === 'video';
  const response = await api<ApiSuccessResponse<GenerationJobData>>({
    path: isVideo ? '/api/video-creations/start' : '/api/ad-creations/start',
    method: 'POST',
    body: isVideo
      ? { submissionId, stylePreset: 'market_story', aspectRatio: '9:16', resolution: '720p', durationSeconds: 6 }
      : { submissionId, stylePreset: 'clean_poster' },
  });

  return response.data;
};

export const getGenerationResult = async ({ format, jobId }: { format: AdFormat; jobId: string }): Promise<GenerationResultData> => {
  const response = await api<ApiSuccessResponse<GenerationResultData>>({
    path: format === 'video' ? `/api/video-creations/${jobId}` : `/api/ad-creations/${jobId}`,
  });

  return response.data;
};

export const requestPublish = async ({ format, submissionId }: { format: AdFormat; submissionId: string }): Promise<void> => {
  await api<ApiSuccessResponse<unknown>>({
    path: format === 'video' ? '/api/video-publish-requests' : '/api/publish-requests',
    method: 'POST',
    body: { submissionId },
  });
};
