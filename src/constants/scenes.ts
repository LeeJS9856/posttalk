import type { AdFormat } from '@/constants/home';
import { DEFAULT_CLIP_SECONDS } from '@/constants/media';

/** 재료를 어디서 가져오는지. 장면마다 관람객이 직접 고른다. */
export type CaptureSource = 'camera' | 'gallery';

/** 사진으로 받을지 영상으로 받을지. 형식이 정한다. */
export type SceneKind = 'photo' | 'video';

export type Scene = {
  index: number;
  /** 서버의 촬영 슬롯 이름. 서버가 요구하는 순서와 맞는지 확인하는 데 쓴다. */
  shotKey: string;
  /** 목록 슬롯에 적는 짧은 이름 */
  label: string;
  /** 직접 찍을 때 카메라 화면 상단에 띄우는 지시. 서버가 안내 문구를 주면 그쪽을 쓴다. */
  title: string;
  /** 갤러리에서 고를 때 띄우는 지시 */
  pickTitle: string;
  /** 직접 찍을 때의 구도 안내 */
  hint: string;
  /** 바텀시트에서 먼저 권하는 쪽. 강제하지 않는다. */
  recommended: CaptureSource;
  kind: SceneKind;
  /** 영상 장면의 길이. 장면마다 다를 수 있어 여기에 둔다. */
  clipSeconds: number;
};

/** 갤러리로 고를 때는 구도를 안내할 게 없다. 장면과 무관하게 같은 문구를 쓴다. */
export const GALLERY_HINT = '미리 준비된 것 중에서 고르면 돼요';

type SceneSeed = Omit<Scene, 'index' | 'kind' | 'clipSeconds'>;

/**
 * 카드뉴스 사진 6장. 순서는 서버의 촬영 순서와 같다(card_bowl → … → card_store2).
 * 서버가 이 순서대로 슬롯에 연결하므로 프론트가 순서를 바꾸지 않는다.
 */
const CARD_NEWS_SCENES: readonly SceneSeed[] = [
  {
    shotKey: 'card_bowl',
    label: '대표 음식 전체',
    title: '대표 음식을 그릇째 찍어주세요',
    pickTitle: '대표 음식 사진을 골라주세요',
    hint: '그릇 전체가 화면에 들어오게',
    recommended: 'camera',
  },
  {
    shotKey: 'card_zoom',
    label: '음식 확대',
    title: '대표 음식을 가까이에서 찍어주세요',
    pickTitle: '가까이 찍은 음식 사진을 골라주세요',
    hint: '음식의 결이 보이도록 가까이',
    recommended: 'camera',
  },
  {
    shotKey: 'card_food1',
    label: '다른 음식 1',
    title: '다른 메뉴를 찍어주세요',
    pickTitle: '다른 메뉴 사진을 골라주세요',
    hint: '접시를 위에서 내려찍어주세요',
    recommended: 'camera',
  },
  {
    shotKey: 'card_food2',
    label: '다른 음식 2',
    title: '메뉴를 하나 더 찍어주세요',
    pickTitle: '메뉴 사진을 하나 더 골라주세요',
    hint: '앞 사진과 다른 메뉴면 좋아요',
    recommended: 'camera',
  },
  {
    shotKey: 'card_store1',
    label: '가게 밖',
    title: '가게 밖을 찍어주세요',
    pickTitle: '가게 밖 사진을 골라주세요',
    hint: '간판이 함께 보이면 좋아요',
    recommended: 'gallery',
  },
  {
    shotKey: 'card_store2',
    label: '가게 안 · 메뉴판',
    title: '가게 안이나 메뉴판을 찍어주세요',
    pickTitle: '가게 안이나 메뉴판 사진을 골라주세요',
    hint: '메뉴판 글씨가 읽히게',
    recommended: 'gallery',
  },
];

/**
 * 릴스 영상 4개. 순서는 서버의 촬영 순서와 같다.
 * 가게 장면도 영상으로 받는다(서버 명세). 전시장에는 찍을 가게가 없어 갤러리를 권한다.
 */
const REELS_SCENES: readonly SceneSeed[] = [
  {
    shotKey: 'video_storefront_sign',
    label: '가게 간판',
    title: '가게 간판을 찍어주세요',
    pickTitle: '간판 영상을 골라주세요',
    hint: '간판 글씨가 다 들어오게',
    recommended: 'gallery',
  },
  {
    shotKey: 'video_signature_menu',
    label: '대표 메뉴',
    title: '대표 메뉴를 찍어주세요',
    pickTitle: '대표 메뉴 영상을 골라주세요',
    hint: '음식을 천천히 비춰주세요',
    recommended: 'camera',
  },
  {
    shotKey: 'video_signature_interaction',
    label: '메뉴 상세',
    title: '음식을 집거나 들어 보여주세요',
    pickTitle: '음식을 집거나 드는 영상을 골라주세요',
    hint: '손이 함께 보이면 좋아요',
    recommended: 'camera',
  },
  {
    shotKey: 'video_storefront_entry',
    label: '가게 입구',
    title: '가게 입구를 찍어주세요',
    pickTitle: '가게 입구 영상을 골라주세요',
    hint: '들어가는 길이 보이게',
    recommended: 'gallery',
  },
];

/** 형식이 정하는 촬영 장면 목록. 메뉴 수와 상관없이 고정이다. */
export const buildScenes = (format: AdFormat): Scene[] => {
  const kind: SceneKind = format === 'reels' ? 'video' : 'photo';
  const seeds = format === 'reels' ? REELS_SCENES : CARD_NEWS_SCENES;
  return seeds.map((seed, index) => ({
    ...seed,
    index,
    kind,
    clipSeconds: DEFAULT_CLIP_SECONDS,
  }));
};
