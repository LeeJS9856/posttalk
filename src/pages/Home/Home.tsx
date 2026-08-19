import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { getMerchantHome, type MerchantAttentionItem, type MerchantHomeData } from '@/apis/home';
import FloatingCreateButton from '@/components/common/FloatingCreateButton';
import QrLoginRequired from '@/components/auth/QrLoginRequired';
import HomeAdSkeleton from '@/components/home/HomeAdSkeleton';
import PromotionCard from '@/components/home/PromotionCard';
import ReviewAdCard from '@/components/home/ReviewAdCard';
import BottomNavigation from '@/components/layout/BottomNavigation';
import DraggableBottomSheet from '@/components/layout/DraggableBottomSheet';
import { useMerchantSession } from '@/hooks/useMerchantSession';
import { AllButton, AppFrame, EmptyMessage, FloatingButtonArea, Hero, HeroMessage, HeroStrong, PromotionList, ReviewList, Section, SectionHeader, SectionTitle } from '@/pages/Home/Home.styles';

const FALLBACK_THUMBNAIL = 'https://images.unsplash.com/photo-1610057099431-d73a1c9d2f2f?auto=format&fit=crop&w=360&q=85';

const toReviewStatus = (item: MerchantAttentionItem): 'pending' | 'supplement' =>
  item.status === 'rejected' ? 'supplement' : 'pending';

const Home = (): React.JSX.Element => {
  const navigate = useNavigate();
  const { isLoading: isQrLoading, session } = useMerchantSession();
  const [homeData, setHomeData] = useState<MerchantHomeData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (isQrLoading || !session) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setHasError(false);
    const controller = new AbortController();

    const loadHome = async () => {
      try {
        const response = await getMerchantHome({
          storeId: session.storeId,
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
  }, [isQrLoading, session]);

  const storeName = homeData?.summary.storeName ?? session?.storeName;
  const pendingCount = homeData?.summary.totalAttentionCount ?? 0;
  const attentionItems = homeData?.attentionItems ?? [];
  const myAds = homeData?.myAds ?? [];

  return (
    <AppFrame>
      <Hero>
        <HeroMessage>
          {isQrLoading ? 'QR 정보를 불러오고 있어요.' : !session ? (
            'QR 로그인을 해주세요.'
          ) : (
            <>
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
            </>
          )}
        </HeroMessage>
      </Hero>
      <DraggableBottomSheet>
        {!isQrLoading && !session ? (
          <QrLoginRequired />
        ) : <>
        <Section>
          <SectionHeader>
            <SectionTitle>확인이 필요한 광고</SectionTitle>
            <AllButton type="button" onClick={() => navigate('/archive')}>전체 보기</AllButton>
          </SectionHeader>
          {isQrLoading || isLoading ? (
            <ReviewList aria-label="확인이 필요한 광고를 불러오는 중">
              <HomeAdSkeleton variant="attention" />
              <HomeAdSkeleton variant="attention" />
            </ReviewList>
          ) : hasError ? <EmptyMessage>광고를 불러오지 못했어요.</EmptyMessage> : attentionItems.length > 0 ? (
            <ReviewList>
              {attentionItems.slice(0, 2).map((item) => (
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
            {isQrLoading || isLoading ? (
              <>
                <HomeAdSkeleton variant="promotion" />
                <HomeAdSkeleton variant="promotion" />
                <HomeAdSkeleton variant="promotion" />
              </>
            ) : (
              <>
                <PromotionCard onClick={() => navigate('/create')} />
                {myAds.map((ad) => (
                  <PromotionCard
                    key={ad.submissionId}
                    image={ad.thumbnailUrl ?? FALLBACK_THUMBNAIL}
                    title={ad.title}
                    onClick={() => navigate('/archive')}
                  />
                ))}
              </>
            )}
          </PromotionList>
        </Section>
        </>}
      </DraggableBottomSheet>
      {session && <FloatingButtonArea>
        <FloatingCreateButton onClick={() => navigate('/create')} />
      </FloatingButtonArea>}
      <BottomNavigation />
    </AppFrame>
  );
};

export default Home;
