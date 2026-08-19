import { api, type ApiSuccessResponse } from '@/apis/api';

export type MerchantArchiveMediaType = 'photo' | 'video';
export type MerchantArchiveStatus = 'all' | 'pending_review' | 'approved' | 'rejected';

export interface MerchantArchiveItem {
  submissionId: string;
  generatedAssetUrl?: string | null;
  previewAssets?: Array<{
    assetType: string;
    index: number;
    sortOrder: number;
    url: string;
  }>;
  thumbnailUrl: string | null;
  title: string;
  storeName: string;
  marketName: string;
  status: Exclude<MerchantArchiveStatus, 'all'>;
  statusLabel: string;
  createdAt: string;
  updatedAt: string;
  mediaType: MerchantArchiveMediaType;
}

export interface MerchantArchiveData {
  summary: {
    storeId: string;
    storeName: string;
    ownerName: string;
    marketName: string;
    mediaType: MerchantArchiveMediaType;
    selectedStatus: MerchantArchiveStatus;
    counts: {
      all: number;
      pendingReview: number;
      rejected: number;
      approved: number;
    };
  };
  items: MerchantArchiveItem[];
}

export const getMerchantArchive = ({
  storeId,
  mediaType,
  status,
  signal,
}: {
  storeId: string;
  mediaType: MerchantArchiveMediaType;
  status: MerchantArchiveStatus;
  signal?: AbortSignal;
}) => {
  const searchParams = new URLSearchParams({ storeId, mediaType, status });

  return api<ApiSuccessResponse<MerchantArchiveData>>({
    path: `/api/archive?${searchParams.toString()}`,
    signal,
  });
};
