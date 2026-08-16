import { api, type ApiSuccessResponse } from '@/apis/api';

export type UploadAssetType = 'menu_board' | 'food_photo';

export interface UploadedAsset {
  assetId: string;
  assetType: UploadAssetType;
  bucket: string;
  filePath: string;
  fileName: string;
  mimeType: string;
  fileSize: number;
  store: {
    id: string;
    marketName: string;
    storeName: string;
  };
}

const MAX_UPLOAD_FILE_SIZE = 10 * 1024 * 1024;
const SUPPORTED_IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);

const validateImageFile = (file: File): void => {
  if (!SUPPORTED_IMAGE_TYPES.has(file.type)) {
    throw new Error('JPG, PNG, WEBP 형식의 이미지만 업로드할 수 있어요.');
  }

  if (file.size > MAX_UPLOAD_FILE_SIZE) {
    throw new Error('이미지 파일은 10MB 이하만 업로드할 수 있어요.');
  }
};

export const uploadAsset = ({
  assetType,
  file,
  storeId,
  signal,
}: {
  assetType: UploadAssetType;
  file: File;
  storeId?: string;
  signal?: AbortSignal;
}) => {
  validateImageFile(file);

  const formData = new FormData();
  formData.append('assetType', assetType);
  formData.append('file', file);

  if (storeId) {
    formData.append('storeId', storeId);
  }

  return api<ApiSuccessResponse<UploadedAsset>>({
    path: '/api/uploads',
    method: 'POST',
    body: formData,
    signal,
  });
};
