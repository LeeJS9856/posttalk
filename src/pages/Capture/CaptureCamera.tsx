import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';

import { isAbortError } from '@/apis/api';
import { needsRetake, retakeMessage, submitScene } from '@/apis/creation';
import {
  MIN_CLIP_SECONDS,
  PHOTO_RESOLUTION,
  VIDEO_ASPECT_RATIO,
  VIDEO_BITS_PER_SECOND,
  VIDEO_RESOLUTION,
  cameraErrorMessage,
  canUseCamera,
  extensionForMimeType,
  baseMimeType,
  isLandscapeVideo,
  lockLandscape,
  openCamera,
  pickVideoMimeType,
  readVideoSize,
  unlockOrientation,
} from '@/constants/media';
import { goBackTo } from '@/constants/navigation';
import {
  GALLERY_HINT,
  isBatchFormat,
  scenesFor,
  sceneFromRequest,
  type CaptureSource,
} from '@/constants/scenes';
import { useAdDraft } from '@/hooks/useAdDraft';
import { useWorkspace } from '@/hooks/useWorkspace';
import {
  BottomBar,
  CloseButton,
  ConfirmRow,
  Counter,
  FallbackButton,
  Hint,
  HiddenInput,
  Instruction,
  Notice,
  NoticeWrap,
  PickArea,
  PickHint,
  PickText,
  Preview,
  RecChip,
  RecordButton,
  RetakeButton,
  ReviewVideo,
  Ring,
  RotateButton,
  RotateHint,
  RotateNotice,
  RotateTitle,
  SampleFrame,
  SampleImage,
  SampleLabel,
  SampleViewer,
  SampleViewerHint,
  SampleVideo,
  SampleViewerImage,
  SampleViewerVideo,
  SampleWrap,
  Shot,
  Shutter,
  ShutterRow,
  SideButton,
  Stage,
  StopButton,
  StopWrap,
  TopBar,
  TopRow,
  UseButton,
} from '@/pages/Capture/CaptureCamera.styles';

/** 찍거나 고른 것. 직접 녹화한 영상은 길이를 재 두었다가 함께 보낸다. */
type Taken = { file: File; url: string; kind: 'photo' | 'video'; durationSeconds?: number };

const CloseIcon = (): React.JSX.Element => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const PhotoIcon = (): React.JSX.Element => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <rect x="3.5" y="5" width="17" height="14" rx="2.5" stroke="currentColor" strokeWidth="1.7" />
    <path
      d="M4 16l4.5-4 4 3.5L16 12l4 4"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinejoin="round"
    />
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

const RotateIcon = (): React.JSX.Element => (
  <svg viewBox="0 0 48 48" fill="none" aria-hidden="true">
    <rect x="16" y="6" width="16" height="28" rx="3" stroke="currentColor" strokeWidth="2.2" />
    <rect x="10" y="30" width="28" height="14" rx="3" stroke="currentColor" strokeWidth="2.2" strokeDasharray="3 3" />
    <path d="M38 14a10 10 0 0 1 2 10m0 0l3-3m-3 3l-3-3" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/** 지금 화면이 가로인지. 폰을 돌리면 바로 바뀐다. */
const useIsLandscape = (): boolean => {
  const query = '(orientation: landscape)';
  const [isLandscape, setIsLandscape] = useState(() => window.matchMedia(query).matches);
  useEffect(() => {
    const media = window.matchMedia(query);
    const onChange = (): void => setIsLandscape(media.matches);
    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
  }, []);
  return isLandscape;
};

const CaptureCamera = (): React.JSX.Element => {
  const navigate = useNavigate();
  const { sceneIndex } = useParams();
  const [params] = useSearchParams();
  const { draft, acceptCapture, setGeneration, putPhoto } = useAdDraft();
  const { storeId } = useWorkspace();
  const submitRef = useRef<AbortController | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  /** 진행 중인 카메라 열기. 다음 열기는 이게 끝난 뒤에 시작한다. */
  const openingRef = useRef<Promise<void>>(Promise.resolve());
  const fileInputRef = useRef<HTMLInputElement>(null);
  /** 갤러리 선택은 한 번만 자동으로 띄운다. 취소한 뒤 다시 열리면 빠져나갈 수 없다. */
  const autoOpened = useRef(false);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const stopTimerRef = useRef<number | undefined>(undefined);
  const startedAtRef = useRef(0);

  const [facing, setFacing] = useState<'environment' | 'user'>('environment');
  const [shot, setShot] = useState<Taken | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  /** 서버에 올리고 검사를 기다리는 중. */
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSampleOpen, setIsSampleOpen] = useState(false);

  const index = Number(sceneIndex ?? 0);
  const session = draft.session;
  const doneCount = Object.keys(draft.captures).length;
  // 카드뉴스는 장면을 미리 알아 아무 칸이나 연다. 서버가 이미 받아 준 칸만 막는다.
  // 릴스는 서버가 요구한 다음 장면만 연다. 차례가 아닌 장면이면 목록으로 돌려보낸다.
  const isBatch = isBatchFormat(draft.format);
  const submitted = session?.submittedCount ?? 0;
  // 장면 목록은 포맷과 메뉴 수가 정한다. 릴스는 메뉴 1·2·3개에 영상 4·6·8개다.
  const scenes = scenesFor(draft.format, draft.menus);
  const scene = isBatch
    ? !session?.jobId && index >= submitted
      ? scenes[index]
      : undefined
    : session?.nextShot && !session.jobId && index === doneCount
      ? sceneFromRequest(session.nextShot, index, draft.format)
      : undefined;
  /** 카드뉴스: 제출했더니 서버가 다시 찍으라고 한 칸이면 그 문구를 힌트 자리에 띄운다. */
  const rejection = isBatch ? draft.captures[index]?.rejection : undefined;

  // 앞 화면 바텀시트에서 고른 경로. 직접 들어온 경우에는 장면이 권하는 쪽을 쓴다.
  const requested = params.get('source');
  const source: CaptureSource =
    requested === 'camera' || requested === 'gallery' ? requested : (scene?.recommended ?? 'camera');
  const isGallery = source === 'gallery';
  const isVideo = scene?.kind === 'video';
  // scene 은 렌더마다 새로 만든 객체다. 카메라 효과가 이것에 걸리면 렌더마다 카메라를 껐다 켜서
  // 녹화가 시작하자마자 끊긴다. 바뀌었는지는 장면 이름으로만 본다.
  const sceneKey = scene?.shotKey;

  // 릴스는 가로로 찍는다. 녹화 화면에 들어오면 가로로 고정하고, 고정이 안 되는 기기는 돌려 달라고 한다.
  const isLandscape = useIsLandscape();
  const filmsVideo = Boolean(scene) && isVideo && !isGallery;
  const needsRotate = filmsVideo && !shot && !isLandscape;

  useEffect(() => {
    if (!filmsVideo) return;
    void lockLandscape();
    return unlockOrientation;
  }, [filmsVideo]);

  const openPicker = (): void => fileInputRef.current?.click();

  // 촬영물은 기기에 저장하지 않는다. getUserMedia 로 앱 안에서 직접 찍는다.
  useEffect(() => {
    if (!sceneKey || isGallery || shot) return;

    const run = { alive: true };

    const open = async (): Promise<void> => {
      if (!run.alive) return;
      if (!canUseCamera()) {
        setError(cameraErrorMessage(null));
        return;
      }
      try {
        // 해상도를 적지 않으면 크롬이 640x480 으로 열어 사진·영상이 뭉개진다(값은 media.ts 참고).
        // 릴스는 소리를 쓰지 않는다(openCamera 가 마이크를 잡지 않는다).
        const stream = await openCamera(
          { facingMode: facing },
          isVideo ? { aspectRatio: VIDEO_ASPECT_RATIO, ...VIDEO_RESOLUTION } : PHOTO_RESOLUTION,
          () => run.alive,
        );
        if (!run.alive) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }
        streamRef.current = stream;
        if (videoRef.current) videoRef.current.srcObject = stream;
        setError(null);
      } catch (cause) {
        if (!run.alive) return;
        setError(cameraErrorMessage(cause));
      }
    };

    // 앞의 열기가 끝나 정리될 때까지 기다렸다 연다. 겹쳐 열면 같은 카메라를 두 번 잡아
    // "사용 중" 오류가 나거나 해상도가 기본값(640x480)으로 떨어진다. 화면을 돌릴 때 흔하다.
    const opening = openingRef.current.then(open);
    openingRef.current = opening.catch(() => undefined);

    return () => {
      run.alive = false;
      streamRef.current?.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    };
    // 폰을 돌리면 카메라를 다시 연다. 영상은 세로일 때 연 트랙을 그대로 쓰면 비율이 어긋난다.
  }, [sceneKey, isGallery, isVideo, shot, facing, isLandscape]);

  useEffect(() => {
    if (!isGallery || shot || autoOpened.current) return;
    autoOpened.current = true;
    openPicker();
  }, [isGallery, shot]);

  useEffect(() => () => {
    if (shot) URL.revokeObjectURL(shot.url);
  }, [shot]);

  // 화면을 벗어나는 순간 녹화와 업로드를 끊는다. 두고 나가면 스트림이 살아남는다.
  useEffect(
    () => () => {
      window.clearTimeout(stopTimerRef.current);
      if (recorderRef.current?.state === 'recording') recorderRef.current.stop();
      submitRef.current?.abort();
    },
    [],
  );

  if (!scene) {
    return (
      <Stage>
        <NoticeWrap>
          <Notice>지금 올릴 차례가 아니에요. 목록에서 다음 장면을 골라주세요.</Notice>
        </NoticeWrap>
        <BottomBar>
          <UseButton type="button" onClick={() => goBackTo(navigate, '/create/capture')}>
            목록으로
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

    canvas.toBlob(
      (blob) => {
        if (!blob) return;
        const file = new File([blob], `scene-${scene.index}.jpg`, { type: 'image/jpeg' });
        setShot({ file, url: URL.createObjectURL(file), kind: 'photo' });
      },
      'image/jpeg',
      0.92,
    );
  };

  const stopRecording = (): void => {
    window.clearTimeout(stopTimerRef.current);
    if (recorderRef.current?.state === 'recording') recorderRef.current.stop();
  };

  const startRecording = (): void => {
    const stream = streamRef.current;
    if (!stream || needsRotate) return;

    const preferred = pickVideoMimeType();
    const recorder = new MediaRecorder(stream, {
      ...(preferred ? { mimeType: preferred } : {}),
      videoBitsPerSecond: VIDEO_BITS_PER_SECOND,
    });
    const chunks: Blob[] = [];

    recorder.ondataavailable = (event) => {
      if (event.data.size > 0) chunks.push(event.data);
    };

    recorder.onstop = () => {
      setIsRecording(false);
      const seconds = (Date.now() - startedAtRef.current) / 1000;
      // 파일 형식에는 코덱을 붙이지 않는다. 붙은 채 올리면 서버가 415 로 막는다.
      const type = baseMimeType(recorder.mimeType || preferred || 'video/webm');

      // 너무 짧은 영상은 생성 단계에서 실패한다. 그 자리에서 다시 찍게 한다.
      if (seconds < MIN_CLIP_SECONDS || chunks.length === 0) {
        setError('너무 짧아요. 다시 찍어주세요.');
        return;
      }

      const blob = new Blob(chunks, { type });
      const file = new File([blob], `scene-${scene.index}.${extensionForMimeType(type)}`, { type });
      setShot({
        file,
        url: URL.createObjectURL(file),
        kind: 'video',
        durationSeconds: Math.round(seconds * 10) / 10,
      });
    };

    recorderRef.current = recorder;
    startedAtRef.current = Date.now();
    setError(null);
    setIsRecording(true);
    recorder.start();
    stopTimerRef.current = window.setTimeout(stopRecording, scene.clipSeconds * 1000);
  };

  /**
   * 서버에 올려 검사를 받는다.
   * - 다시 찍으라고 하면 그 문구를 띄우고 다시 찍게 한다.
   * - 통과하면 저장하고 목록으로 돌아간다. 마지막 장이면 바로 생성 화면으로 간다.
   */
  const confirm = async (): Promise<void> => {
    if (!shot || isSubmitting) return;

    // 카드뉴스는 기다리지 않는다. 칸에 넣으면 뒤에서 올라가고, 제출은 목록에서 다 찍은 뒤 한 번에 한다.
    if (isBatch) {
      putPhoto(scene.index, shot.file, { shotKey: scene.shotKey, label: scene.label });
      goBackTo(navigate, '/create/capture');
      return;
    }

    if (!session || !storeId) return;

    const controller = new AbortController();
    submitRef.current = controller;
    setIsSubmitting(true);
    setError(null);

    try {
      const result = await submitScene(
        {
          sessionId: session.sessionId,
          storeId,
          format: draft.format,
          file: shot.file,
          durationSeconds: shot.durationSeconds,
        },
        controller.signal,
      );

      if (needsRetake(result)) {
        URL.revokeObjectURL(shot.url);
        setShot(null);
        setError(retakeMessage(result));
        return;
      }

      acceptCapture(
        scene.index,
        shot.file,
        { shotKey: scene.shotKey, label: scene.label },
        result.request ?? null,
      );

      if (result.generationJobId) {
        setGeneration({ jobId: result.generationJobId, submissionId: result.submissionId });
        void navigate('/create/generating', { replace: true });
        return;
      }
      goBackTo(navigate, '/create/capture');
    } catch (cause) {
      if (isAbortError(cause)) return;
      setError(cause instanceof Error ? cause.message : '올리지 못했어요. 다시 시도해 주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const retakeLabel = isGallery ? '다시 고르기' : '다시 찍기';

  return (
    <Stage>
      {shot ? (
        shot.kind === 'video' ? (
          <ReviewVideo src={shot.url} autoPlay loop muted playsInline />
        ) : (
          <Shot src={shot.url} alt="고른 사진" />
        )
      ) : isGallery ? (
        <PickArea type="button" onClick={openPicker}>
          <PhotoIcon />
          <PickText>탭해서 {isVideo ? '영상' : '사진'} 고르기</PickText>
          <PickHint>
            {isVideo ? `가로로 찍은 영상, ${scene.clipSeconds}초 이내면 좋아요` : 'jpg 또는 png'}
          </PickHint>
        </PickArea>
      ) : (
        <Preview ref={videoRef} autoPlay playsInline muted />
      )}

      {error && !isRecording && (!shot || !isSubmitting) && (
        <NoticeWrap>
          <Notice role="alert">{error}</Notice>
          {!shot && !isGallery && (
            <FallbackButton type="button" onClick={openPicker}>
              갤러리에서 고르기
            </FallbackButton>
          )}
        </NoticeWrap>
      )}

      <TopBar>
        <TopRow>
          {!shot && !isRecording && (
            <CloseButton type="button" aria-label="닫기" onClick={() => goBackTo(navigate, '/create/capture')}>
              <CloseIcon />
            </CloseButton>
          )}
          {isRecording ? (
            <RecChip>녹화 중</RecChip>
          ) : (
            <>
              <Counter style={{ marginLeft: shot ? 0 : 'auto' }}>
                {scene.index + 1}번째
              </Counter>
              {shot && <Counter>{scene.label}</Counter>}
            </>
          )}
        </TopRow>
        {!shot && (
          <>
            <Instruction>
              {isRecording
                ? '그대로 들고 계세요'
                : isGallery
                  ? scene.pickTitle
                  : scene.title}
            </Instruction>
            {!isRecording && (
              <Hint>{rejection ?? (isGallery ? GALLERY_HINT : scene.hint)}</Hint>
            )}
          </>
        )}
      </TopBar>

      {/* 세로로 들고 있으면 녹화를 막고 돌려 달라고 한다. 닫기는 위에 그대로 남는다. */}
      {needsRotate && (
        <RotateNotice role="alert">
          <RotateIcon />
          <RotateTitle>폰을 가로로 돌려 주세요</RotateTitle>
          <RotateHint>영상은 가로로 찍어야 광고에 쓸 수 있어요</RotateHint>
          <RotateButton type="button" onClick={() => void lockLandscape()}>
            가로 화면으로 바꾸기
          </RotateButton>
        </RotateNotice>
      )}

      {/* 예시 사진이 있는 장면만 띄운다. 빈 칸을 크게 두면 카메라 화면만 가린다. */}
      {!shot && !isGallery && !isRecording && !needsRotate && scene.sample && (
        <SampleWrap
          type="button"
          $wide={isVideo}
          aria-label="예시 크게 보기"
          onClick={() => setIsSampleOpen(true)}
        >
          <SampleFrame $wide={isVideo}>
            {isVideo ? (
              <SampleVideo src={scene.sample} autoPlay muted loop playsInline />
            ) : (
              <SampleImage src={scene.sample} alt="" />
            )}
          </SampleFrame>
          <SampleLabel>이렇게 찍어요</SampleLabel>
        </SampleWrap>
      )}

      {/* 크게 본 예시. 아무 데나 누르면 닫혀 바로 찍을 수 있다. */}
      {isSampleOpen && scene.sample && !shot && !isRecording && (
        <SampleViewer
          type="button"
          aria-label="예시 닫기"
          onClick={() => setIsSampleOpen(false)}
        >
          {isVideo ? (
            <SampleViewerVideo
              src={scene.sample}
              aria-label={`${scene.label} 예시`}
              autoPlay
              muted
              loop
              playsInline
            />
          ) : (
            <SampleViewerImage src={scene.sample} alt={`${scene.label} 예시`} />
          )}
          <SampleViewerHint>누르면 닫혀요</SampleViewerHint>
        </SampleViewer>
      )}

      <BottomBar>
        {shot ? (
          <ConfirmRow>
            <RetakeButton
              type="button"
              disabled={isSubmitting}
              onClick={() => {
                URL.revokeObjectURL(shot.url);
                setShot(null);
                if (isGallery) openPicker();
              }}
            >
              {retakeLabel}
            </RetakeButton>
            <UseButton type="button" disabled={isSubmitting} onClick={() => void confirm()}>
              {isSubmitting ? '확인하고 있어요' : '이걸로 할게요'}
            </UseButton>
          </ConfirmRow>
        ) : isRecording ? (
          <StopWrap>
            <Ring viewBox="0 0 68 68" $seconds={scene.clipSeconds} aria-hidden="true">
              <circle cx="34" cy="34" r="31" />
              <circle cx="34" cy="34" r="31" />
            </Ring>
            <StopButton type="button" aria-label="녹화 멈추기" onClick={stopRecording} />
          </StopWrap>
        ) : isGallery ? (
          <UseButton type="button" onClick={openPicker}>
            갤러리 열기
          </UseButton>
        ) : (
          <ShutterRow>
            <SideButton type="button" aria-label="갤러리에서 고르기" onClick={openPicker}>
              <PhotoIcon />
            </SideButton>
            {isVideo ? (
              <RecordButton
                type="button"
                aria-label={`녹화하기, 최대 ${scene.clipSeconds}초`}
                disabled={needsRotate}
                onClick={startRecording}
              />
            ) : (
              <Shutter type="button" aria-label="사진 찍기" onClick={takeShot} />
            )}
            <SideButton
              type="button"
              aria-label="앞뒤 카메라 전환"
              onClick={() =>
                setFacing((current) => (current === 'environment' ? 'user' : 'environment'))
              }
            >
              <FlipIcon />
            </SideButton>
          </ShutterRow>
        )}
      </BottomBar>

      <HiddenInput
        ref={fileInputRef}
        type="file"
        accept={isVideo ? 'video/*' : 'image/*'}
        onChange={(event) => {
          const [file] = Array.from(event.target.files ?? []);
          // 같은 것을 다시 고를 수 있게 값을 비운다.
          event.target.value = '';
          if (!file) return;
          const url = URL.createObjectURL(file);
          const kind = file.type.startsWith('video/') ? 'video' : 'photo';
          if (kind === 'photo') {
            setShot({ file, url, kind });
            return;
          }
          // 영상은 가로로 찍은 것만 받는다. 세로 영상은 생성 단계에서 쓰지 못한다.
          void readVideoSize(url).then((size) => {
            if (size && !isLandscapeVideo(size.width, size.height)) {
              URL.revokeObjectURL(url);
              setError('가로로 찍은 영상을 골라 주세요.');
              return;
            }
            setError(null);
            setShot({ file, url, kind });
          });
        }}
      />
    </Stage>
  );
};

export default CaptureCamera;
