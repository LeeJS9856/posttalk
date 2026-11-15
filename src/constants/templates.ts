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
 * 저장된 가게·메뉴 정보. 템플릿 조회 API 가 없어 처음엔 비어 있고,
 * 정보 입력에서 "이 내용을 저장해두기"를 고르면 메모리에 쌓인다.
 */
export const SAMPLE_TEMPLATES: readonly StoreTemplate[] = [];

export const MAX_MENU_COUNT = 3;

