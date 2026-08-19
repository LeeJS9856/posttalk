import { api, type ApiSuccessResponse } from '@/apis/api';

export interface MerchantQrStore {
  id: string;
  marketName: string;
  storeName: string;
  category?: string | null;
  ownerName?: string | null;
}

export interface MerchantCategoryOption {
  code: string;
  label: string;
}

export interface MerchantQrOnboarding {
  categoryOptions: MerchantCategoryOption[];
  needsCategorySelection: boolean;
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
  locationAddress: string;
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
