export type TemplateMenu = {
  name: string;
  description: string;
};

export type StoreTemplate = {
  templateId: string;
  name: string;
  /** 시장·지역. 예전에 저장한 내용에는 없을 수 있다. */
  marketName?: string;
  storeDescription: string;
  menus: TemplateMenu[];
};

/**
 * 저장된 가게·메뉴 정보. 템플릿 조회 API 가 없어 처음엔 비어 있고,
 * 정보 입력에서 "이 내용을 저장해두기"를 고르면 이 기기에 쌓인다(useShop).
 */
export const SAMPLE_TEMPLATES: readonly StoreTemplate[] = [];

export const MAX_MENU_COUNT = 3;

