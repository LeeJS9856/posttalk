import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { getAdminHome, type AdminHomeData } from '@/apis/adminHome';
import AdminBottomNavigation from '@/components/admin/AdminBottomNavigation';
import HomeAdSkeleton from '@/components/home/HomeAdSkeleton';
import ReviewAdCard from '@/components/home/ReviewAdCard';
import DraggableBottomSheet from '@/components/layout/DraggableBottomSheet';
import { AllButton, AppFrame, EmptyMessage, Hero, HeroMessage, HeroStrong, RecentCard, RecentList, ReviewList, Section, SectionHeader, SectionTitle } from '@/pages/AdminHome/AdminHome.styles';

const ADMIN_MARKET_NAME = '말바우시장';
const FALLBACK_THUMBNAIL = 'https://images.unsplash.com/photo-1610057099431-d73a1c9d2f2f?auto=format&fit=crop&w=360&q=85';

const AdminHome = (): React.JSX.Element => {
  const [homeData, setHomeData] = useState<AdminHomeData | null>(null);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    const loadAdminHome = async (): Promise<void> => {
      try {
        const response = await getAdminHome({ marketName: ADMIN_MARKET_NAME, signal: controller.signal });
        setHomeData(response.data);
      } catch (error) {
        if (!(error instanceof DOMException && error.name === 'AbortError')) setHasError(true);
      } finally {
        if (!controller.signal.aborted) setIsLoading(false);
      }
    };

    void loadAdminHome();
    return () => controller.abort();
  }, []);

  const marketName = homeData?.summary.marketName ?? ADMIN_MARKET_NAME;
  const pendingItems = homeData?.pendingItems ?? [];
  const visiblePendingItems = pendingItems.slice(0, 2);
  const recentItems = homeData?.recentItems ?? [];
  const pendingCount = homeData?.summary.pendingReviewCount ?? pendingItems.length;
  const isHomeReady = !isLoading && !hasError && homeData !== null;

  return (
    <AppFrame>
      <Hero>
        <HeroMessage>
          <HeroStrong>{marketName}</HeroStrong> 사장님,
          <br />
          {!isHomeReady ? hasError ? '관리자 홈 정보를 불러오지 못했어요.' : '관리자 홈 정보를 불러오고 있어요.' : (
            <>
              검수가 필요한 광고가
              <br />
              <HeroStrong>{pendingCount}건</HeroStrong> 있어요!
            </>
          )}
        </HeroMessage>
      </Hero>

      <DraggableBottomSheet>
        <Section>
          <SectionHeader>
            <SectionTitle>검수가 필요한 광고</SectionTitle>
            <AllButton type="button" onClick={() => navigate('/admin/reviews')}>전체 보기 ›</AllButton>
          </SectionHeader>
          {isLoading ? (
            <ReviewList>
              <HomeAdSkeleton variant="attention" />
              <HomeAdSkeleton variant="attention" />
            </ReviewList>
          ) : !hasError && pendingItems.length === 0 ? (
            <EmptyMessage>검수가 필요한 광고가 없어요.</EmptyMessage>
          ) : (
            <ReviewList>
              {visiblePendingItems.map((ad) => (
                <ReviewAdCard key={ad.submissionId} status="pending" storeName={ad.storeName} image={ad.thumbnailUrl ?? FALLBACK_THUMBNAIL} onClick={() => navigate(`/admin/reviews/${ad.submissionId}`)} />
              ))}
            </ReviewList>
          )}
        </Section>

        <Section>
          <SectionHeader>
            <SectionTitle>최근 업로드 된 광고</SectionTitle>
            <AllButton type="button" onClick={() => navigate('/admin/reviews')}>전체 보기 ›</AllButton>
          </SectionHeader>
          {isLoading ? (
            <RecentList>
              <HomeAdSkeleton variant="promotion" />
              <HomeAdSkeleton variant="promotion" />
            </RecentList>
          ) : !hasError && recentItems.length === 0 ? (
            <EmptyMessage>최근 업로드 된 광고가 없어요.</EmptyMessage>
          ) : (
            <RecentList>
              {recentItems.map((ad) => (
                <RecentCard key={ad.submissionId} type="button" onClick={() => navigate(`/admin/reviews/${ad.submissionId}`)}>
                  <img src={ad.thumbnailUrl ?? FALLBACK_THUMBNAIL} alt={`${ad.title} 광고 미리보기`} />
                  <strong>{ad.title}</strong>
                </RecentCard>
              ))}
            </RecentList>
          )}
        </Section>
      </DraggableBottomSheet>

      <AdminBottomNavigation />
    </AppFrame>
  );
};

export default AdminHome;
