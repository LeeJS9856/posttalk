import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import PageHeader from '@/components/layout/PageHeader';
import { CameraFrame, CameraVideo, Content, Description, Page, Status, Title } from '@/pages/QrLogin/QrLogin.styles';

const getQrToken = (rawValue: string): string | null => {
  try {
    return new URL(rawValue).searchParams.get('qrToken');
  } catch {
    return rawValue.startsWith('merchant-') ? rawValue : null;
  }
};

type ScannerControls = { stop: () => void };

const QrLogin = (): React.JSX.Element => {
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const hasScannedRef = useRef(false);
  const [status, setStatus] = useState({ isError: false, message: '카메라를 QR 코드에 맞춰주세요.' });

  useEffect(() => {
    let controls: ScannerControls | null = null;
    let isDisposed = false;

    const startScanner = async (): Promise<void> => {
      try {
        const video = videoRef.current;
        if (!video) return;

        const { BrowserQRCodeReader } = await import('@zxing/browser');
        const reader = new BrowserQRCodeReader(undefined, {
          delayBetweenScanAttempts: 250,
          delayBetweenScanSuccess: 500,
        });
        controls = await reader.decodeFromConstraints(
          { video: { facingMode: { ideal: 'environment' }, height: { ideal: 720 }, width: { ideal: 1280 } } },
          video,
          (result, _error, scannerControls) => {
            if (isDisposed || hasScannedRef.current || !result) return;

            const qrToken = getQrToken(result.getText());
            if (!qrToken) return;

            hasScannedRef.current = true;
            scannerControls.stop();
            window.location.assign(`/?qrToken=${encodeURIComponent(qrToken)}`);
          },
        );
      } catch (error) {
        if (!isDisposed) {
          const message = error instanceof DOMException && error.name === 'NotAllowedError'
            ? '카메라 권한을 허용해주세요.'
            : '카메라를 시작하지 못했어요. 잠시 후 다시 시도해주세요.';
          setStatus({ isError: true, message });
        }
      }
    };

    void startScanner();
    return () => {
      isDisposed = true;
      controls?.stop();
    };
  }, []);

  return (
    <Page aria-label="QR 로그인">
      <PageHeader title="QR 로그인" onBack={() => navigate(-1)} />
      <Content>
        <Title>QR 코드를 비춰주세요</Title>
        <Description>인식되는 즉시 포스트톡에 로그인됩니다.</Description>
        <CameraFrame>
          <CameraVideo ref={videoRef} muted playsInline aria-label="QR 코드 스캔 카메라" />
        </CameraFrame>
        <Status $isError={status.isError}>{status.message}</Status>
      </Content>
    </Page>
  );
};

export default QrLogin;
