import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import {
  DEFAULT_SHOP_PROFILE,
  DEFAULT_TEMPLATES,
  SHOP_STORAGE_KEY,
  type ShopProfile,
} from '@/constants/shop';
import type { StoreTemplate } from '@/constants/templates';

type ShopContextValue = {
  profile: ShopProfile;
  templates: StoreTemplate[];
  setProfile: (profile: ShopProfile) => void;
  addTemplate: (template: StoreTemplate) => void;
  removeTemplate: (templateId: string) => void;
};

const ShopContext = createContext<ShopContextValue | null>(null);

type StoredShop = { profile?: Partial<ShopProfile>; templates?: StoreTemplate[] };

/** 저장소를 못 쓰거나 값이 깨졌으면 처음 값으로 시작한다. */
const readStoredShop = (): StoredShop => {
  try {
    const raw = window.localStorage.getItem(SHOP_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as StoredShop) : {};
  } catch {
    return {};
  }
};

/**
 * 가게 정보와 저장된 내용. 조회 API 가 없어 이 기기에 남긴다.
 * 계정이 곧 내 가게라, 한 번 적은 가게 정보는 다음 광고에도 채워져 있어야 한다.
 */
export const ShopProvider = ({ children }: { children: ReactNode }): React.JSX.Element => {
  const [stored] = useState(readStoredShop);
  const [profile, setProfile] = useState<ShopProfile>(() => ({
    ...DEFAULT_SHOP_PROFILE,
    ...stored.profile,
  }));
  const [templates, setTemplates] = useState<StoreTemplate[]>(() =>
    Array.isArray(stored.templates) ? stored.templates : [...DEFAULT_TEMPLATES],
  );

  useEffect(() => {
    try {
      window.localStorage.setItem(SHOP_STORAGE_KEY, JSON.stringify({ profile, templates }));
    } catch {
      // 저장소를 못 쓰면 이번 탭에서만 남는다.
    }
  }, [profile, templates]);

  const addTemplate = useCallback((template: StoreTemplate) => {
    setTemplates((current) => [template, ...current]);
  }, []);

  const removeTemplate = useCallback((templateId: string) => {
    setTemplates((current) => current.filter((item) => item.templateId !== templateId));
  }, []);

  const value = useMemo<ShopContextValue>(
    () => ({ profile, templates, setProfile, addTemplate, removeTemplate }),
    [profile, templates, addTemplate, removeTemplate],
  );

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
};

// oxlint-disable-next-line react/only-export-components -- 훅과 프로바이더가 같은 컨텍스트를 공유한다
export const useShop = (): ShopContextValue => {
  const context = useContext(ShopContext);
  if (!context) throw new Error('useShop must be used within ShopProvider.');
  return context;
};
