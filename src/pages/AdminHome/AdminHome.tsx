import AdminBottomNavigation from '@/components/admin/AdminBottomNavigation';
import ReviewAdCard from '@/components/home/ReviewAdCard';
import DraggableBottomSheet from '@/components/layout/DraggableBottomSheet';
import { AllButton, AppFrame, Hero, HeroMessage, HeroStrong, RecentCard, RecentList, ReviewList, Section, SectionHeader, SectionTitle } from '@/pages/AdminHome/AdminHome.styles';

const REVIEW_ADS = [
  { id: 'review-1', storeName: '특랑만', image: 'https://images.unsplash.com/photo-1610057099431-d73a1c9d2f2f?auto=format&fit=crop&w=360&q=85' },
  { id: 'review-2', storeName: '특랑만', image: 'https://images.unsplash.com/photo-1610057099431-d73a1c9d2f2f?auto=format&fit=crop&w=360&q=85' },
] as const;

const RECENT_ADS = [
  { id: 'recent-1', title: '특랑만', image: 'https://images.unsplash.com/photo-1610057099431-d73a1c9d2f2f?auto=format&fit=crop&w=360&q=85' },
  { id: 'recent-2', title: '특랑만', image: 'https://images.unsplash.com/photo-1610057099431-d73a1c9d2f2f?auto=format&fit=crop&w=360&q=85' },
  { id: 'recent-3', title: '특랑만', image: 'https://images.unsplash.com/photo-1610057099431-d73a1c9d2f2f?auto=format&fit=crop&w=360&q=85' },
] as const;

const AdminHome = (): React.JSX.Element => {
  return (
    <AppFrame>
      <Hero>
        <HeroMessage>
          <HeroStrong>말바우시장</HeroStrong> 사장님,
          <br />
          검수가 필요한 광고가
          <br />
          <HeroStrong>{REVIEW_ADS.length}건</HeroStrong> 있어요!
        </HeroMessage>
      </Hero>

      <DraggableBottomSheet>
        <Section>
          <SectionHeader>
            <SectionTitle>검수가 필요한 광고</SectionTitle>
          </SectionHeader>
          <ReviewList>
            {REVIEW_ADS.map((ad) => (
              <ReviewAdCard key={ad.id} status="pending" storeName={ad.storeName} image={ad.image} onClick={() => undefined} />
            ))}
          </ReviewList>
        </Section>

        <Section>
          <SectionHeader>
            <SectionTitle>최근 업로드 된 광고</SectionTitle>
            <AllButton type="button" onClick={() => undefined}>전체 보기 ›</AllButton>
          </SectionHeader>
          <RecentList>
            {RECENT_ADS.map((ad) => (
              <RecentCard key={ad.id} type="button" onClick={() => undefined}>
                <img src={ad.image} alt={`${ad.title} 광고 미리보기`} />
                <strong>{ad.title}</strong>
              </RecentCard>
            ))}
          </RecentList>
        </Section>
      </DraggableBottomSheet>

      <AdminBottomNavigation />
    </AppFrame>
  );
};

export default AdminHome;
