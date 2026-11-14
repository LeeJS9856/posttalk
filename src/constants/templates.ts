export type TemplateMenu = {
  name: string;
  description: string;
};

export type StoreTemplate = {
  templateId: string;
  name: string;
  storeDescription: string;
  menus: TemplateMenu[];
};

/**
 * 저장된 가게·메뉴 정보. 템플릿 조회 API 가 붙기 전까지 쓰는 표본이다.
 * 전시에서는 운영자가 전시 음식에 맞춰 미리 저장해둔다.
 */
export const SAMPLE_TEMPLATES: readonly StoreTemplate[] = [
  {
    templateId: 'tpl-1',
    name: '창억떡집',
    storeDescription: '20년째 같은 자리에서 떡을 만드는 떡집이에요. 매일 아침 직접 쪄서 냅니다.',
    menus: [
      { name: '창억떡', description: '쫄깃하고 팥이 가득해요' },
      { name: '꿀떡', description: '' },
    ],
  },
  {
    templateId: 'tpl-2',
    name: '쿠키 가게',
    storeDescription: '버터를 아끼지 않고 굽는 작은 쿠키 가게예요.',
    menus: [{ name: '버터쿠키', description: '바삭하고 버터 향이 진해요' }],
  },
  {
    templateId: 'tpl-3',
    name: '동네 빵집',
    storeDescription: '아침마다 갓 구운 빵을 내는 동네 빵집이에요.',
    menus: [
      { name: '소금빵', description: '겉은 바삭 속은 촉촉해요' },
      { name: '단팥빵', description: '' },
      { name: '크림빵', description: '' },
    ],
  },
];

export const MAX_MENU_COUNT = 3;

/**
 * 촬영 장면 수. 가게 장면 하나에 메뉴마다 두 장면을 더한다.
 * 임시 규칙이며 템플릿별 장면 구성이 확정되면 교체한다.
 */
const SCENE_RULE = { store: 1, perMenu: 2 } as const;

export const countScenes = (menuCount: number): number =>
  SCENE_RULE.store + menuCount * SCENE_RULE.perMenu;
