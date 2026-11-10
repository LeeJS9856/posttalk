import type { DraftMenu } from '@/hooks/useAdDraft';

export type Scene = {
  index: number;
  /** 목록 슬롯에 적는 짧은 이름 */
  label: string;
  /** 카메라 화면 상단에 띄우는 지시 */
  title: string;
  hint: string;
  /** 가게 장면은 촬영 대상이 없으므로 갤러리에서 고른다 */
  source: 'camera' | 'gallery';
};

/**
 * 촬영 장면 목록. 템플릿 장면 구성과 메뉴 수로 결정된다.
 * 지금은 가게 장면 하나에 메뉴마다 두 장면을 더하는 임시 규칙을 쓴다.
 */
export const buildScenes = (menus: readonly DraftMenu[]): Scene[] => {
  const scenes: Scene[] = [
    {
      index: 0,
      label: '가게 입구',
      title: '가게 사진을 골라주세요',
      hint: '미리 준비된 사진 중에서 고르면 돼요',
      source: 'gallery',
    },
  ];

  menus.forEach((menu) => {
    scenes.push({
      index: scenes.length,
      label: menu.name,
      title: `${menu.name}을(를) 찍어주세요`,
      hint: '접시를 위에서 내려찍어주세요',
      source: 'camera',
    });
    scenes.push({
      index: scenes.length,
      label: `${menu.name} 들어올리기`,
      title: `${menu.name}을(를) 들어올려 주세요`,
      hint: '손이 함께 보이면 좋아요',
      source: 'camera',
    });
  });

  return scenes;
};
