import { Archive, House, PenTool, User, type LucideIcon } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import { COLORS } from '@/constants/colors';
import { NAV_ITEMS, type NavItemId } from '@/constants/navigation';
import { FONT_SIZE, FONT_WEIGHT } from '@/constants/typography';

/* 아이콘은 Lucide 한 벌에서 고른다. 선 굵기를 맞춰야 탭끼리 무게가 같다. */
const ICONS: Record<NavItemId, LucideIcon> = {
  home: House,
  create: PenTool,
  archive: Archive,
  my: User,
};

const BottomNavigation = (): React.JSX.Element => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const handleSelect = (path: string): void => {
    if (path === pathname) return;
    navigate(path);
  };

  return (
    <Navigation aria-label="주요 메뉴">
      {NAV_ITEMS.map(({ id, label, path }) => {
        const isActive = pathname === path;
        const Icon = ICONS[id];

        return (
          <NavButton
            key={id}
            type="button"
            $active={isActive}
            aria-current={isActive ? 'page' : undefined}
            onClick={() => handleSelect(path)}
          >
            <NavIcon aria-hidden="true">
              <Icon strokeWidth={isActive ? 2 : 1.7} />
            </NavIcon>
            <NavLabel>{label}</NavLabel>
          </NavButton>
        );
      })}
    </Navigation>
  );
};

/* 아이콘 24px · 글자 11px · 탭 높이 56px. iOS 49pt 와 Material 3 의 80dp 사이에 둔다. */
const Navigation = styled.nav`
  display: flex;
  flex-shrink: 0;
  padding: 0 2px calc(8px + env(safe-area-inset-bottom));
  border-top: 0.5px solid ${COLORS.border.main};
  background-color: ${COLORS.background.main};
`;

const NavButton = styled.button<{ $active: boolean }>`
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  min-height: 56px;
  padding: 9px 0 5px;
  color: ${({ $active }) => ($active ? COLORS.brand.main : COLORS.text.muted)};
  transition: color 0.18s ease;
`;

const NavIcon = styled.span`
  display: block;
  line-height: 0;

  svg {
    width: 24px;
    height: 24px;
  }
`;

/* 탭 글자는 본문보다 한 단계 작게 둔다. 크면 아이콘보다 글자가 먼저 읽힌다. */
const NavLabel = styled.span`
  font-size: ${FONT_SIZE.caption};
  font-weight: ${FONT_WEIGHT.semibold};
`;

export default BottomNavigation;
