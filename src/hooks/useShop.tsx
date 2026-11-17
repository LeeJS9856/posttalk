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
import { normalizeTemplates, type StoreTemplate } from '@/constants/templates';
import { useAuth } from '@/hooks/useAuth';

type ShopContextValue = {
  profile: ShopProfile;
  templates: StoreTemplate[];
  setProfile: (profile: ShopProfile) => void;
  /** 메뉴들을 저장한다. 같은 이름이 있으면 설명을 새로 바꾸고 맨 앞으로 올린다. */
  saveMenus: (menus: { name: string; description: string }[]) => void;
  removeTemplate: (templateId: string) => void;
};

const ShopContext = createContext<ShopContextValue | null>(null);

type StoredShop = { profile?: Partial<ShopProfile>; templates?: unknown };

/** 계정마다 따로 남긴다. 한 기기에서 계정을 갈아타도 가게가 섞이지 않는다. */
const storageKeyFor = (username: string | undefined): string =>
  username ? `${SHOP_STORAGE_KEY}:${username}` : SHOP_STORAGE_KEY;

/** 저장소를 못 쓰거나 값이 깨졌으면 처음 값으로 시작한다. */
const readStoredShop = (username: string | undefined): StoredShop => {
  try {
    const raw = window.localStorage.getItem(storageKeyFor(username));
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
  const { account } = useAuth();
  const username = account?.username;

  const initialProfile = (): ShopProfile => ({
    ...DEFAULT_SHOP_PROFILE,
    ...account?.shop,
    ...readStoredShop(username).profile,
  });
  const initialTemplates = (): StoreTemplate[] => {
    const stored = readStoredShop(username).templates;
    // 예전 묶음 형식(가게 + 메뉴 여러 개)으로 저장된 것도 메뉴 하나씩으로 풀어 읽는다.
    return Array.isArray(stored) ? normalizeTemplates(stored) : [...DEFAULT_TEMPLATES];
  };

  const [loaded, setLoaded] = useState(() => username ?? '');
  const [profile, setProfile] = useState<ShopProfile>(initialProfile);
  const [templates, setTemplates] = useState<StoreTemplate[]>(initialTemplates);

  /**
   * 계정이 바뀌면 그 계정의 가게로 갈아끼운다. 렌더 중에 처리해야 한 프레임 어긋나지 않는다.
   * 그 기기에서 고친 적이 있으면 고친 값을, 없으면 계정에 적어 둔 값을 쓴다.
   */
  if (loaded !== (username ?? '')) {
    setLoaded(username ?? '');
    setProfile(initialProfile());
    setTemplates(initialTemplates());
  }

  useEffect(() => {
    if (!username) return;
    try {
      window.localStorage.setItem(
        storageKeyFor(username),
        JSON.stringify({ profile, templates }),
      );
    } catch {
      // 저장소를 못 쓰면 이번 탭에서만 남는다.
    }
  }, [username, profile, templates]);

  const saveMenus = useCallback((menus: { name: string; description: string }[]) => {
    setTemplates((current) => {
      const saved = normalizeTemplates(menus);
      const names = new Set(saved.map((item) => item.name));
      return [...saved, ...current.filter((item) => !names.has(item.name))];
    });
  }, []);

  const removeTemplate = useCallback((templateId: string) => {
    setTemplates((current) => current.filter((item) => item.templateId !== templateId));
  }, []);

  const value = useMemo<ShopContextValue>(
    () => ({ profile, templates, setProfile, saveMenus, removeTemplate }),
    [profile, templates, saveMenus, removeTemplate],
  );

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
};

// oxlint-disable-next-line react/only-export-components -- 훅과 프로바이더가 같은 컨텍스트를 공유한다
export const useShop = (): ShopContextValue => {
  const context = useContext(ShopContext);
  if (!context) throw new Error('useShop must be used within ShopProvider.');
  return context;
};
