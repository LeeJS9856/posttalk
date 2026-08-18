import { api, type ApiSuccessResponse } from '@/apis/api';
import type { AdFormat } from '@/constants/create';
import { TEMP_QR_USER_SESSION } from '@/constants/user';

export type UploadAssetType = 'menu_board' | 'food_photo';

export type UploadedAsset = {
  assetType: UploadAssetType;
  bucket: string;
  fileName: string;
  filePath: string;
  fileSize: number;
  mimeType: string;
};

type SubmissionData = { submissionId: string };
type GenerationJobData = { jobId: string; submissionId: string; status: string };
type GenerationResultData = { status: string; resultUrl?: string | null };

export const uploadAsset = async ({ assetType, file }: { assetType: UploadAssetType; file: File }): Promise<UploadedAsset> => {
  const body = new FormData();
  body.append('assetType', assetType);
  body.append('storeId', TEMP_QR_USER_SESSION.storeId);
  body.append('file', file);

  const response = await api<ApiSuccessResponse<UploadedAsset>>({
    path: '/api/uploads',
    method: 'POST',
    body,
  });

  return response.data;
};

export const createSubmission = async ({
  answers,
  assets,
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
}): Promise<SubmissionData> => {
  const response = await api<ApiSuccessResponse<SubmissionData>>({
    path: '/api/submissions',
    method: 'POST',
    body: {
      storeId: TEMP_QR_USER_SESSION.storeId,
      submitterName: TEMP_QR_USER_SESSION.submitterName,
      submitterAffiliation: TEMP_QR_USER_SESSION.submitterAffiliation,
      qrPayload: TEMP_QR_USER_SESSION.qrPayload,
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
