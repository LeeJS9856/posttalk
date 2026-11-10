/**
 * 한 장면을 몇 초 녹화할지. 아직 확정이 아니다.
 * 장면마다 다르게 둘 수 있도록 Scene 이 값을 들고 다니고, 여기는 기본값만 둔다.
 */
export const DEFAULT_CLIP_SECONDS = 3;

/** 이보다 짧으면 쓰지 않는다. 생성 단계에서 실패하느니 그 자리에서 다시 찍는 게 싸다. */
export const MIN_CLIP_SECONDS = 1;

/** 릴스는 세로 9:16. 트랙 자체를 세로로 받아두면 따로 크롭하지 않아도 된다. */
export const VIDEO_ASPECT_RATIO = 9 / 16;

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
