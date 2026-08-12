import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import { COLORS } from '@/constants/colors';
import { NAV_ITEMS } from '@/constants/navigation';

type BottomNavigationProps = {
  fixed?: boolean;
};

const BottomNavigation = ({ fixed = false }: BottomNavigationProps): React.JSX.Element => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <Navigation aria-label="하단 메뉴" $fixed={fixed}>
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

const Navigation = styled.nav<{ $fixed: boolean }>`
  position: ${({ $fixed }) => ($fixed ? 'fixed' : 'absolute')};
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 20;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  min-height: 96px;
  padding: 6px 0;
  border-top: 1px solid ${COLORS.black200};
  background: ${COLORS.white};
  backdrop-filter: blur(12px);

  ${({ $fixed }) =>
    $fixed &&
    `
      left: 50%;
      width: min(100%, 480px);
      transform: translateX(-50%);
    `}
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
