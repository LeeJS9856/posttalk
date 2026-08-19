import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { getMerchantHome, type MerchantAttentionItem, type MerchantHomeData } from '@/apis/home';
import FloatingCreateButton from '@/components/common/FloatingCreateButton';
import PromotionCard from '@/components/home/PromotionCard';
import ReviewAdCard from '@/components/home/ReviewAdCard';
import BottomNavigation from '@/components/layout/BottomNavigation';
import DraggableBottomSheet from '@/components/layout/DraggableBottomSheet';
import { TEMP_QR_USER_SESSION } from '@/constants/user';
import { AllButton, AppFrame, EmptyMessage, FloatingButtonArea, Hero, HeroMessage, HeroStrong, PromotionList, ReviewList, Section, SectionHeader, SectionTitle } from '@/pages/Home/Home.styles';

const FALLBACK_THUMBNAIL = 'https://images.unsplash.com/photo-1610057099431-d73a1c9d2f2f?auto=format&fit=crop&w=360&q=85';

const toReviewStatus = (item: MerchantAttentionItem): 'pending' | 'supplement' =>
  item.status === 'rejected' ? 'supplement' : 'pending';

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
  const attentionItems = homeData?.attentionItems ?? [];
  const myAds = homeData?.myAds ?? [];

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
        <Section>
          <SectionHeader>
            <SectionTitle>확인이 필요한 광고</SectionTitle>
            <AllButton type="button" onClick={() => navigate('/archive')}>전체 보기</AllButton>
          </SectionHeader>
          {isLoading ? <EmptyMessage>광고를 불러오는 중이에요.</EmptyMessage> : hasError ? <EmptyMessage>광고를 불러오지 못했어요.</EmptyMessage> : attentionItems.length > 0 ? (
            <ReviewList>
              {attentionItems.map((item) => (
                <ReviewAdCard
                  key={item.submissionId}
                  status={toReviewStatus(item)}
                  storeName={item.title}
                  image={item.thumbnailUrl ?? FALLBACK_THUMBNAIL}
                  onClick={() => navigate('/archive')}
                />
              ))}
            </ReviewList>
          ) : <EmptyMessage>확인이 필요한 광고가 없어요.</EmptyMessage>}
        </Section>

        <Section $withTopBorder={pendingCount === 0}>
          <SectionHeader>
            <SectionTitle>내가 만든 광고</SectionTitle>
            <AllButton type="button" onClick={() => navigate('/archive')}>전체 보기</AllButton>
          </SectionHeader>
          <PromotionList>
            {myAds.map((ad) => (
              <PromotionCard
                key={ad.submissionId}
                image={ad.thumbnailUrl ?? FALLBACK_THUMBNAIL}
                title={ad.title}
                onClick={() => navigate('/archive')}
              />
            ))}
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

export default Home;
