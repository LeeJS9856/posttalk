import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import { getMerchantHome, type MerchantHomeData } from '@/apis/home';
import FloatingCreateButton from '@/components/common/FloatingCreateButton';
import PromotionCard from '@/components/home/PromotionCard';
import BottomNavigation from '@/components/layout/BottomNavigation';
import DraggableBottomSheet from '@/components/layout/DraggableBottomSheet';
import PageFrame from '@/components/layout/PageFrame';
import { COLORS } from '@/constants/colors';
import { FONT_SIZE } from '@/constants/typography';
import { TEMP_QR_USER_SESSION } from '@/constants/user';
import heroImage from '@/assets/temporary-market-hero.jpg';

const Home = (): React.JSX.Element => {
  const navigate = useNavigate();
  const [homeData, setHomeData] = useState<MerchantHomeData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    const loadHome = async () => {
      try {
        const response = await getMerchantHome({
          storeId: TEMP_QR_USER_SESSION.storeId,
          signal: controller.signal,
        });

        setHomeData(response.data);
      } catch (error) {
        if (!(error instanceof DOMException && error.name === 'AbortError')) {
          setHasError(true);
        }
      } finally {
        setIsLoading(false);
      }
    };

    void loadHome();

    return () => controller.abort();
  }, []);

  const storeName = homeData?.summary.storeName ?? TEMP_QR_USER_SESSION.storeName;
  const pendingCount = homeData?.summary.totalAttentionCount ?? 0;

  return (
    <AppFrame>
      <Hero>
        <HeroMessage>
          <HeroStrong>{storeName}</HeroStrong> 사장님,
          <br />
          {isLoading ? (
            '홈 정보를 불러오고 있어요.'
          ) : hasError ? (
            '홈 정보를 불러오지 못했어요.'
          ) : pendingCount > 0 ? (
            <>
              확인이 필요한 광고가
              <br />
              <HeroStrong>{pendingCount}건</HeroStrong> 있어요!
            </>
          ) : (
            '안녕하세요!'
          )}
        </HeroMessage>
      </Hero>
      <DraggableBottomSheet>
        <Section $withTopBorder={pendingCount === 0}>
          <SectionHeader>
            <SectionTitle>내가 만든 광고</SectionTitle>
            <AllButton type="button" onClick={() => navigate('/archive')}>전체 보기</AllButton>
          </SectionHeader>
          <PromotionList>
            <PromotionCard onClick={() => navigate('/create')} />
          </PromotionList>
        </Section>
      </DraggableBottomSheet>
      <FloatingButtonArea>
        <FloatingCreateButton onClick={() => navigate('/create')} />
      </FloatingButtonArea>
      <BottomNavigation />
    </AppFrame>
  );
};

const AppFrame = styled(PageFrame)`
  position: relative;
  overflow: hidden;
  background: ${COLORS.background.main};
`;

const Hero = styled.header`
  position: absolute;
  inset: 0 0 auto;
  height: 62svh;
  background-image: url(${heroImage});
  background-position: center;
  background-size: cover;

  &::after {
    position: absolute;
    inset: 0 0 auto;
    height: 310px;
    background: linear-gradient(180deg, rgba(21, 22, 37, 0.82) 0%, rgba(31, 31, 48, 0.6) 46%, rgba(31, 31, 48, 0) 100%);
    backdrop-filter: blur(8px);
    content: '';
    mask-image: linear-gradient(to bottom, black 0%, black 58%, transparent 100%);
  }
`;

const HeroMessage = styled.h1`
  position: relative;
  z-index: 1;
  margin: 52px 24px 0;
  color: ${COLORS.white};
  font-size: clamp(22px, 5.6vw, 26px);
  font-weight: 400;
  line-height: 1.42;
  letter-spacing: -0.7px;
`;

const HeroStrong = styled.strong`
  font-weight: 700;
`;

const Section = styled.section<{ $withTopBorder?: boolean }>`
  padding-top: ${({ $withTopBorder }) => ($withTopBorder ? '14px' : '0')};
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const SectionTitle = styled.h2`
  margin-bottom: 18px;
  color: ${COLORS.black700};
  font-size: ${FONT_SIZE.title};
  font-weight: 700;
`;

const AllButton = styled.button`
  margin-bottom: 18px;
  border: 0;
  color: ${COLORS.black700};
  background: transparent;
  font-size: ${FONT_SIZE.label};
  font-weight: 400;
`;

const PromotionList = styled.div`
  display: flex;
  gap: 14px;
  overflow-x: auto;
  margin: 0 -24px;
  padding: 0 24px;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const FloatingButtonArea = styled.div`
  position: absolute;
  right: 0;
  bottom: 96px;
  left: 0;
  z-index: 30;
  display: flex;
  justify-content: center;
  pointer-events: none;

  button {
    pointer-events: auto;
  }
`;

export default Home;
