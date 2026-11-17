/**
 * 한 장면을 최대 몇 초까지 녹화할지. 관람객이 멈추기 전에 이 시간이 되면 저절로 멈춘다.
 * 장면마다 다르게 둘 수 있도록 Scene 이 값을 들고 다니고, 여기는 기본값만 둔다.
 */
export const DEFAULT_CLIP_SECONDS = 10;

/** 이보다 짧으면 쓰지 않는다. 생성 단계에서 실패하느니 그 자리에서 다시 찍는 게 싸다. */
export const MIN_CLIP_SECONDS = 1;

/**
 * 릴스 재료는 가로 16:9 로 찍어 넘긴다(2026-11-18 릴스 AI 팀과 합의). 세로 릴스로 만드는 일은 서버가 한다.
 * 관람객이 폰을 가로로 돌려 찍고, 트랙도 가로로 받아 따로 크롭하지 않는다.
 */
export const VIDEO_ASPECT_RATIO = 16 / 9;

/** 가로로 찍은 영상인지. 갤러리에서 고른 영상도 이걸로 거른다. */
export const isLandscapeVideo = (width: number, height: number): boolean => width > height;

type LockableOrientation = ScreenOrientation & {
  lock?: (orientation: 'landscape') => Promise<void>;
  unlock?: () => void;
};

/**
 * 화면을 가로로 고정한다. 안드로이드 크롬은 전체 화면이어야 고정을 받아 준다.
 * 아이폰 사파리는 고정을 지원하지 않아 false 가 돌아온다. 그때는 돌려 달라는 안내로 대신한다.
 * 전체 화면 요청은 사용자의 탭 직후에만 통한다.
 */
export const lockLandscape = async (): Promise<boolean> => {
  const orientation = screen.orientation as LockableOrientation | undefined;
  if (!orientation?.lock) return false;
  try {
    if (!document.fullscreenElement && document.documentElement.requestFullscreen) {
      await document.documentElement.requestFullscreen({ navigationUI: 'hide' });
    }
    await orientation.lock('landscape');
    return true;
  } catch {
    return false;
  }
};

/** 가로 고정과 전체 화면을 푼다. 촬영 화면을 나갈 때 부른다. */
export const unlockOrientation = (): void => {
  try {
    (screen.orientation as LockableOrientation | undefined)?.unlock?.();
  } catch {
    // 고정한 적이 없으면 던지는 브라우저가 있다.
  }
  if (document.fullscreenElement) void document.exitFullscreen().catch(() => undefined);
};

/** 영상 파일의 가로·세로 크기를 읽는다. 읽지 못하면 null. */
export const readVideoSize = (url: string): Promise<{ width: number; height: number } | null> =>
  new Promise((resolve) => {
    const video = document.createElement('video');
    video.preload = 'metadata';
    video.muted = true;
    video.onloadedmetadata = () => resolve({ width: video.videoWidth, height: video.videoHeight });
    video.onerror = () => resolve(null);
    video.src = url;
  });

/**
 * 기기가 받아주는 첫 형식을 쓴다.
 * 안드로이드 크롬은 보통 webm, iOS 사파리는 mp4 만 된다.
 * 백엔드가 받는 형식이 정해지면 이 목록만 고치면 된다.
 */
const PREFERRED_MIME_TYPES = [
  'video/mp4;codecs=avc1',
  'video/mp4',
  'video/webm;codecs=vp9',
  'video/webm;codecs=vp8',
  'video/webm',
] as const;

export const pickVideoMimeType = (): string | undefined => {
  if (typeof MediaRecorder === 'undefined') return undefined;
  return PREFERRED_MIME_TYPES.find((type) => MediaRecorder.isTypeSupported(type));
};

/** blob 의 형식에서 파일 확장자를 고른다. 확장자가 틀리면 업로드 쪽에서 거른다. */
export const extensionForMimeType = (mimeType: string): string =>
  mimeType.includes('mp4') ? 'mp4' : 'webm';

/**
 * 영상 썸네일용 주소. 크롬은 preload=metadata 만으로는 첫 프레임을 그리지 않아
 * 까만 상자가 남는다. 0.1초 지점을 가리키면 그 프레임을 그려 포스터처럼 쓸 수 있다.
 */
export const posterSrc = (url: string): string => `${url}#t=0.1`;

/**
 * 카메라를 쓸 수 있는 주소인지. 브라우저는 https 나 localhost 가 아니면
 * navigator.mediaDevices 자체를 감춘다. 사내망 http 주소로 폰에서 열면 여기서 걸린다.
 */
export const canUseCamera = (): boolean =>
  window.isSecureContext && typeof navigator.mediaDevices?.getUserMedia === 'function';

/** 카메라를 열지 못한 이유를 사람이 알아들을 말로. 이유마다 할 일이 다르다. */
export const cameraErrorMessage = (cause: unknown): string => {
  if (!canUseCamera()) return '이 주소에서는 카메라를 쓸 수 없어요. https 주소로 열어 주세요.';
  const name = cause instanceof DOMException ? cause.name : '';
  if (name === 'NotAllowedError' || name === 'SecurityError') {
    return '카메라 권한이 필요해요. 브라우저에서 허용해 주세요.';
  }
  if (name === 'NotFoundError' || name === 'OverconstrainedError') {
    return '이 기기에서 카메라를 찾지 못했어요.';
  }
  if (name === 'NotReadableError' || name === 'AbortError') {
    return '다른 앱이 카메라를 쓰고 있어요. 그 앱을 닫고 다시 열어 주세요.';
  }
  return '카메라를 열지 못했어요.';
};

/**
 * 올리기 전에 사진을 줄이는 기준. 폰 원본(PNG 캡처는 15MB를 넘기도 한다)을 그대로 보내면
 * 전시장 와이파이에서 오래 걸리고 서버 앞단에서 413으로 막힌다. 카드뉴스에는 이 정도면 충분하다.
 */
export const MAX_PHOTO_EDGE = 2048;
const PHOTO_QUALITY = 0.9;
/** 이보다 작고 가장자리도 기준 안이면 손대지 않는다. */
const SHRINK_THRESHOLD_BYTES = 1_500_000;

/**
 * 사진을 긴 변 MAX_PHOTO_EDGE 이하의 JPEG 로 줄인다. 영상과 읽지 못하는 형식(HEIC 등)은 그대로 둔다.
 * 줄인 결과가 원본보다 크면 원본을 쓴다.
 */
export const shrinkPhoto = async (file: File): Promise<File> => {
  if (!file.type.startsWith('image/') || typeof createImageBitmap === 'undefined') return file;

  let bitmap: ImageBitmap;
  try {
    // 폰 사진의 회전 정보(EXIF)를 반영해 그린다. 안 하면 옆으로 누운 채 올라간다.
    bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' });
  } catch {
    return file;
  }

  const scale = Math.min(1, MAX_PHOTO_EDGE / Math.max(bitmap.width, bitmap.height));
  if (scale === 1 && file.size <= SHRINK_THRESHOLD_BYTES) {
    bitmap.close();
    return file;
  }

  const canvas = document.createElement('canvas');
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  canvas.getContext('2d')?.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, 'image/jpeg', PHOTO_QUALITY),
  );
  if (!blob || blob.size >= file.size) return file;

  const baseName = file.name.replace(/\.[^.]+$/, '') || 'photo';
  return new File([blob], `${baseName}.jpg`, { type: 'image/jpeg' });
};
