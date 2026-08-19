import { api, type ApiSuccessResponse } from '@/apis/api';

export interface MerchantHomeSummary {
  ownerName: string;
  storeName: string;
  pendingReviewCount: number;
  needsFixCount: number;
  totalAttentionCount: number;
}

export type MerchantAttentionStatus = 'pending_review' | 'rejected';

export interface MerchantAttentionItem {
  submissionId: string;
  thumbnailUrl: string | null;
  title: string;
  status: MerchantAttentionStatus;
  statusLabel: string;
  message: string;
  updatedAt: string;
}

export interface MerchantHomeAd {
  submissionId: string;
  thumbnailUrl: string | null;
  title: string;
  createdAt: string;
  updatedAt?: string;
  status: 'pending_review' | 'rejected' | 'approved';
  statusLabel: string;
}

export interface MerchantHomeData {
  summary: MerchantHomeSummary;
  attentionItems: MerchantAttentionItem[];
  myAds: MerchantHomeAd[];
}

export const getMerchantHome = ({ storeId, signal }: { storeId: string; signal?: AbortSignal }) => {
  const searchParams = new URLSearchParams({ storeId });

  return api<ApiSuccessResponse<MerchantHomeData>>({
    path: `/api/home?${searchParams.toString()}`,
    signal,
  });
};
