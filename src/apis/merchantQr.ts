import { api, type ApiSuccessResponse } from '@/apis/api';

export interface MerchantQrStore {
  id: string;
  marketName: string;
  storeName: string;
  ownerName?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  locationAddress?: string | null;
}

export interface MerchantCategoryOption {
  code: string;
  label: string;
}

export interface PhotoGuideShot {
  description: string;
  emphasis?: string;
  order: number;
  title: string;
}

export interface PhotoGuide {
  category: string;
  categoryShots: PhotoGuideShot[];
  commonShots: PhotoGuideShot[];
  totalRecommendedShots: number;
}

export interface MerchantQrOnboarding {
  categoryOptions: MerchantCategoryOption[];
  needsCategorySelection: boolean;
  needsLocationCapture: boolean;
  photoGuide: PhotoGuide | null;
  selectedCategory: string | null;
}

export interface MerchantQrData {
  onboarding?: MerchantQrOnboarding;
  qr: {
    id: string;
    qrToken: string;
    status: string;
    isAssigned: boolean;
    store: MerchantQrStore | null;
  };
}

export interface MerchantSession {
  category?: string;
  marketName: string;
  qrPayload: string;
  qrToken: string;
  storeId: string;
  storeName: string;
  submitterAffiliation: string;
  submitterName: string;
}

export interface MerchantQrActivationInput {
  category: string;
  latitude: number;
  locationAddress?: string;
  longitude: number;
  marketName: string;
  ownerName: string;
  storeName: string;
}

export const getMerchantQr = ({ qrToken, signal }: { qrToken: string; signal?: AbortSignal }) =>
  api<ApiSuccessResponse<MerchantQrData>>({
    path: `/api/merchant-qrs/${encodeURIComponent(qrToken)}`,
    signal,
  });

export const activateMerchantQr = ({
  qrToken,
  ...input
}: MerchantQrActivationInput & { qrToken: string }) =>
  api<ApiSuccessResponse<MerchantQrData>>({
    path: `/api/merchant-qrs/${encodeURIComponent(qrToken)}/activate`,
    method: 'POST',
    body: input,
  });
