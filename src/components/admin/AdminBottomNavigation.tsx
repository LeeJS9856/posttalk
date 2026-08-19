import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import { getAdminHome } from '@/apis/adminHome';
import archiveIcon from '@/assets/icons/archive.svg?raw';
import homeIcon from '@/assets/icons/home.svg?raw';
import reviewIcon from '@/assets/icons/review.svg?raw';
// import myIcon from '@/assets/icons/my.svg?raw';
import { COLORS } from '@/constants/colors';
import { FONT_SIZE } from '@/constants/typography';

const ADMIN_NAV_ITEMS: ReadonlyArray<{ label: string; icon: string; path?: string }> = [
  { label: '홈', icon: homeIcon, path: '/admin' },
  { label: '검토', icon: reviewIcon, path: '/admin/reviews' },
  { label: '보관함', icon: archiveIcon, path: '/admin/archive' },
  // 나중에 관리자 마이 페이지를 추가할 때 다시 활성화합니다.
  // { label: '마이', icon: myIcon },
];
const ADMIN_MARKET_NAME = '양동시장';

const AdminBottomNavigation = (): React.JSX.Element => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [hasPendingReview, setHasPendingReview] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    const loadPendingReview = async (): Promise<void> => {
      try {
        const response = await getAdminHome({ marketName: ADMIN_MARKET_NAME, signal: controller.signal });
        setHasPendingReview(response.data.summary.pendingReviewCount > 0 || response.data.pendingItems.length > 0);
      } catch (error) {
        if (!(error instanceof DOMException && error.name === 'AbortError')) setHasPendingReview(false);
      }
    };

    void loadPendingReview();
    return () => controller.abort();
  }, []);

  return (
    <Navigation aria-label="관리자 하단 메뉴">
      {ADMIN_NAV_ITEMS.map(({ label, icon, path }) => {
        const isActive = pathname === path;

        return (
          <NavigationItem
            key={label}
            type="button"
            $active={isActive}
            aria-current={isActive ? 'page' : undefined}
            onClick={() => path && navigate(path)}
          >
            <NavIcon aria-hidden="true" dangerouslySetInnerHTML={{ __html: icon }} />
            {label === '검토' && hasPendingReview && <PendingDot aria-label="검토 대기 광고 있음" />}
            <span>{label}</span>
          </NavigationItem>
        );
      })}
    </Navigation>
  );
};

const Navigation = styled.nav`
  position: fixed;
  right: auto;
  bottom: 0;
  left: 50%;
  z-index: 20;
  display: grid;
  width: min(100%, 480px);
  grid-template-columns: repeat(${ADMIN_NAV_ITEMS.length}, 1fr);
  min-height: 80px;
  padding: 4px 0;
  border-top: 1px solid ${COLORS.black200};
  background: ${COLORS.white};
  transform: translateX(-50%);
`;

const NavigationItem = styled.button<{ $active: boolean }>`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  border: 0;
  color: ${({ $active }) => ($active ? COLORS.navActive : COLORS.navInactive)};
  background: transparent;
  font-size: ${FONT_SIZE.caption};
  font-weight: ${({ $active }) => ($active ? 700 : 400)};
`;

const PendingDot = styled.span`
  position: absolute;
  top: 13px;
  right: calc(50% - 16px);
  width: 9px;
  height: 9px;
  border: 1px solid ${COLORS.white};
  border-radius: 50%;
  background: #ef6c53;
`;

const NavIcon = styled.span`
  display: block;
  width: 24px;
  height: 24px;

  svg {
    display: block;
    width: 100%;
    height: 100%;
  }
`;

export default AdminBottomNavigation;
