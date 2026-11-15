import { SAMPLE_TEMPLATES, type StoreTemplate } from '@/constants/templates';

export type ShopProfile = {
  name: string;
  /** 시장 이름. 작업 공간을 열 때 보내고, 카드뉴스 AI 가 지역으로 쓴다. */
  marketName: string;
  description: string;
  /** 운영자가 미리 연결해 둔 계정. 앱에서 바꾸지 않는다. */
  instagram: string;
};

/** 가게 소개 길이. 마이 화면 카드 한 줄에 들어가야 한다. */
export const MAX_SHOP_DESCRIPTION = 60;

/**
 * 가게 정보. 조회 API 가 없어 빈 값에서 시작하고, 마이 → 프로필 수정에서 채운다.
 * 고친 값은 메모리에만 남는다.
 */
export const DEFAULT_SHOP_PROFILE: ShopProfile = {
  name: '',
  marketName: '',
  description: '',
  instagram: '',
};

export const DEFAULT_TEMPLATES: readonly StoreTemplate[] = SAMPLE_TEMPLATES;

export const createTemplateId = (): string => `tpl-${Date.now()}`;
