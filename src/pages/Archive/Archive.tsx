import { useEffect, useState } from 'react';

import {
  getMerchantArchive,
  type MerchantArchiveItem,
  type MerchantArchiveStatus,
} from '@/apis/archive';
import ArchivedAdCard from '@/components/archive/ArchivedAdCard';
import ArchivedAdCardSkeleton from '@/components/archive/ArchivedAdCardSkeleton';
import BottomNavigation from '@/components/layout/BottomNavigation';
import PageHeader from '@/components/layout/PageHeader';
import { ARCHIVE_FILTERS, type ArchivedAd, type ArchiveFormat, type StatusFilter } from '@/constants/archive';
import { TEMP_QR_USER_SESSION } from '@/constants/user';
import { AdList, Content, EmptyMessage, FilterButton, FilterList, FormatIndicator, FormatTab, FormatTabs, Page, SearchButton, SearchIcon } from '@/pages/Archive/Archive.styles';

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

const FILTERED_STATUS: Record<Exclude<StatusFilter, 'all'>, ArchivedAd['status']> = {
  pending: 'pending',
  supplement: 'supplement',
  posted: 'posted',
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
  const [allAds, setAllAds] = useState<ArchivedAd[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    const loadArchive = async () => {
      setIsLoading(true);
      setHasError(false);

      try {
        const responses = await Promise.all(
          (['photo', 'video'] as const).map((mediaType) => getMerchantArchive({
            storeId: TEMP_QR_USER_SESSION.storeId,
            mediaType,
            status: API_STATUS_BY_FILTER.all,
            signal: controller.signal,
          })),
        );

        setAllAds(responses.flatMap((response) => response.data.items.map(toArchivedAd)));
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
  }, []);

  const ads = allAds.filter((ad) =>
    ad.format === format && (filter === 'all' || ad.status === FILTERED_STATUS[filter]));

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
          <AdList aria-label="보관함 광고를 불러오는 중">
            <ArchivedAdCardSkeleton />
            <ArchivedAdCardSkeleton />
          </AdList>
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

export default Archive;
