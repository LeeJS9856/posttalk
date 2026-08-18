import { api, type ApiSuccessResponse } from '@/apis/api';

export interface AdminReviewItem {
  submissionId: string;
  thumbnailUrl: string | null;
  title: string;
  createdAt: string;
  mediaType: 'photo' | 'video';
}

export interface AdminReviewsData {
  items: AdminReviewItem[];
}

export const getAdminReviews = ({ marketName, signal }: { marketName: string; signal?: AbortSignal }) => {
  const searchParams = new URLSearchParams({ marketName, status: 'pending_review', limit: '30' });

  return api<ApiSuccessResponse<AdminReviewsData>>({
    baseUrl: '',
    path: `/api/admin/reviews?${searchParams.toString()}`,
    signal,
  });
};
