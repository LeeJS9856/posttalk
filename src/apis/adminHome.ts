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

export const getAdminHome = ({ signal }: { signal?: AbortSignal } = {}) =>
  api<ApiSuccessResponse<AdminHomeData>>({
    baseUrl: '',
    path: '/api/admin/home',
    signal,
  });
