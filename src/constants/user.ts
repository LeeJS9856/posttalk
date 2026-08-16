export interface QrUserSession {
  storeId: string;
  marketName: string;
  storeName: string;
  submitterName: string;
  submitterAffiliation: string;
  qrPayload: string;
}

// QR 로그인 API가 연결되기 전까지 사용하는 임시 세션 데이터입니다.
export const TEMP_QR_USER_SESSION: QrUserSession = {
  storeId: 'd01ae4bf-dc05-4449-a49b-236626e56211',
  marketName: '양동시장',
  storeName: '해성식당',
  submitterName: '김해성',
  submitterAffiliation: '해성식당',
  qrPayload: 'postalk://qr-login/d01ae4bf-dc05-4449-a49b-236626e56211',
};
