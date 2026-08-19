import { useState } from 'react';

import { activateMerchantQr } from '@/apis/merchantQr';
import { ActivateButton, Card, Description, Page, Result, Title, TokenInput } from '@/pages/MerchantQrActivate/MerchantQrActivate.styles';

const getInitialQrToken = (): string => new URLSearchParams(window.location.search).get('qrToken') ?? '';

const MerchantQrActivate = (): React.JSX.Element => {
  const [qrToken, setQrToken] = useState(getInitialQrToken);
  const [isActivating, setIsActivating] = useState(false);
  const [result, setResult] = useState<{ isError: boolean; message: string } | null>(null);

  const handleActivate = async (): Promise<void> => {
    const token = qrToken.trim();
    if (!token) {
      setResult({ isError: true, message: '연결할 QR 토큰을 입력해주세요.' });
      return;
    }

    setIsActivating(true);
    setResult(null);

    try {
      const response = await activateMerchantQr({ qrToken: token });
      const store = response.data.qr.store;

      if (!response.data.qr.isAssigned || !store) {
        setResult({ isError: true, message: 'QR은 활성화됐지만 아직 연결된 가게 정보가 없어요.' });
        return;
      }

      setResult({ isError: false, message: `${store.marketName} ${store.storeName} 가게가 연결됐어요. 홈으로 이동합니다.` });
      window.setTimeout(() => window.location.assign(`/?qrToken=${encodeURIComponent(token)}`), 800);
    } catch (error) {
      setResult({ isError: true, message: error instanceof Error ? error.message : 'QR 활성화에 실패했어요.' });
    } finally {
      setIsActivating(false);
    }
  };

  return (
    <Page>
      <Card>
        <Title>상인 QR 연결</Title>
        <Description>QR 토큰을 활성화해 연결된 가게 계정으로 접속합니다.</Description>
        <TokenInput
          aria-label="QR 토큰"
          value={qrToken}
          onChange={(event) => setQrToken(event.target.value)}
          placeholder="merchant-..."
        />
        <ActivateButton type="button" onClick={() => void handleActivate()} disabled={isActivating}>
          {isActivating ? '연결 중...' : '가게 연결하기'}
        </ActivateButton>
        {result && <Result $isError={result.isError}>{result.message}</Result>}
      </Card>
    </Page>
  );
};

export default MerchantQrActivate;
