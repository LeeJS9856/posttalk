import type { ShotRequest } from '@/apis/posttalk';
import type { AdFormat } from '@/constants/home';
import { DEFAULT_CLIP_SECONDS } from '@/constants/media';

/** 재료를 어디서 가져오는지. 장면마다 관람객이 직접 고른다. */
export type CaptureSource = 'camera' | 'gallery';

/** 사진으로 받을지 영상으로 받을지. 서버 요청의 assetType 이 정한다. */
export type SceneKind = 'photo' | 'video';

export type Scene = {
  /** 몇 번째 장면인지(0부터). 주소와 저장 키로 쓴다. */
  index: number;
  /** 서버의 촬영 슬롯 이름 */
  shotKey: string;
  /** 목록 슬롯에 적는 짧은 이름 */
  label: string;
  /** 직접 찍을 때 카메라 화면 상단에 띄우는 지시 */
  title: string;
  /** 갤러리에서 고를 때 띄우는 지시 */
  pickTitle: string;
  /** 직접 찍을 때의 구도 안내 */
  hint: string;
  /** 바텀시트에서 먼저 권하는 쪽. 강제하지 않는다. */
  recommended: CaptureSource;
  kind: SceneKind;
  /** 영상 장면의 길이 */
  clipSeconds: number;
};

/** 갤러리로 고를 때는 구도를 안내할 게 없다. 장면과 무관하게 같은 문구를 쓴다. */
export const GALLERY_HINT = '미리 준비된 것 중에서 고르면 돼요';

type SceneCopy = Pick<Scene, 'label' | 'title' | 'pickTitle' | 'hint' | 'recommended'>;

/**
 * 알고 있는 장면의 안내. 몇 장을 어떤 순서로 찍을지는 서버가 정하고(다음 장면을 하나씩 알려 준다),
 * 여기는 이름이 익숙한 장면에 더 친절한 문구와 권장 경로를 붙일 뿐이다.
 * 처음 보는 장면은 서버가 준 안내 문구로 만든다(sceneFromRequest).
 */
const KNOWN_SCENES: Readonly<Record<string, SceneCopy>> = {
  card_bowl: {
    label: '대표 음식 전체',
    title: '대표 음식을 그릇째 찍어주세요',
    pickTitle: '대표 음식 사진을 골라주세요',
    hint: '그릇 전체가 화면에 들어오게',
    recommended: 'camera',
  },
  card_zoom: {
    label: '음식 확대',
    title: '대표 음식을 가까이에서 찍어주세요',
    pickTitle: '가까이 찍은 음식 사진을 골라주세요',
    hint: '음식의 결이 보이도록 가까이',
    recommended: 'camera',
  },
  card_food1: {
    label: '음식 사진 1',
    title: '음식을 한 장 더 찍어주세요',
    pickTitle: '음식 사진을 골라주세요',
    hint: '접시를 위에서 내려찍어주세요',
    recommended: 'camera',
  },
  card_food2: {
    label: '음식 사진 2',
    title: '음식을 한 장 더 찍어주세요',
    pickTitle: '음식 사진을 골라주세요',
    hint: '앞 사진과 다른 구도면 좋아요',
    recommended: 'camera',
  },
  card_store1: {
    label: '가게 밖',
    title: '가게 밖을 찍어주세요',
    pickTitle: '가게 밖 사진을 골라주세요',
    hint: '간판이 함께 보이면 좋아요',
    recommended: 'gallery',
  },
  card_store2: {
    label: '가게 안 · 메뉴판',
    title: '가게 안이나 메뉴판을 찍어주세요',
    pickTitle: '가게 안이나 메뉴판 사진을 골라주세요',
    hint: '메뉴판 글씨가 읽히게',
    recommended: 'gallery',
  },
  video_storefront_sign: {
    label: '가게 간판',
    title: '가게 간판을 찍어주세요',
    pickTitle: '간판 영상을 골라주세요',
    hint: '간판 글씨가 다 들어오게',
    recommended: 'gallery',
  },
  video_signature_menu: {
    label: '대표 메뉴',
    title: '대표 메뉴를 찍어주세요',
    pickTitle: '대표 메뉴 영상을 골라주세요',
    hint: '음식을 천천히 비춰주세요',
    recommended: 'camera',
  },
  video_signature_interaction: {
    label: '메뉴 상세',
    title: '음식을 집거나 들어 보여주세요',
    pickTitle: '음식을 집거나 드는 영상을 골라주세요',
    hint: '손이 함께 보이면 좋아요',
    recommended: 'camera',
  },
  video_side_menu: {
    label: '두 번째 메뉴',
    title: '두 번째 메뉴를 찍어주세요',
    pickTitle: '두 번째 메뉴 영상을 골라주세요',
    hint: '음식을 천천히 비춰주세요',
    recommended: 'camera',
  },
  video_side_menu_interaction: {
    label: '두 번째 메뉴 상세',
    title: '음식을 집거나 들어 보여주세요',
    pickTitle: '음식을 집거나 드는 영상을 골라주세요',
    hint: '단면이나 결이 보이면 좋아요',
    recommended: 'camera',
  },
  video_cooking_scene: {
    label: '조리 장면',
    title: '만드는 모습을 찍어주세요',
    pickTitle: '조리 영상을 골라주세요',
    hint: '불이나 손이 움직이는 게 보이면 좋아요',
    recommended: 'camera',
  },
  video_menu_board: {
    label: '메뉴판',
    title: '메뉴판을 찍어주세요',
    pickTitle: '메뉴판 영상을 골라주세요',
    hint: '글씨가 읽히도록 천천히',
    recommended: 'gallery',
  },
  video_storefront_entry: {
    label: '가게 입구',
    title: '가게 입구를 찍어주세요',
    pickTitle: '가게 입구 영상을 골라주세요',
    hint: '들어가는 길이 보이게',
    recommended: 'gallery',
  },
};

/** 서버 요청의 assetType 으로 사진·영상을 가르고, 없으면 형식으로 짐작한다. */
const kindOf = (request: ShotRequest, format: AdFormat): SceneKind => {
  if (request.assetType === 'video_clip') return 'video';
  if (request.assetType === 'food_photo') return 'photo';
  return format === 'reels' ? 'video' : 'photo';
};

/**
 * 서버가 요구한 다음 장면을 화면이 쓰는 장면으로 바꾼다.
 * - 아는 장면: 정해 둔 문구를 쓰되, 서버 안내 문구가 있으면 지시와 힌트는 서버 쪽을 쓴다.
 * - 처음 보는 장면: 서버 안내 문구로 이름과 지시를 만든다.
 * 서버 안내 문구가 메뉴 이름("제육볶음")처럼 짧으면 이름표로도 쓴다.
 */
export const sceneFromRequest = (request: ShotRequest, index: number, format: AdFormat): Scene => {
  const kind = kindOf(request, format);
  const known = KNOWN_SCENES[request.shotKey];
  const prompt = request.prompt?.trim();
  const helper = request.helperText?.trim();
  const noun = kind === 'video' ? '영상' : '사진';

  const fallbackTitle = prompt || `${index + 1}번째 ${noun}을 찍어주세요`;
  const label = known?.label ?? (prompt && prompt.length <= 12 ? prompt : `${index + 1}번째 ${noun}`);

  return {
    index,
    shotKey: request.shotKey,
    label,
    title: known ? (prompt && prompt.length > 12 ? prompt : known.title) : fallbackTitle,
    pickTitle: known?.pickTitle ?? `${label} ${noun}을 골라주세요`,
    hint: helper || known?.hint || '',
    recommended: known?.recommended ?? 'camera',
    kind,
    clipSeconds: DEFAULT_CLIP_SECONDS,
  };
};

/**
 * 릴스 장면. 인트로 1 + 메뉴당 2 + 아웃트로 1 이라 메뉴 1·2·3개에 영상 4·6·8개다.
 *
 * shotKey 는 서버가 요구하는 순서 그대로다(2026-11-16 실측). 서버 쪽 이름은 아직
 * 기획과 다르지만(간판·사이드메뉴·조리), 개수와 자리가 정확히 맞아 그 자리에
 * 기획에서 정한 안내를 붙인다. 서버가 이름을 바꾸면 이 배열만 고친다.
 */
const REELS_SHOT_ORDER = [
  'video_storefront_sign',
  'video_signature_menu',
  'video_signature_interaction',
  'video_side_menu',
  'video_side_menu_interaction',
  'video_cooking_scene',
  'video_menu_board',
  'video_storefront_entry',
] as const;

const reelsScene = (
  shotKey: string,
  index: number,
  copy: Pick<Scene, 'label' | 'title' | 'pickTitle' | 'hint' | 'recommended'>,
): Scene => ({ index, shotKey, kind: 'video', clipSeconds: DEFAULT_CLIP_SECONDS, ...copy });

export const buildReelsScenes = (menus: readonly { name: string }[]): Scene[] => {
  const used = menus.slice(0, 3);
  const scenes: Scene[] = [
    reelsScene(REELS_SHOT_ORDER[0], 0, {
      label: '인트로 · 메뉴판',
      title: '메뉴판을 찍어주세요',
      pickTitle: '메뉴판 영상을 골라주세요',
      hint: '글씨가 읽히도록 천천히',
      recommended: 'camera',
    }),
  ];

  used.forEach((menu, order) => {
    scenes.push(
      reelsScene(REELS_SHOT_ORDER[1 + order * 2], scenes.length, {
        label: menu.name,
        title: `${menu.name}을(를) 찍어주세요`,
        pickTitle: `${menu.name} 영상을 골라주세요`,
        hint: '음식을 가까이에서 천천히 비춰주세요',
        recommended: 'camera',
      }),
    );
    scenes.push(
      reelsScene(REELS_SHOT_ORDER[2 + order * 2], scenes.length, {
        label: `${menu.name} 단면`,
        title: `${menu.name}의 단면이나 질감을 보여주세요`,
        pickTitle: `${menu.name} 단면 영상을 골라주세요`,
        hint: '자르거나 집어 올려 속이 보이게',
        recommended: 'camera',
      }),
    );
  });

  scenes.push(
    reelsScene(REELS_SHOT_ORDER[7], scenes.length, {
      label: '아웃트로 · 가게',
      title: '가게 모습을 찍어주세요',
      pickTitle: '가게 영상을 골라주세요',
      hint: '가게 전체가 보이게 한 바퀴',
      recommended: 'camera',
    }),
  );

  return scenes;
};

/**
 * 카드뉴스 장면 순서. 운영 서버에서 확인한 순서다(2026-11-15).
 * 카드뉴스는 다 찍은 뒤 한 번에 제출한다. 서버는 이 순서로만 받으므로 제출도 이 순서로 한다.
 * 제출할 때 서버가 요구한 장면과 다르면 멈춘다(서버 순서가 바뀐 경우).
 */
export const CARD_NEWS_SHOT_KEYS = [
  'card_bowl',
  'card_zoom',
  'card_food1',
  'card_food2',
  'card_store1',
  'card_store2',
] as const;

export const CARD_NEWS_SCENES: readonly Scene[] = CARD_NEWS_SHOT_KEYS.map((shotKey, index) =>
  sceneFromRequest({ shotKey, assetType: 'food_photo' }, index, 'card_news'),
);

/**
 * 장면을 미리 알고 다 찍은 뒤 한 번에 제출하는 형식인지.
 * 릴스는 메뉴 수에 따라 장면이 바뀌는데 서버 쪽 구성이 아직 정해지지 않아, 서버가 한 장씩 알려 주는 방식을 쓴다.
 */
/** 장면을 미리 알고 다 찍은 뒤 한 번에 제출하는 형식인지. 이제 둘 다 그렇다. */
export const isBatchFormat = (_format: AdFormat): boolean => true;

/** 포맷에 맞는 장면 목록. */
export const scenesFor = (format: AdFormat, menus: readonly { name: string }[]): readonly Scene[] =>
  format === 'reels' ? buildReelsScenes(menus) : CARD_NEWS_SCENES;
