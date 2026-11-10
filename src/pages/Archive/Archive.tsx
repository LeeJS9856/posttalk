import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import BottomNavigation from '@/components/layout/BottomNavigation';
import { SAMPLE_AD_DETAILS, formatPublishedAt } from '@/constants/ads';
import { AD_FORMAT_LABEL, type AdFormat } from '@/constants/home';
import { posterSrc } from '@/constants/media';
import {
  AdButton,
  AdStatusText,
  AdTitle,
  Caption,
  Chip,
  ChipRail,
  EmptyAction,
  EmptyMark,
  EmptyText,
  EmptyWrap,
  FormatBadge,
  Frame,
  FrameImage,
  FrameVideo,
  Header,
  Item,
  List,
  Page,
  PlayMark,
  Title,
} from '@/pages/Archive/Archive.styles';

const FolderIcon = (): React.JSX.Element => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M3.5 6.5h6l2 2.5h9v9.5h-17V6.5Z"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinejoin="round"
    />
  </svg>
);

const PlayIcon = (): React.JSX.Element => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M8 5.5l11 6.5-11 6.5v-13Z" fill="currentColor" />
  </svg>
);

type Filter = 'all' | AdFormat;

const Archive = (): React.JSX.Element => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<Filter>('all');

  const ads = SAMPLE_AD_DETAILS;

  const counts = useMemo(
    () => ({
      all: ads.length,
      card_news: ads.filter((ad) => ad.format === 'card_news').length,
      reels: ads.filter((ad) => ad.format === 'reels').length,
    }),
    [ads],
  );

  const shown = useMemo(
    () => (filter === 'all' ? ads : ads.filter((ad) => ad.format === filter)),
    [ads, filter],
  );

  const chips: { key: Filter; label: string }[] = [
    { key: 'all', label: '전체' },
    { key: 'card_news', label: AD_FORMAT_LABEL.card_news },
    { key: 'reels', label: AD_FORMAT_LABEL.reels },
  ];

  return (
    <Page aria-label="보관함">
      <Header>
        <Title>보관함</Title>
      </Header>

      {ads.length > 0 && (
        <ChipRail>
          {chips.map((chip) => (
            <Chip
              key={chip.key}
              type="button"
              aria-pressed={filter === chip.key}
              $on={filter === chip.key}
              onClick={() => setFilter(chip.key)}
            >
              {chip.label} {counts[chip.key]}
            </Chip>
          ))}
        </ChipRail>
      )}

      {ads.length === 0 ? (
        <EmptyWrap>
          <EmptyMark aria-hidden="true">
            <FolderIcon />
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
        <List>
          {shown.map((ad) => {
            const isReels = ad.format === 'reels';
            const isPending = ad.status !== 'published';

            return (
              <Item key={ad.adId}>
                <AdButton
                  type="button"
                  aria-label={`${ad.title} 광고 열기`}
                  onClick={() => navigate(`/ads/${ad.adId}`)}
                >
                  <Frame>
                    {isReels ? (
                      <>
                        <FrameVideo
                          src={ad.videoUrl && posterSrc(ad.videoUrl)}
                          muted
                          playsInline
                          preload="metadata"
                        />
                        <PlayMark aria-hidden="true">
                          <PlayIcon />
                        </PlayMark>
                      </>
                    ) : (
                      <FrameImage src={ad.cards[0]} alt="" />
                    )}
                    <FormatBadge>{AD_FORMAT_LABEL[ad.format]}</FormatBadge>
                  </Frame>

                  <Caption>
                    <AdTitle>{ad.title}</AdTitle>
                    <AdStatusText $pending={isPending}>
                      {isPending
                        ? '아직 안 올렸어요'
                        : ad.publishedAt
                          ? `${formatPublishedAt(ad.publishedAt)}에 올림`
                          : '올렸어요'}
                    </AdStatusText>
                  </Caption>
                </AdButton>
              </Item>
            );
          })}
        </List>
      )}

      <BottomNavigation />
    </Page>
  );
};

export default Archive;
