import { useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import styled from 'styled-components';

import FloatingCreateButton from '@/components/common/FloatingCreateButton';
import type { AdStatus } from '@/components/common/StatusBadge';
import PromotionCard from '@/components/home/PromotionCard';
import ReviewAdCard from '@/components/home/ReviewAdCard';
import BottomNavigation from '@/components/layout/BottomNavigation';
import DraggableBottomSheet from '@/components/layout/DraggableBottomSheet';
import { COLORS } from '@/constants/colors';
import heroImage from '@/assets/temporary-market-hero.jpg';

type ReviewAd = { id: number; status: AdStatus };

const DEMO_REVIEW_ADS: ReviewAd[] = [
  { id: 1, status: 'pending' },
  { id: 2, status: 'supplement' },
];

const Home = (): React.JSX.Element => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const storeName = searchParams.get('store') ?? searchParams.get('organization') ?? '득량만';
  const reviewAds = useMemo(() => (searchParams.get('pending') === '0' ? [] : DEMO_REVIEW_ADS), [searchParams]);
  const pendingCount = reviewAds.length;

  return (
    <AppFrame>
      <Hero>
        <HeroMessage>
          <HeroStrong>{storeName}</HeroStrong> 사장님,
          <br />
          {pendingCount > 0 ? (
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
        {pendingCount > 0 && (
          <Section>
            <SectionTitle>확인이 필요한 광고</SectionTitle>
            <ReviewList>
              {reviewAds.map((ad) => (
                <ReviewAdCard
                  key={ad.id}
                  status={ad.status}
                  storeName={storeName}
                  image={heroImage}
                  onClick={() => undefined}
                />
              ))}
            </ReviewList>
          </Section>
        )}
        <Section $withTopBorder={pendingCount === 0}>
          <SectionHeader>
            <SectionTitle>내가 만든 광고</SectionTitle>
            <AllButton type="button">전체 보기</AllButton>
          </SectionHeader>
          <PromotionList>
            <PromotionCard onClick={() => navigate('/create')} />
            <PromotionCard image={heroImage} title={`${storeName} 홍보물`} onClick={() => undefined} />
            <PromotionCard image={heroImage} title={`${storeName} 두 번째 홍보물`} onClick={() => undefined} />
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

const AppFrame = styled.div`
  position: relative;
  width: min(100%, 480px);
  min-height: 100svh;
  margin: 0 auto;
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
  margin: 64px 24px 0;
  color: ${COLORS.white};
  font-size: clamp(25px, 6vw, 30px);
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
  font-size: 20px;
  font-weight: 700;
`;

const AllButton = styled.button`
  margin-bottom: 18px;
  border: 0;
  color: ${COLORS.black700};
  background: transparent;
  font-size: 13px;
  font-weight: 400;
`;

const ReviewList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin-bottom: 30px;
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
  bottom: 110px;
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
