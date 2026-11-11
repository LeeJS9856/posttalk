import { FIXED_USER_ID } from '@/constants/auth';
import { SAMPLE_TEMPLATES, type StoreTemplate } from '@/constants/templates';

export type ShopProfile = {
  name: string;
  description: string;
  /** 운영자가 미리 연결해 둔 계정. 앱에서 바꾸지 않는다. */
  instagram: string;
};

/** 가게 소개 길이. 마이 화면 카드 한 줄에 들어가야 한다. */
export const MAX_SHOP_DESCRIPTION = 60;

/**
 * 사용자 번호별 가게 정보. 아직 API 가 없어 하드코딩한다.
 * 전시에서는 고정 계정 하나만 쓰므로 1번 하나뿐이고,
 * 조회 API 가 붙으면 이 표를 걷어내고 응답으로 바꾼다.
 */
export const SHOP_PROFILES: Readonly<Record<number, ShopProfile>> = {
  [FIXED_USER_ID]: {
    name: '창억떡집',
    description: '20년째 같은 자리에서 떡을 만들어요. 매일 아침 직접 쪄서 냅니다.',
    instagram: '@changeok_tteok',
  },
};

/** 지금 로그인한 사용자의 가게 정보. 고친 값은 메모리에만 남는다. */
export const DEFAULT_SHOP_PROFILE: ShopProfile = SHOP_PROFILES[FIXED_USER_ID];

export const DEFAULT_TEMPLATES: readonly StoreTemplate[] = SAMPLE_TEMPLATES;

export const createTemplateId = (): string => `tpl-${Date.now()}`;
