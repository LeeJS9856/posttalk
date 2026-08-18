import { api, type ApiSuccessResponse } from '@/apis/api';

export type AdminArchiveMediaType = 'photo' | 'video';
export type AdminArchiveStatus = 'all' | 'pending_review' | 'approved' | 'rejected';

export interface AdminArchiveItem {
  submissionId: string;
  thumbnailUrl: string | null;
  title: string;
  storeName: string;
  status: Exclude<AdminArchiveStatus, 'all'>;
  createdAt: string;
  mediaType: AdminArchiveMediaType;
}

export interface AdminArchiveData {
  summary: {
    marketName: string;
    mediaType: AdminArchiveMediaType;
    selectedStatus: AdminArchiveStatus;
  };
  items: AdminArchiveItem[];
}

export const getAdminArchive = ({
  marketName,
  mediaType,
  status,
  signal,
}: {
  marketName: string;
  mediaType: AdminArchiveMediaType;
  status: AdminArchiveStatus;
  signal?: AbortSignal;
}) => {
  const searchParams = new URLSearchParams({ marketName, mediaType, status });

  return api<ApiSuccessResponse<AdminArchiveData>>({
    baseUrl: '',
    path: `/api/admin/archive?${searchParams.toString()}`,
    signal,
  });
};
