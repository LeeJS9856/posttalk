import { api, type ApiSuccessResponse } from '@/apis/api';

export interface AdminHomeItem {
  submissionId: string;
  thumbnailUrl: string | null;
  title: string;
  storeName: string;
}

export interface AdminHomeData {
  summary: {
    marketName: string;
    pendingReviewCount: number;
  };
  pendingItems: AdminHomeItem[];
  recentItems: AdminHomeItem[];
}

export const getAdminHome = ({ marketName, signal }: { marketName: string; signal?: AbortSignal }) => {
  const searchParams = new URLSearchParams({ marketName });

  return api<ApiSuccessResponse<AdminHomeData>>({
    baseUrl: '',
    path: `/api/admin/home?${searchParams.toString()}`,
    signal,
  });
};
