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

export interface AdminReviewDetail extends AdminReviewItem {
  status?: 'pending_review' | 'approved' | 'rejected';
  rejectionReason?: string | null;
  rejection?: {
    reason?: string | null;
  } | null;
  primaryAssetUrl: string | null;
  assets?: Array<{
    assetType?: string;
    fileUrl?: string | null;
    publicUrl?: string | null;
    url?: string | null;
  }>;
  content: {
    caption?: string | null;
    hashtags?: string[] | null;
  };
}

type AdminReviewDecision = 'approved' | 'rejected';

export const getAdminReviews = ({ marketName, signal }: { marketName: string; signal?: AbortSignal }) => {
  const searchParams = new URLSearchParams({ marketName, status: 'pending_review', limit: '30' });

  return api<ApiSuccessResponse<AdminReviewsData>>({
    baseUrl: '',
    path: `/api/admin/reviews?${searchParams.toString()}`,
    signal,
  });
};

export const getAdminReviewDetail = ({ submissionId, signal }: { submissionId: string; signal?: AbortSignal }) =>
  api<ApiSuccessResponse<AdminReviewDetail>>({
    baseUrl: '',
    path: `/api/admin/reviews/${encodeURIComponent(submissionId)}`,
    signal,
  });

export const updateAdminReviewStatus = ({ submissionId, status }: { submissionId: string; status: AdminReviewDecision }) =>
  api<ApiSuccessResponse<unknown>>({
    baseUrl: '',
    path: `/api/admin/submissions/${encodeURIComponent(submissionId)}`,
    method: 'PATCH',
    body: { status },
  });
