import { api, type ApiSuccessResponse } from '@/apis/api';

export interface MerchantQrStore {
  id: string;
  marketName: string;
  storeName: string;
  ownerName?: string | null;
}

export interface MerchantQrData {
  qr: {
    id: string;
    qrToken: string;
    status: string;
    isAssigned: boolean;
    store: MerchantQrStore | null;
  };
}

export interface MerchantSession {
  marketName: string;
  qrPayload: string;
  qrToken: string;
  storeId: string;
  storeName: string;
  submitterAffiliation: string;
  submitterName: string;
}

export const getMerchantQr = ({ qrToken, signal }: { qrToken: string; signal?: AbortSignal }) =>
  api<ApiSuccessResponse<MerchantQrData>>({
    path: `/api/merchant-qrs/${encodeURIComponent(qrToken)}`,
    signal,
  });

export const activateMerchantQr = ({ qrToken }: { qrToken: string }) =>
  api<ApiSuccessResponse<MerchantQrData>>({
    path: `/api/merchant-qrs/${encodeURIComponent(qrToken)}/activate`,
    method: 'POST',
  });
