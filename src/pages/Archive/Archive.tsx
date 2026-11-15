import { Folder, LayoutGrid, Play, Plus } from 'lucide-react';
import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import AppHeader from '@/components/layout/AppHeader';
import BottomNavigation from '@/components/layout/BottomNavigation';
import {
  AD_STATUS_LABEL,
  AD_STATUS_SHORT_LABEL,
  type AdItem,
  type AdStatus,
} from '@/constants/ads';
import { AD_FORMAT_LABEL, type AdFormat } from '@/constants/home';
import { posterSrc } from '@/constants/media';
import { useAds } from '@/hooks/useAds';
import {
  CreateButton,
  EmptyAction,
  EmptyMark,
  EmptyText,
  EmptyWrap,
  FilterChip,
  FilterRail,
  Grid,
  NoMatch,
  Page,
  PlayBadge,
  RetryButton,
  Scroll,
  StatusChip,
  Tab,
  TabList,
  Tile,
  Title,
  TitleCount,
} from '@/pages/Archive/Archive.styles';

type FormatFilter = 'all' | AdFormat;
type StatusFilter = 'all' | AdStatus;

const STATUS_FILTERS: readonly string[] = ['draft', 'published'];

const FORMAT_TABS: readonly { key: FormatFilter; label: string }[] = [
  { key: 'all', label: '전체' },
  { key: 'card_news', label: AD_FORMAT_LABEL.card_news },
  { key: 'reels', label: AD_FORMAT_LABEL.reels },
];

/** 썸네일이 없는 릴스는 영상 첫 장면을 대신 세운다. */
const AdCover = ({ ad }: { ad: AdItem }): React.JSX.Element | null => {
  if (ad.thumbnail) return <img src={ad.thumbnail} alt="" />;
  if (ad.videoUrl) return <video src={posterSrc(ad.videoUrl)} muted playsInline preload="metadata" />;
  return null;
};

/**
 * 보관함. 위는 형식 탭, 그 아래 상태 칩, 나머지는 사진 격자다.
 * 광고는 한자리에서 짧은 시간에 몰아 만들기 때문에 날짜로 나누지 않는다.
 */
const Archive = (): React.JSX.Element => {
  const navigate = useNavigate();
  // 홈은 ?status=published 처럼 상태를 붙여 들어온다.
  const [searchParams] = useSearchParams();
  const requestedStatus = searchParams.get('status');

  const [format, setFormat] = useState<FormatFilter>('all');
  const [status, setStatus] = useState<StatusFilter>(
    requestedStatus && STATUS_FILTERS.includes(requestedStatus)
      ? (requestedStatus as AdStatus)
      : 'all',
  );

  const { ads, status: loadStatus, error, reload } = useAds();

  // 상태 칩의 개수는 고른 형식 안에서 센다. 탭을 바꾸면 숫자도 따라 바뀐다.
  const inFormat = ads.filter((ad) => format === 'all' || ad.format === format);
  const countOf = (value: AdStatus): number => inFormat.filter((ad) => ad.status === value).length;
  const shown = inFormat.filter((ad) => status === 'all' || ad.status === status);

  const statusChips: { key: StatusFilter; label: string }[] = [
    { key: 'all', label: '전체' },
    { key: 'draft', label: `보관 중 ${countOf('draft')}` },
    { key: 'published', label: `올림 ${countOf('published')}` },
  ];

  const openAd = (ad: AdItem): void => {
    void navigate(`/ads/${ad.id}`);
  };

  return (
    <Page aria-label="보관함">
      <AppHeader
        title={`보관함 ${ads.length}개`}
        logo={
          <Title>
            보관함<TitleCount>{ads.length}</TitleCount>
          </Title>
        }
        action={
          <CreateButton type="button" aria-label="새 광고 만들기" onClick={() => navigate('/create')}>
            <Plus aria-hidden="true" />
          </CreateButton>
        }
      />

      {loadStatus === 'loading' ? (
        <NoMatch>광고를 불러오고 있어요</NoMatch>
      ) : loadStatus === 'error' ? (
        <EmptyWrap>
          <EmptyText>{error ?? '광고를 불러오지 못했어요.'}</EmptyText>
          <RetryButton type="button" onClick={reload}>
            다시 불러오기
          </RetryButton>
        </EmptyWrap>
      ) : ads.length === 0 ? (
        <EmptyWrap>
          <EmptyMark aria-hidden="true">
            <Folder />
          </EmptyMark>
          <EmptyText>
            아직 만든 광고가 없어요
            <br />
            하나 만들어볼까요?
          </EmptyText>
          <EmptyAction type="button" onClick={() => navigate('/create')}>
            광고 만들기
          </EmptyAction>
        </EmptyWrap>
      ) : (
        <>
          <TabList role="tablist" aria-label="형식">
            {FORMAT_TABS.map((tab) => (
              <Tab
                key={tab.key}
                type="button"
                role="tab"
                aria-selected={format === tab.key}
                $on={format === tab.key}
                onClick={() => setFormat(tab.key)}
              >
                {tab.key === 'all' && <LayoutGrid aria-hidden="true" />}
                {tab.label}
              </Tab>
            ))}
          </TabList>

          <Scroll>
            <FilterRail aria-label="게시 상태 거르기">
              {statusChips.map((chip) => (
                <FilterChip
                  key={chip.key}
                  type="button"
                  aria-pressed={status === chip.key}
                  $on={status === chip.key}
                  onClick={() => setStatus(chip.key)}
                >
                  {chip.label}
                </FilterChip>
              ))}
            </FilterRail>

            {shown.length === 0 ? (
              <NoMatch>
                고른 조건에 맞는 광고가 없어요
                <br />
                위에서 조건을 바꿔보세요
              </NoMatch>
            ) : (
              <Grid>
                {shown.map((ad) => (
                  <li key={ad.id}>
                    <Tile
                      type="button"
                      aria-label={`${ad.title}, ${AD_FORMAT_LABEL[ad.format]}, ${AD_STATUS_LABEL[ad.status]}`}
                      onClick={() => openAd(ad)}
                    >
                      <AdCover ad={ad} />
                      {ad.format === 'reels' && (
                        <PlayBadge aria-hidden="true">
                          <Play fill="currentColor" strokeWidth={0} />
                        </PlayBadge>
                      )}
                      {/* 올린 광고에만 글로 표시한다. 대부분이 보관 중이라 그쪽은 표시 없이 둔다. */}
                      {ad.status === 'published' && (
                        <StatusChip>{AD_STATUS_SHORT_LABEL[ad.status]}</StatusChip>
                      )}
                    </Tile>
                  </li>
                ))}
              </Grid>
            )}
          </Scroll>
        </>
      )}

      <BottomNavigation />
    </Page>
  );
};

export default Archive;
