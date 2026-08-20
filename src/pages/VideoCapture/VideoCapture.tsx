import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import cookingGuide from '@/assets/capture-guides/cooking.jpg';
import menuBoardGuide from '@/assets/capture-guides/menu-board.jpg';
import signatureMenuGuide from '@/assets/capture-guides/signature-menu.jpg';
import storefrontGuide from '@/assets/capture-guides/storefront.jpg';
import popo from '@/assets/popo.svg';
import { startAdSession, type AdSessionRequest } from '@/apis/adSessions';
import { FlowTitleStrong } from '@/components/common/FlowTitle';
import PrimaryActionButton from '@/components/common/PrimaryActionButton';
import PageHeader from '@/components/layout/PageHeader';
import { getVideoCaptureSteps, MIN_VIDEO_DURATION_SECONDS, VIDEO_CAPTURE_DURATION_MS } from '@/constants/videoCapture';
import { useAdDraft } from '@/hooks/useAdDraft';
import { useMerchantSession } from '@/hooks/useMerchantSession';
import {
  ActionArea,
  CameraInput,
  CameraModal,
  CameraPreview,
  ChoiceButton,
  ExampleMotionImage,
  Guide,
  GuideCopy,
  HelperText,
  ModalBackdrop,
  ModalCancelButton,
  ModalContent,
  ModalDescription,
  ModalTitle,
  Page,
  Popo,
  RecordButton,
  RecordStatus,
} from '@/pages/VideoCapture/VideoCapture.styles';

const MAX_GALLERY_VIDEO_SIZE_BYTES = 10 * 1024 * 1024;

const getFrontendVideoRequest = (step: { helperText: string; title: string }, stepIndex: number, assetType = 'video_clip'): AdSessionRequest => ({
  assetType,
  helperText: step.helperText,
  prompt: step.title,
  shotKey: `video_step_${stepIndex + 1}`,
});

const getVideoDuration = (file: File): Promise<number> => new Promise((resolve, reject) => {
  const video = document.createElement('video');
  const url = URL.createObjectURL(file);

  video.onloadedmetadata = () => {
    URL.revokeObjectURL(url);
    resolve(video.duration);
  };
  video.onerror = () => {
    URL.revokeObjectURL(url);
    reject(new Error('영상 길이를 확인하지 못했어요. 다른 영상을 선택해주세요.'));
  };
  video.src = url;
});

const VideoCapture = (): React.JSX.Element => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { draft, setSession, setVideoClip } = useAdDraft();
  const { session } = useMerchantSession();
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const cameraVideoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const recordingStreamRef = useRef<MediaStream | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const recordTimeoutRef = useRef<number | null>(null);
  const renderFrameRef = useRef<number | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const [isSourceModalOpen, setIsSourceModalOpen] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const steps = useMemo(() => getVideoCaptureSteps(draft.answers.menuIntro?.trim() || '대표 메뉴'), [draft.answers.menuIntro]);
  const requestedStep = Number(searchParams.get('step')) || 0;
  const stepIndex = Math.min(Math.max(requestedStep, 0), steps.length - 1);
  const step = steps[stepIndex];
  const isSessionReady = Boolean(draft.sessionId);
  const requestTarget = step.title;
  const exampleImage = stepIndex <= 1
    ? storefrontGuide
    : stepIndex === 2
      ? menuBoardGuide
      : stepIndex === 5
        ? cookingGuide
        : signatureMenuGuide;

  const closeCamera = (): void => {
    if (recordTimeoutRef.current !== null) window.clearTimeout(recordTimeoutRef.current);
    recordTimeoutRef.current = null;
    if (renderFrameRef.current !== null) window.cancelAnimationFrame(renderFrameRef.current);
    renderFrameRef.current = null;
    recordingStreamRef.current?.getVideoTracks().forEach((track) => track.stop());
    recordingStreamRef.current = null;
    recorderRef.current = null;
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    setIsRecording(false);
    setIsCameraOpen(false);
  };

  useEffect(() => () => closeCamera(), []);

  useEffect(() => {
    if (draft.sessionId || errorMessage) return;
    const menuIntro = draft.answers.menuIntro?.trim();
    const storeSpecialty = draft.answers.storeSpecialty?.trim();
    if (!session || !menuIntro || !storeSpecialty) {
      setErrorMessage('광고 소개 정보가 없어요. 처음부터 다시 입력해주세요.');
      return;
    }

    const startSession = async (): Promise<void> => {
      try {
        const response = await startAdSession({
          storeId: session.storeId,
          adType: 'video',
          menuIntro,
          storeSpecialty,
        });
        const sessionId = response.data.sessionId ?? response.data.session?.id ?? response.data.session?.sessionId;
        if (!sessionId) throw new Error('영상 촬영 세션을 시작하지 못했어요. 다시 시도해주세요.');
        setSession({
          sessionId,
          request: getFrontendVideoRequest(step, stepIndex, response.data.currentRequest?.assetType ?? response.data.request?.assetType),
        });
      } catch (error) {
        setErrorMessage(error instanceof Error ? error.message : '영상 촬영 요청을 준비하지 못했어요.');
      }
    };

    void startSession();
  }, [draft.answers.menuIntro, draft.answers.storeSpecialty, draft.sessionId, errorMessage, session, setSession, step, stepIndex]);

  useEffect(() => {
    if (!isCameraOpen || !streamRef.current || !cameraVideoRef.current) return;
    cameraVideoRef.current.srcObject = streamRef.current;
    void cameraVideoRef.current.play().catch(() => undefined);
  }, [isCameraOpen]);

  const moveToResult = (file: File, duration: number): void => {
    setVideoClip({ file, duration, stepIndex });
    navigate(`/create/video-capture/result?step=${stepIndex}`);
  };

  const openCamera = async (): Promise<void> => {
    setIsSourceModalOpen(false);
    setErrorMessage(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: {
          aspectRatio: { ideal: 9 / 16 },
          facingMode: { ideal: 'environment' },
          // Keep the source compact for mobile upload and server-side rendering.
          width: { ideal: 480, max: 720 },
          height: { ideal: 854, max: 1280 },
          frameRate: { ideal: 24, max: 30 },
        },
      });
      streamRef.current = stream;
      setIsCameraOpen(true);
    } catch {
      setErrorMessage('카메라와 마이크 권한이 필요해요. 권한을 허용한 뒤 다시 시도해주세요.');
    }
  };

  const startRecording = (): void => {
    if (!streamRef.current || isRecording) return;

    try {
      const cameraPreview = cameraVideoRef.current;
      const canvas = document.createElement('canvas');
      canvas.width = 480;
      canvas.height = 854;
      const context = canvas.getContext('2d');
      const recordingStream = canvas.captureStream(24);

      streamRef.current.getAudioTracks().forEach((track) => recordingStream.addTrack(track));
      recordingStreamRef.current = recordingStream;

      const renderPortraitFrame = (): void => {
        if (!cameraPreview || !context) return;

        const sourceWidth = cameraPreview.videoWidth || 16;
        const sourceHeight = cameraPreview.videoHeight || 9;
        const scale = Math.max(canvas.width / sourceWidth, canvas.height / sourceHeight);
        const drawWidth = sourceWidth * scale;
        const drawHeight = sourceHeight * scale;

        context.drawImage(cameraPreview, (canvas.width - drawWidth) / 2, (canvas.height - drawHeight) / 2, drawWidth, drawHeight);
        renderFrameRef.current = window.requestAnimationFrame(renderPortraitFrame);
      };

      renderPortraitFrame();
      const recorder = new MediaRecorder(recordingStream, {
        mimeType: 'video/webm',
        videoBitsPerSecond: 750_000,
        audioBitsPerSecond: 64_000,
      });
      recordedChunksRef.current = [];
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) recordedChunksRef.current.push(event.data);
      };
      recorder.onstop = () => {
        const file = new File([new Blob(recordedChunksRef.current, { type: 'video/webm' })], `video-clip-${stepIndex + 1}.webm`, { type: 'video/webm' });
        closeCamera();
        moveToResult(file, VIDEO_CAPTURE_DURATION_MS / 1000);
      };
      recorderRef.current = recorder;
      recorder.start();
      setIsRecording(true);
      recordTimeoutRef.current = window.setTimeout(() => recorder.stop(), VIDEO_CAPTURE_DURATION_MS);
    } catch {
      setErrorMessage('영상 녹화를 시작하지 못했어요. 다시 시도해주세요.');
      closeCamera();
    }
  };

  const handleGalleryChange = async (event: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
    const [video] = Array.from(event.target.files ?? []);
    event.target.value = '';
    if (!video) return;

    try {
      if (video.size > MAX_GALLERY_VIDEO_SIZE_BYTES) {
        setErrorMessage('갤러리 영상은 10MB 이하 파일만 선택할 수 있어요. 2~3초 영상으로 잘라서 다시 선택해주세요.');
        return;
      }

      const duration = await getVideoDuration(video);
      if (duration < MIN_VIDEO_DURATION_SECONDS) {
        setErrorMessage(`영상은 최소 ${MIN_VIDEO_DURATION_SECONDS}초 이상이어야 해요. 다시 선택해주세요.`);
        return;
      }
      moveToResult(video, duration);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : '영상을 확인하지 못했어요.');
    }
  };

  return (
    <Page aria-label={`영상 광고 촬영 ${stepIndex + 1}단계`}>
      <PageHeader title="영상 광고 제작" onBack={() => navigate(stepIndex === 0 ? '/create/questions/1' : `/create/video-capture/result?step=${stepIndex - 1}`)} />
      <Guide>
        <Popo src={popo} alt="" />
        {isSessionReady ? (
          <>
            <GuideCopy><FlowTitleStrong>{requestTarget}</FlowTitleStrong>을 2초간 찍어주세요</GuideCopy>
            <HelperText>{step.helperText}</HelperText>
            <ExampleMotionImage src={exampleImage} alt={`${requestTarget} 영상 촬영 예시`} />
          </>
        ) : <GuideCopy>영상 촬영 요청을 준비하고 있어요.</GuideCopy>}
        {errorMessage && <HelperText role="alert">{errorMessage}</HelperText>}
      </Guide>
      {isSessionReady && <ActionArea>
        <PrimaryActionButton type="button" onClick={() => setIsSourceModalOpen(true)}>촬영하기</PrimaryActionButton>
      </ActionArea>}
      <CameraInput ref={galleryInputRef} type="file" accept="video/*" onChange={(event) => void handleGalleryChange(event)} />

      {isSourceModalOpen && (
        <ModalBackdrop role="presentation" onClick={() => setIsSourceModalOpen(false)}>
          <ModalContent role="dialog" aria-modal="true" aria-labelledby="video-source-title" onClick={(event) => event.stopPropagation()}>
            <ModalTitle id="video-source-title">영상을 가져올 방법을 선택해주세요</ModalTitle>
            <ModalDescription>카메라로 2.5초 영상을 찍거나 앨범의 영상을 선택할 수 있어요.</ModalDescription>
            <ChoiceButton type="button" onClick={() => void openCamera()}>카메라로 촬영</ChoiceButton>
            <ChoiceButton type="button" onClick={() => galleryInputRef.current?.click()}>갤러리에서 선택</ChoiceButton>
            <ModalCancelButton type="button" onClick={() => setIsSourceModalOpen(false)}>취소</ModalCancelButton>
          </ModalContent>
        </ModalBackdrop>
      )}

      {isCameraOpen && (
        <CameraModal role="dialog" aria-modal="true" aria-label="영상 촬영">
          <CameraPreview ref={cameraVideoRef} muted playsInline />
          <RecordStatus>{isRecording ? '2.5초 동안 녹화 중이에요.' : '녹화 버튼을 누르면 2.5초 뒤 자동으로 멈춰요.'}</RecordStatus>
          <RecordButton type="button" $recording={isRecording} disabled={isRecording} onClick={startRecording} aria-label="2.5초 영상 녹화 시작" />
          {!isRecording && <ModalCancelButton type="button" onClick={closeCamera}>취소</ModalCancelButton>}
        </CameraModal>
      )}
    </Page>
  );
};

export default VideoCapture;
