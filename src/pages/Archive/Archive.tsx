import { useEffect, useState } from 'react';
import styled from 'styled-components';

import {
  getMerchantArchive,
  type MerchantArchiveItem,
  type MerchantArchiveStatus,
} from '@/apis/archive';
import ArchivedAdCard from '@/components/archive/ArchivedAdCard';
import BottomNavigation from '@/components/layout/BottomNavigation';
import PageHeader from '@/components/layout/PageHeader';
import PageFrame from '@/components/layout/PageFrame';
import { ARCHIVE_FILTERS, type ArchivedAd, type ArchiveFormat, type StatusFilter } from '@/constants/archive';
import { COLORS } from '@/constants/colors';
import { FONT_SIZE } from '@/constants/typography';
import { TEMP_QR_USER_SESSION } from '@/constants/user';

const API_STATUS_BY_FILTER: Record<StatusFilter, MerchantArchiveStatus> = {
  all: 'all',
  pending: 'pending_review',
  supplement: 'rejected',
  posted: 'approved',
};

const UI_STATUS_BY_API_STATUS: Record<MerchantArchiveItem['status'], ArchivedAd['status']> = {
  pending_review: 'pending',
  rejected: 'supplement',
  approved: 'posted',
};

const toArchivedAd = (item: MerchantArchiveItem): ArchivedAd => ({
  id: item.submissionId,
  format: item.mediaType,
  title: item.title,
  date: item.createdAt.slice(0, 10).replaceAll('-', '.'),
  status: UI_STATUS_BY_API_STATUS[item.status],
  images: item.mediaType === 'photo' && item.thumbnailUrl ? [item.thumbnailUrl] : [],
  thumbnailUrl: item.thumbnailUrl ?? undefined,
});

const Archive = (): React.JSX.Element => {
  const [format, setFormat] = useState<ArchiveFormat>('photo');
  const [filter, setFilter] = useState<StatusFilter>('all');
  const [ads, setAds] = useState<ArchivedAd[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    const loadArchive = async () => {
      setIsLoading(true);
      setHasError(false);

      try {
        const response = await getMerchantArchive({
          storeId: TEMP_QR_USER_SESSION.storeId,
          mediaType: format,
          status: API_STATUS_BY_FILTER[filter],
          signal: controller.signal,
        });

        setAds(response.data.items.map(toArchivedAd));
      } catch (error) {
        if (!(error instanceof DOMException && error.name === 'AbortError')) {
          setHasError(true);
        }
      } finally {
        if (!controller.signal.aborted) setIsLoading(false);
      }
    };

    void loadArchive();

    return () => controller.abort();
  }, [filter, format]);

  return (
    <Page aria-label="보관함 페이지">
      <PageHeader
        title="보관함"
        rightAction={
          <SearchButton type="button" aria-label="광고 검색">
          <SearchIcon aria-hidden="true" />
          </SearchButton>
        }
      />

      <FormatTabs aria-label="광고 형식">
        <FormatIndicator $format={format} aria-hidden="true" />
        <FormatTab type="button" $active={format === 'photo'} onClick={() => setFormat('photo')}>
          사진 광고
        </FormatTab>
        <FormatTab type="button" $active={format === 'video'} onClick={() => setFormat('video')}>
          동영상 광고
        </FormatTab>
      </FormatTabs>

      <FilterList aria-label="광고 상태 필터">
        {ARCHIVE_FILTERS.map(({ label, value }) => (
          <FilterButton
            key={value}
            type="button"
            $active={filter === value}
            aria-pressed={filter === value}
            onClick={() => setFilter(value)}
          >
            {label}
          </FilterButton>
        ))}
      </FilterList>

      <Content>
        {isLoading ? (
          <EmptyMessage>보관함을 불러오는 중이에요.</EmptyMessage>
        ) : hasError ? (
          <EmptyMessage>보관함을 불러오지 못했어요.</EmptyMessage>
        ) : ads.length > 0 ? (
          <AdList>
            {ads.map((ad) => (
              <ArchivedAdCard key={ad.id} {...ad} />
            ))}
          </AdList>
        ) : (
          <EmptyMessage>해당 조건의 광고가 없어요.</EmptyMessage>
        )}
      </Content>
      <BottomNavigation fixed />
    </Page>
  );
};

const Page = styled(PageFrame)`
  padding-bottom: 80px;
  background: ${COLORS.background.main};
`;

const SearchButton = styled.button`
  display: grid;
  width: 36px;
  height: 36px;
  place-items: center;
  border: 0;
  background: transparent;
`;

const SearchIcon = styled.span`
  position: relative;
  width: 15px;
  height: 15px;
  border: 2px solid ${COLORS.black700};
  border-radius: 50%;

  &::after {
    position: absolute;
    right: -5px;
    bottom: -3px;
    width: 7px;
    height: 2px;
    border-radius: 2px;
    background: ${COLORS.black700};
    content: '';
    transform: rotate(45deg);
  }
`;

const FormatTabs = styled.div`
  position: relative;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  border-bottom: 1px solid ${COLORS.black200};
  background: ${COLORS.background.main};
`;

const FormatIndicator = styled.span<{ $format: ArchiveFormat }>`
  position: absolute;
  right: auto;
  bottom: -1px;
  left: 24px;
  width: calc(50% - 48px);
  height: 2px;
  background: ${COLORS.black700};
  transform: ${({ $format }) => ($format === 'photo' ? 'translateX(0)' : 'translateX(calc(100% + 48px))')};
  transition: transform 220ms ease-out;
`;

const FormatTab = styled.button<{ $active: boolean }>`
  position: relative;
  height: 48px;
  border: 0;
  color: ${({ $active }) => ($active ? COLORS.black700 : COLORS.black400)};
  background: transparent;
  font-size: ${FONT_SIZE.body};
  font-weight: ${({ $active }) => ($active ? 700 : 500)};

`;

const FilterList = styled.div`
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding: 20px 24px 14px;
  background: ${COLORS.background.main};
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const FilterButton = styled.button<{ $active: boolean }>`
  flex: 0 0 auto;
  border: 0;
  border-radius: 999px;
  padding: 9px 12px;
  color: ${({ $active }) => ($active ? COLORS.white : COLORS.black400)};
  background: ${({ $active }) => ($active ? COLORS.primary : COLORS.primary100)};
  box-shadow: 0 2px 5px rgba(33, 33, 33, 0.12);
  font-size: ${FONT_SIZE.label};
  font-weight: 400;
`;

const Content = styled.section`
  padding-top: 20px;
`;

const AdList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const EmptyMessage = styled.p`
  padding: 72px 24px;
  color: ${COLORS.black500};
  font-size: ${FONT_SIZE.body};
  text-align: center;
`;

export default Archive;
