import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { getAdminReviews, type AdminReviewItem } from '@/apis/adminReviews';
import chevronRightIcon from '@/assets/icons/chevron right.svg?raw';
import AdminBottomNavigation from '@/components/admin/AdminBottomNavigation';
import AdminReviewCardSkeleton from '@/components/admin/AdminReviewCardSkeleton';
import PageHeader from '@/components/layout/PageHeader';
import { SearchButton, SearchIcon } from '@/pages/Archive/Archive.styles';
import { CardText, Chevron, Content, Description, EmptyMessage, Page, ReviewCard, ReviewList, Thumbnail, Title } from '@/pages/AdminReviews/AdminReviews.styles';

const ADMIN_MARKET_NAME = '양동시장';
const FALLBACK_THUMBNAIL = 'https://images.unsplash.com/photo-1610057099431-d73a1c9d2f2f?auto=format&fit=crop&w=360&q=85';

const getDescription = (item: AdminReviewItem): string => {
  const mediaType = isVideoItem(item) ? '동영상 광고' : '사진 광고';
  const date = item.createdAt ? item.createdAt.slice(0, 10).replaceAll('-', '.') : '';
  return date ? `${mediaType} · ${date}` : mediaType;
};

const isVideoItem = (item: AdminReviewItem): boolean =>
  item.mediaType === 'video' || Boolean(item.thumbnailUrl?.split('?')[0].match(/\.(mp4|webm|mov)$/i));

const AdminReviews = (): React.JSX.Element => {
  const navigate = useNavigate();
  const [items, setItems] = useState<AdminReviewItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    const loadReviews = async (): Promise<void> => {
      try {
        const response = await getAdminReviews({ marketName: ADMIN_MARKET_NAME, signal: controller.signal });
        setItems(response.data.items);
      } catch (error) {
        if (!(error instanceof DOMException && error.name === 'AbortError')) setHasError(true);
      } finally {
        if (!controller.signal.aborted) setIsLoading(false);
      }
    };

    void loadReviews();
    return () => controller.abort();
  }, []);

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
        {isLoading ? (
          <ReviewList aria-label="검토 목록을 불러오는 중">
            <AdminReviewCardSkeleton />
            <AdminReviewCardSkeleton />
            <AdminReviewCardSkeleton />
          </ReviewList>
        ) : hasError ? <EmptyMessage>검토 목록을 불러오지 못했어요.</EmptyMessage> : items.length > 0 ? (
          <ReviewList>
            {items.map((item) => (
              <ReviewCard key={item.submissionId} type="button" onClick={() => navigate(`/admin/reviews/${item.submissionId}`, { state: { review: item } })}>
                {isVideoItem(item) && item.thumbnailUrl ? (
                  <Thumbnail as="video" src={item.thumbnailUrl} muted playsInline preload="metadata" aria-label="영상 광고 미리보기" />
                ) : <Thumbnail src={item.thumbnailUrl ?? FALLBACK_THUMBNAIL} alt="" />}
                <CardText>
                  <Title>{item.title}</Title>
                  <Description>{getDescription(item)}</Description>
                </CardText>
                <Chevron aria-hidden="true" dangerouslySetInnerHTML={{ __html: chevronRightIcon }} />
              </ReviewCard>
            ))}
          </ReviewList>
        ) : <EmptyMessage>검토할 광고가 없어요.</EmptyMessage>}
      </Content>
      <AdminBottomNavigation />
    </Page>
  );
};

export default AdminReviews;
