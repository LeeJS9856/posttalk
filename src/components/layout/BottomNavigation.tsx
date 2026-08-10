import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import archiveIcon from '@/assets/icons/archive.svg?raw';
import campaignIcon from '@/assets/icons/campaign.svg?raw';
import homeIcon from '@/assets/icons/home.svg?raw';
import myIcon from '@/assets/icons/my.svg?raw';
import { COLORS } from '@/constants/colors';

const NAV_ITEMS = [
  { label: '홈', icon: homeIcon, path: '/' },
  { label: '광고 제작', icon: campaignIcon, path: '/create' },
  { label: '보관함', icon: archiveIcon, path: '/archive' },
  { label: '마이', icon: myIcon, path: '/my' },
] as const;

const BottomNavigation = (): React.JSX.Element => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <Navigation aria-label="하단 메뉴">
      {NAV_ITEMS.map(({ label, icon, path }) => {
        const isActive = pathname === path;

        return (
          <NavigationItem
            key={label}
            type="button"
            $active={isActive}
            aria-current={isActive ? 'page' : undefined}
            onClick={() => navigate(path)}
          >
            <NavIcon aria-hidden="true" dangerouslySetInnerHTML={{ __html: icon }} />
            <span>{label}</span>
          </NavigationItem>
        );
      })}
    </Navigation>
  );
};

const Navigation = styled.nav`
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 20;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  min-height: 96px;
  padding: 6px 0;
  border-top: 1px solid ${COLORS.black200};
  background: rgba(255, 255, 255, 0.93);
  backdrop-filter: blur(12px);
`;

const NavigationItem = styled.button<{ $active: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 5px;
  border: 0;
  color: ${({ $active }) => ($active ? COLORS.navActive : COLORS.navInactive)};
  background: transparent;
  font-size: 14px;
  font-weight: ${({ $active }) => ($active ? 700 : 400)};
`;

const NavIcon = styled.span`
  display: block;
  width: 27px;
  height: 27px;

  svg {
    display: block;
    width: 100%;
    height: 100%;
  }
`;

export default BottomNavigation;
