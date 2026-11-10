import type { DraftMenu } from '@/hooks/useAdDraft';

/** 재료를 어디서 가져오는지. 장면마다 관람객이 직접 고른다. */
export type CaptureSource = 'camera' | 'gallery';

export type Scene = {
  index: number;
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
};

/** 갤러리로 고를 때는 구도를 안내할 게 없다. 장면과 무관하게 같은 문구를 쓴다. */
export const GALLERY_HINT = '미리 준비된 사진 중에서 고르면 돼요';

/**
 * 촬영 장면 목록. 템플릿 장면 구성과 메뉴 수로 결정된다.
 * 지금은 가게 장면 하나에 메뉴마다 두 장면을 더하는 임시 규칙을 쓴다.
 */
export const buildScenes = (menus: readonly DraftMenu[]): Scene[] => {
  const scenes: Scene[] = [
    {
      index: 0,
      label: '가게 입구',
      title: '가게 입구를 찍어주세요',
      pickTitle: '가게 사진을 골라주세요',
      hint: '간판이 함께 보이면 좋아요',
      // 전시장에서는 가게가 없으므로 미리 넣어둔 사진을 권한다.
      recommended: 'gallery',
    },
  ];

  menus.forEach((menu) => {
    scenes.push({
      index: scenes.length,
      label: menu.name,
      title: `${menu.name}을(를) 찍어주세요`,
      pickTitle: `${menu.name} 사진을 골라주세요`,
      hint: '접시를 위에서 내려찍어주세요',
      recommended: 'camera',
    });
    scenes.push({
      index: scenes.length,
      label: `${menu.name} 들어올리기`,
      title: `${menu.name}을(를) 들어올려 주세요`,
      pickTitle: `들어올린 ${menu.name} 사진을 골라주세요`,
      hint: '손이 함께 보이면 좋아요',
      recommended: 'camera',
    });
  });

  return scenes;
};
