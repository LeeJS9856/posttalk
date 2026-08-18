import { useEffect, useState } from 'react';

import { getAdminReviews, type AdminReviewItem } from '@/apis/adminReviews';
import chevronRightIcon from '@/assets/icons/chevron right.svg?raw';
import AdminBottomNavigation from '@/components/admin/AdminBottomNavigation';
import PageHeader from '@/components/layout/PageHeader';
import { SearchButton, SearchIcon } from '@/pages/Archive/Archive.styles';
import { CardText, Chevron, Content, Description, EmptyMessage, Page, ReviewCard, ReviewList, Thumbnail, Title } from '@/pages/AdminReviews/AdminReviews.styles';

const ADMIN_MARKET_NAME = '말바우시장';
const FALLBACK_THUMBNAIL = 'https://images.unsplash.com/photo-1610057099431-d73a1c9d2f2f?auto=format&fit=crop&w=360&q=85';
const DEMO_REVIEW_ITEMS: AdminReviewItem[] = [
  {
    submissionId: 'demo-review-1',
    thumbnailUrl: FALLBACK_THUMBNAIL,
    title: '특랑만',
    createdAt: '2026-08-18T09:30:00.000Z',
    mediaType: 'photo',
  },
  {
    submissionId: 'demo-review-2',
    thumbnailUrl: FALLBACK_THUMBNAIL,
    title: '특랑만',
    createdAt: '2026-08-04T09:30:00.000Z',
    mediaType: 'video',
  },
];

const getDescription = (item: AdminReviewItem): string => {
  const mediaType = item.mediaType === 'video' ? '동영상 광고' : '사진 광고';
  const date = item.createdAt ? item.createdAt.slice(0, 10).replaceAll('-', '.') : '';
  return date ? `${mediaType} · ${date}` : mediaType;
};

const AdminReviews = (): React.JSX.Element => {
  const [items, setItems] = useState<AdminReviewItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    const loadReviews = async (): Promise<void> => {
      try {
        const response = await getAdminReviews({ marketName: ADMIN_MARKET_NAME, signal: controller.signal });
        setItems(response.data.items);
      } catch {
        // 관리자 키가 아직 설정되지 않은 경우에도 예시 카드로 화면을 확인할 수 있습니다.
      } finally {
        if (!controller.signal.aborted) setIsLoading(false);
      }
    };

    void loadReviews();
    return () => controller.abort();
  }, []);

  const displayItems = items.length > 0 ? items : DEMO_REVIEW_ITEMS;

  return (
    <Page aria-label="검토 페이지">
      <PageHeader
        title="검토"
        rightAction={(
          <SearchButton type="button" aria-label="검토 광고 검색">
            <SearchIcon aria-hidden="true" />
          </SearchButton>
        )}
      />
      <Content>
        {isLoading ? <EmptyMessage>검토 목록을 불러오는 중이에요.</EmptyMessage> : (
          <ReviewList>
            {displayItems.map((item) => (
              <ReviewCard key={item.submissionId} type="button">
                <Thumbnail src={item.thumbnailUrl ?? FALLBACK_THUMBNAIL} alt="" />
                <CardText>
                  <Title>{item.title}</Title>
                  <Description>{getDescription(item)}</Description>
                </CardText>
                <Chevron aria-hidden="true" dangerouslySetInnerHTML={{ __html: chevronRightIcon }} />
              </ReviewCard>
            ))}
          </ReviewList>
        )}
      </Content>
      <AdminBottomNavigation />
    </Page>
  );
};

export default AdminReviews;
