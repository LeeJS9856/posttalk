import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import archiveIcon from '@/assets/icons/archive.svg?raw';
import campaignIcon from '@/assets/icons/campaign.svg?raw';
import homeIcon from '@/assets/icons/home.svg?raw';
import myIcon from '@/assets/icons/my.svg?raw';
import { COLORS } from '@/constants/colors';
import { NAV_ITEMS, type NavItemId } from '@/constants/navigation';
import { FONT_SIZE, FONT_WEIGHT } from '@/constants/typography';

const ICONS: Record<NavItemId, string> = {
  home: homeIcon,
  create: campaignIcon,
  archive: archiveIcon,
  my: myIcon,
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

        return (
          <NavButton
            key={id}
            type="button"
            $active={isActive}
            aria-current={isActive ? 'page' : undefined}
            onClick={() => handleSelect(path)}
          >
            <NavIcon aria-hidden="true" dangerouslySetInnerHTML={{ __html: ICONS[id] }} />
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

const NavLabel = styled.span`
  font-size: ${FONT_SIZE.label};
  font-weight: ${FONT_WEIGHT.medium};
`;

export default BottomNavigation;
