import {
  openGuestSession,
  startAdSession,
  submitShot,
  uploadFile,
  type ShotResult,
  type StartSessionBody,
  type StartedSession,
  type UploadedFile,
} from '@/apis/posttalk';
import type { AdFormat } from '@/constants/home';
import { shrinkPhoto } from '@/constants/media';
import { MAX_CARD_NEWS_STYLE, SUGGESTION_THEMES, type SuggestionThemeId } from '@/constants/themes';

/**
 * 제작 흐름에서 화면이 부르는 묶음. 화면은 서버의 필드 이름을 몰라도 된다.
 */

type DraftInput = {
  format: AdFormat;
  theme: SuggestionThemeId;
  storeName: string;
  marketName: string;
  storeDescription: string;
  menus: { name: string; description: string }[];
  /** 관람객이 쓴 카드뉴스 디자인 요청. 비어 있으면 콘셉트 기본 문장을 쓴다. */
  cardNewsStyle: string;
};

/**
 * 정보 입력 화면의 값을 서버 필드로 옮긴다.
 * 서버는 대표 메뉴 소개(menuIntro)와 가게만의 특별함(storeSpecialty)을 글 하나씩 받는다.
 * 메뉴가 여러 개면 "이름 - 설명" 을 한 줄에 하나씩 보낸다.
 * 서버는 카드뉴스 캡션을 이 글로 그대로 만든다. 쉼표로 이으면 설명 끝 마침표와 붙어 "…요., 다음 메뉴" 처럼 읽힌다.
 */
const toStartBody = (draft: DraftInput, storeId: string): StartSessionBody => {
  const menuIntro = draft.menus
    .map((menu) => (menu.description ? `${menu.name} - ${menu.description}` : menu.name))
    .join('\n');
  const base = {
    storeId,
    menuIntro,
    storeSpecialty: draft.storeDescription,
  };

  if (draft.format === 'reels') {
    // 릴스의 미니멀은 서버 이름이 simple 이다.
    return {
      ...base,
      adType: 'video',
      reelsConcept: draft.theme === 'minimal' ? 'simple' : 'christmas',
    };
  }
  // 관람객이 쓴 요청을 그대로 보내고, 비워 뒀으면 콘셉트에 맞춰 정해 둔 문장을 대신 보낸다.
  const theme = SUGGESTION_THEMES.find((item) => item.id === draft.theme);
  const style = draft.cardNewsStyle.trim() || theme?.cardNewsStyle || '';
  return {
    ...base,
    adType: 'photo',
    cardNewsTheme: draft.theme,
    ...(style ? { cardNewsStyle: style.slice(0, MAX_CARD_NEWS_STYLE) } : {}),
  };
};

/**
 * 제작 세션을 연다. 그 전에 가게 이름과 시장·지역을 작업 공간에 다시 보낸다.
 * 같은 키로 보내면 서버 값이 바뀐다. 보내지 않으면 서버가 "가게" · "전통시장"을 넣는다.
 */
export const startSession = async (
  draft: DraftInput,
  storeId: string,
  signal?: AbortSignal,
): Promise<StartedSession> => {
  // 시장·지역은 카드뉴스 AI 의 지역(area)이 된다. 빈 값은 보내지 않는다(서버 값이 지워지지 않게).
  const store = {
    ...(draft.storeName ? { storeName: draft.storeName } : {}),
    ...(draft.marketName ? { marketName: draft.marketName } : {}),
  };
  if (Object.keys(store).length > 0) await openGuestSession(store, signal);
  return startAdSession(toStartBody(draft, storeId), signal);
};

/** 영상 파일의 길이(초). 읽지 못하면 undefined. 서버가 길이를 함께 받는다. */
export const readVideoDuration = (file: File): Promise<number | undefined> =>
  new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const video = document.createElement('video');
    const done = (value: number | undefined): void => {
      URL.revokeObjectURL(url);
      resolve(value);
    };
    video.preload = 'metadata';
    video.onloadedmetadata = () =>
      done(Number.isFinite(video.duration) ? Math.round(video.duration * 10) / 10 : undefined);
    video.onerror = () => done(undefined);
    video.src = url;
  });

/**
 * 한 장면을 올리고 세션에 제출한다. 사진은 먼저 줄인다. 서버가 사진을 검사해 다시 찍으라고 할 수 있다.
 * 영상 길이를 이미 알면(직접 녹화) 넘기고, 모르면(갤러리) 파일에서 읽는다.
 */
export const submitScene = async (
  {
    sessionId,
    storeId,
    format,
    file,
    durationSeconds,
  }: {
    sessionId: string;
    storeId: string;
    format: AdFormat;
    file: File;
    durationSeconds?: number;
  },
  signal?: AbortSignal,
): Promise<ShotResult> => {
  const isVideo = format === 'reels';
  // 사진은 줄여서 보낸다. 원본이 크면 업로드가 오래 걸리고 413으로 막힌다.
  const toUpload = isVideo ? file : await shrinkPhoto(file);
  const uploaded = await uploadFile(
    { file: toUpload, storeId, assetType: isVideo ? 'video_clip' : 'food_photo' },
    signal,
  );
  const duration = isVideo ? (durationSeconds ?? (await readVideoDuration(file))) : undefined;

  return submitShot(
    sessionId,
    isVideo ? 'video' : 'photo',
    { ...uploaded, ...(duration !== undefined ? { durationSeconds: duration } : {}) },
    signal,
  );
};

/** 사진 한 장을 줄여서 올린다. 카드뉴스는 찍자마자 뒤에서 올려 두고, 제출은 다 찍은 뒤에 한다. */
export const uploadPhoto = async (
  file: File,
  storeId: string,
  signal?: AbortSignal,
): Promise<UploadedFile> =>
  uploadFile({ file: await shrinkPhoto(file), storeId, assetType: 'food_photo' }, signal);

/** 서버가 다시 찍으라고 했는지. */
export const needsRetake = (result: ShotResult): boolean =>
  result.response === 'fail' || result.review?.recommendedAction === 'retake';

/** 다시 찍기 안내 문구. 서버 문장을 그대로 쓰고, 없으면 기본 문구. */
export const retakeMessage = (result: ShotResult): string =>
  result.retryMessage ||
  result.review?.feedback?.[0] ||
  result.review?.summary ||
  '다시 찍어주세요.';
