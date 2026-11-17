export type TemplateMenu = {
  name: string;
  description: string;
};

/**
 * 저장된 메뉴 하나. 템플릿 이름이 곧 메뉴 이름이다.
 * 가게 정보(이름·주소·소개)는 담지 않는다. 가게 정보의 기준은 언제나 내 프로필이다.
 */
export type StoreTemplate = {
  templateId: string;
  /** 메뉴 이름. 같은 이름으로 다시 저장하면 설명만 바뀐다. */
  name: string;
  description: string;
};

/**
 * 저장된 메뉴. 템플릿 조회 API 가 없어 처음엔 비어 있고,
 * 정보 입력에서 "이 메뉴들을 저장해두기"를 고르면 메뉴마다 하나씩 이 기기에 쌓인다(useShop).
 */
export const SAMPLE_TEMPLATES: readonly StoreTemplate[] = [];

export const MAX_MENU_COUNT = 3;

/** 예전 저장 형식: 가게 정보와 메뉴 여러 개를 한 묶음으로 저장했다. */
type LegacyTemplate = {
  templateId?: string;
  name?: string;
  menus?: TemplateMenu[];
};

/**
 * 저장소에서 읽은 값을 메뉴 템플릿 목록으로 맞춘다.
 * 예전 묶음 형식은 안의 메뉴를 하나씩 풀고, 같은 이름은 먼저 나온 것 하나만 남긴다.
 */
export const normalizeTemplates = (stored: unknown): StoreTemplate[] => {
  if (!Array.isArray(stored)) return [];
  const result: StoreTemplate[] = [];
  const seen = new Set<string>();
  const push = (name: string | undefined, description: string | undefined, id?: string): void => {
    const trimmed = name?.trim();
    if (!trimmed || seen.has(trimmed)) return;
    seen.add(trimmed);
    result.push({
      templateId: id ?? `menu-${trimmed}`,
      name: trimmed,
      description: description?.trim() ?? '',
    });
  };

  for (const item of stored as (StoreTemplate & LegacyTemplate)[]) {
    if (Array.isArray(item?.menus)) {
      item.menus.forEach((menu) => push(menu.name, menu.description));
    } else {
      push(item?.name, item?.description, item?.templateId);
    }
  }
  return result;
};
