import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';

import { DEFAULT_SHOP_PROFILE, DEFAULT_TEMPLATES, type ShopProfile } from '@/constants/shop';
import type { StoreTemplate } from '@/constants/templates';

type ShopContextValue = {
  profile: ShopProfile;
  templates: StoreTemplate[];
  setProfile: (profile: ShopProfile) => void;
  addTemplate: (template: StoreTemplate) => void;
  removeTemplate: (templateId: string) => void;
};

const ShopContext = createContext<ShopContextValue | null>(null);

/**
 * 가게 정보와 저장된 내용. 아직 API 가 없어 하드코딩한 값에서 시작한다.
 * 고친 값은 메모리에만 남는다. 새로고침하면 처음 값으로 돌아간다.
 */
export const ShopProvider = ({ children }: { children: ReactNode }): React.JSX.Element => {
  const [profile, setProfile] = useState<ShopProfile>(DEFAULT_SHOP_PROFILE);
  const [templates, setTemplates] = useState<StoreTemplate[]>(() => [...DEFAULT_TEMPLATES]);

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
