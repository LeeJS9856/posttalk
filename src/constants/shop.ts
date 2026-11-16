import { SAMPLE_TEMPLATES, type StoreTemplate } from '@/constants/templates';

export type ShopProfile = {
  name: string;
  /** 가게가 있는 시장·지역. 작업 공간에 보내면 카드뉴스 AI 가 지역(area)으로 쓴다. 비우면 서버가 "전통시장"을 넣는다. */
  marketName: string;
  /** 가게 소개. 광고를 만들 때 storeSpecialty 로 보낸다. 자세할수록 좋다. */
  description: string;
  /** 운영자가 미리 연결해 둔 계정. 앱에서 바꾸지 않는다. */
  instagram: string;
};

/** 가게 소개 길이. 광고 제작에 그대로 쓰므로 넉넉히 둔다. 마이 카드에서는 두 줄까지만 보인다. */
export const MAX_SHOP_DESCRIPTION = 500;

/** 시장·지역 이름 길이. 서버가 100자까지 받는다. */
export const MAX_MARKET_NAME = 100;

/**
 * 가게 정보와 저장된 내용을 이 기기에 남기는 키.
 * 계정이 곧 내 가게라, 한 번 적으면 다음 광고에도 채워져 있어야 한다. 새로고침해도 남는다.
 */
export const SHOP_STORAGE_KEY = 'posttalk.shop';

/**
 * 가게 정보. 조회 API 가 없어 빈 값에서 시작하고, 마이 → 프로필 수정이나 정보 입력에서 채운다.
 * 고친 값은 이 기기에 남는다(SHOP_STORAGE_KEY).
 */
export const DEFAULT_SHOP_PROFILE: ShopProfile = {
  name: '',
  marketName: '',
  description: '',
  instagram: '',
};

export const DEFAULT_TEMPLATES: readonly StoreTemplate[] = SAMPLE_TEMPLATES;

export const createTemplateId = (): string => `tpl-${Date.now()}`;
