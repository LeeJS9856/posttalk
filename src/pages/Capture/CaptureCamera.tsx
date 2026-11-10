import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { buildScenes } from '@/constants/scenes';
import { useAdDraft } from '@/hooks/useAdDraft';
import {
  BottomBar,
  CloseButton,
  ConfirmRow,
  Counter,
  Hint,
  HiddenInput,
  Instruction,
  Notice,
  Preview,
  RetakeButton,
  SampleFrame,
  SampleLabel,
  SampleWrap,
  Shot,
  Shutter,
  ShutterRow,
  SideButton,
  Stage,
  TopBar,
  TopRow,
  UseButton,
} from '@/pages/Capture/CaptureCamera.styles';

const CloseIcon = (): React.JSX.Element => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const PhotoIcon = (): React.JSX.Element => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <rect x="3.5" y="5" width="17" height="14" rx="2.5" stroke="currentColor" strokeWidth="1.7" />
    <path d="M4 16l4.5-4 4 3.5L16 12l4 4" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
  </svg>
);

const FlipIcon = (): React.JSX.Element => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M4 9a8 8 0 0 1 13.5-3.5L20 8M20 15a8 8 0 0 1-13.5 3.5L4 16"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const CaptureCamera = (): React.JSX.Element => {
  const navigate = useNavigate();
  const { sceneIndex } = useParams();
  const { draft, setCapture } = useAdDraft();

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [facing, setFacing] = useState<'environment' | 'user'>('environment');
  const [shot, setShot] = useState<{ file: File; url: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const scenes = useMemo(() => buildScenes(draft.menus), [draft.menus]);
  const index = Number(sceneIndex ?? 0);
  const scene = scenes[index];

  const isGallery = scene?.source === 'gallery';

  // 촬영물은 기기에 저장하지 않는다. getUserMedia 로 앱 안에서 직접 찍는다.
  useEffect(() => {
    if (!scene || isGallery || shot) return;

    const run = { alive: true };

    const open = async (): Promise<void> => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: facing },
          audio: false,
        });
        if (!run.alive) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }
        streamRef.current = stream;
        if (videoRef.current) videoRef.current.srcObject = stream;
        setError(null);
      } catch (cause) {
        if (!run.alive) return;
        setError(
          cause instanceof DOMException && cause.name === 'NotAllowedError'
            ? '카메라 권한이 필요해요. 브라우저에서 허용해주세요.'
            : '카메라를 열지 못했어요. 갤러리에서 골라주세요.',
        );
      }
    };

    void open();

    return () => {
      run.alive = false;
      streamRef.current?.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    };
  }, [scene, isGallery, shot, facing]);

  useEffect(() => {
    if (isGallery && !shot) fileInputRef.current?.click();
  }, [isGallery, shot]);

  useEffect(() => () => {
    if (shot) URL.revokeObjectURL(shot.url);
  }, [shot]);

  if (!scene) {
    return (
      <Stage>
        <Notice>촬영할 장면이 없어요. 앞 화면에서 메뉴를 먼저 입력해주세요.</Notice>
        <BottomBar>
          <UseButton type="button" onClick={() => navigate('/create/info')}>
            정보 입력으로
          </UseButton>
        </BottomBar>
      </Stage>
    );
  }

  const takeShot = (): void => {
    const video = videoRef.current;
    if (!video || !video.videoWidth) return;

    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d')?.drawImage(video, 0, 0);

    canvas.toBlob((blob) => {
      if (!blob) return;
      const file = new File([blob], `scene-${scene.index}.jpg`, { type: 'image/jpeg' });
      setShot({ file, url: URL.createObjectURL(file) });
    }, 'image/jpeg', 0.92);
  };

  const pickFromGallery = (file: File): void => {
    setShot({ file, url: URL.createObjectURL(file) });
  };

  const confirm = (): void => {
    if (!shot) return;
    setCapture(scene.index, shot.file);
    navigate('/create/capture');
  };

  return (
    <Stage>
      {shot ? <Shot src={shot.url} alt="방금 찍은 사진" /> : <Preview ref={videoRef} autoPlay playsInline muted />}

      {error && !shot && <Notice>{error}</Notice>}

      <TopBar>
        <TopRow>
          {!shot && (
            <CloseButton type="button" aria-label="닫기" onClick={() => navigate('/create/capture')}>
              <CloseIcon />
            </CloseButton>
          )}
          <Counter style={{ marginLeft: shot ? 0 : 'auto' }}>
            {scene.index + 1} / {scenes.length}
          </Counter>
          {shot && <Counter>{scene.label}</Counter>}
        </TopRow>
        {!shot && (
          <>
            <Instruction>{scene.title}</Instruction>
            <Hint>{scene.hint}</Hint>
          </>
        )}
      </TopBar>

      <SampleWrap>
        <SampleFrame>
          <PhotoIcon />
        </SampleFrame>
        <SampleLabel>이렇게</SampleLabel>
      </SampleWrap>

      <BottomBar>
        {shot ? (
          <ConfirmRow>
            <RetakeButton
              type="button"
              onClick={() => {
                URL.revokeObjectURL(shot.url);
                setShot(null);
              }}
            >
              다시 찍기
            </RetakeButton>
            <UseButton type="button" onClick={confirm}>
              이걸로 할게요
            </UseButton>
          </ConfirmRow>
        ) : (
          <ShutterRow>
            <SideButton
              type="button"
              aria-label="갤러리에서 고르기"
              onClick={() => fileInputRef.current?.click()}
            >
              <PhotoIcon />
            </SideButton>
            <Shutter type="button" aria-label="사진 찍기" onClick={takeShot} />
            <SideButton
              type="button"
              aria-label="앞뒤 카메라 전환"
              onClick={() => setFacing((current) => (current === 'environment' ? 'user' : 'environment'))}
            >
              <FlipIcon />
            </SideButton>
          </ShutterRow>
        )}
      </BottomBar>

      <HiddenInput
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={(event) => {
          const [file] = Array.from(event.target.files ?? []);
          if (file) pickFromGallery(file);
        }}
      />
    </Stage>
  );
};

export default CaptureCamera;
