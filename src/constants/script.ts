import type { AdFormat } from '@/constants/home';
import type { Scene } from '@/constants/scenes';
import type { DraftMenu } from '@/hooks/useAdDraft';

/**
 * 자막 한 줄의 글자 수 상한. 넘치면 영상 밖으로 나간다.
 * 실제 값은 AI 쪽 템플릿이 정한다. 확정되면 이 숫자만 고치면 된다.
 */
export const MAX_SUBTITLE_LENGTH = 24;

/**
 * 자막을 쓰는 템플릿인지. 쓰지 않으면 자막 확인 화면을 건너뛴다.
 * 지금은 포맷으로만 가르지만, 템플릿 조회 API 가 붙으면 그 값을 본다.
 */
export const usesSubtitles = (format: AdFormat): boolean => format === 'reels';

export type ScriptLine = {
  sceneIndex: number;
  text: string;
  /** AI 가 처음 준 문장. 되돌리기가 여기로 돌린다. */
  original: string;
};

const LIFT_SUFFIX = ' 들어올리기';

const clamp = (text: string): string =>
  text.length > MAX_SUBTITLE_LENGTH ? `${text.slice(0, MAX_SUBTITLE_LENGTH - 1)}…` : text;

const firstSentence = (text: string): string => (text.split(/[.!?\n]/)[0] ?? '').trim();

/**
 * 생성 API 가 붙기 전까지 쓰는 표본 대본.
 * 실제로는 재료를 찍는 동안 AI 가 가게 정보를 보고 만들어 둔다.
 */
export const buildDraftScript = (
  scenes: readonly Scene[],
  storeDescription: string,
  menus: readonly DraftMenu[],
): ScriptLine[] =>
  scenes.map((scene) => {
    const menu = menus.find(
      (item) => scene.label === item.name || scene.label === `${item.name}${LIFT_SUFFIX}`,
    );

    let text: string;
    if (!menu) {
      text = firstSentence(storeDescription) || '오래 지켜온 우리 가게';
    } else if (scene.label.endsWith(LIFT_SUFFIX)) {
      text = `${menu.name} 한 입이면 바로 알아요`;
    } else {
      text = menu.description ? `${menu.name}, ${menu.description}` : `오늘 준비한 ${menu.name}`;
    }

    const clamped = clamp(text);
    return { sceneIndex: scene.index, text: clamped, original: clamped };
  });
