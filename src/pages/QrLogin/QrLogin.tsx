import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import PageHeader from '@/components/layout/PageHeader';
import { CameraFrame, CameraVideo, Content, Description, Page, Status, Title } from '@/pages/QrLogin/QrLogin.styles';

type DetectedBarcode = { rawValue: string };
type BarcodeDetectorInstance = { detect: (source: HTMLVideoElement) => Promise<DetectedBarcode[]> };
type BarcodeDetectorConstructor = new (options: { formats: string[] }) => BarcodeDetectorInstance;

const getQrToken = (rawValue: string): string | null => {
  try {
    return new URL(rawValue).searchParams.get('qrToken');
  } catch {
    return rawValue.startsWith('merchant-') ? rawValue : null;
  }
};

const QrLogin = (): React.JSX.Element => {
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const hasScannedRef = useRef(false);
  const [status, setStatus] = useState({ isError: false, message: '카메라를 QR 코드에 맞춰주세요.' });

  useEffect(() => {
    let animationFrameId: number | null = null;
    let stream: MediaStream | null = null;
    let isDisposed = false;

    const startScanner = async (): Promise<void> => {
      const Detector = (window as unknown as { BarcodeDetector?: BarcodeDetectorConstructor }).BarcodeDetector;
      if (!Detector) {
        setStatus({ isError: true, message: '이 기기에서는 QR 자동 인식을 지원하지 않아요. 최신 Chrome에서 다시 시도해주세요.' });
        return;
      }

      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: 'environment' }, height: { ideal: 720 }, width: { ideal: 1280 } },
        });
        const video = videoRef.current;
        if (!video || isDisposed) return;

        video.srcObject = stream;
        await video.play();
        const detector = new Detector({ formats: ['qr_code'] });

        const scanFrame = async (): Promise<void> => {
          if (isDisposed || hasScannedRef.current) return;

          if (video.readyState >= HTMLMediaElement.HAVE_ENOUGH_DATA) {
            const detectedCodes = await detector.detect(video);
            const qrToken = detectedCodes.map(({ rawValue }) => getQrToken(rawValue)).find((token): token is string => Boolean(token));

            if (qrToken) {
              hasScannedRef.current = true;
              stream?.getTracks().forEach((track) => track.stop());
              window.location.assign(`/?qrToken=${encodeURIComponent(qrToken)}`);
              return;
            }
          }

          animationFrameId = window.requestAnimationFrame(() => void scanFrame());
        };

        void scanFrame();
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
      if (animationFrameId !== null) window.cancelAnimationFrame(animationFrameId);
      stream?.getTracks().forEach((track) => track.stop());
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
