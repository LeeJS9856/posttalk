import { api, type ApiSuccessResponse } from '@/apis/api';

export interface MerchantHomeSummary {
  ownerName: string;
  storeName: string;
  pendingReviewCount: number;
  needsFixCount: number;
  totalAttentionCount: number;
}

export interface MerchantHomeData {
  summary: MerchantHomeSummary;
  attentionItems: unknown[];
  myAds: unknown[];
}

export const getMerchantHome = ({ storeId, signal }: { storeId: string; signal?: AbortSignal }) => {
  const searchParams = new URLSearchParams({ storeId });

  return api<ApiSuccessResponse<MerchantHomeData>>({
    path: `/api/home?${searchParams.toString()}`,
    signal,
  });
};
