import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import AppHeader from '@/components/layout/AppHeader';
import BottomNavigation from '@/components/layout/BottomNavigation';
import { SAMPLE_AD_DETAILS, formatPublishedAt } from '@/constants/ads';
import { AD_FORMAT_LABEL, type AdFormat } from '@/constants/home';
import { posterSrc } from '@/constants/media';
import { useShop } from '@/hooks/useShop';
import {
  Avatar,
  Caption,
  CaptionName,
  Chip,
  ChipRail,
  Counter,
  CreateButton,
  EmptyAction,
  EmptyMark,
  EmptyText,
  EmptyWrap,
  Feed,
  HeadText,
  MediaButton,
  MediaImage,
  MediaVideo,
  NoMatch,
  Page,
  PlayMark,
  Post,
  PostDate,
  PostHead,
  PostMeta,
  ShopName,
  StatusBadge,
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

const PlusIcon = (): React.JSX.Element => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
  </svg>
);

const PlayIcon = (): React.JSX.Element => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M8 5.5l11 6.5-11 6.5v-13Z" fill="currentColor" />
  </svg>
);

type Filter = 'all' | AdFormat;
type StatusFilter = 'all' | 'published' | 'unpublished';

const LINE_BREAK = String.fromCharCode(10);

/** 피드에는 캡션 첫 줄만 보여준다. 해시태그 줄은 상세에서 본다. */
const firstLine = (caption: string): string => caption.split(LINE_BREAK)[0] ?? '';

const Archive = (): React.JSX.Element => {
  const navigate = useNavigate();
  const { profile } = useShop();
  const [filter, setFilter] = useState<Filter>('all');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');

  const ads = SAMPLE_AD_DETAILS;

  const counts = useMemo(
    () => ({
      all: ads.length,
      card_news: ads.filter((ad) => ad.format === 'card_news').length,
      reels: ads.filter((ad) => ad.format === 'reels').length,
      published: ads.filter((ad) => ad.status === 'published').length,
      unpublished: ads.filter((ad) => ad.status !== 'published').length,
    }),
    [ads],
  );

  const shown = useMemo(
    () =>
      ads
        .filter((ad) => filter === 'all' || ad.format === filter)
        .filter(
          (ad) =>
            statusFilter === 'all' ||
            (statusFilter === 'published') === (ad.status === 'published'),
        ),
    [ads, filter, statusFilter],
  );

  const formatChips: { key: Filter; label: string }[] = [
    { key: 'all', label: '전체' },
    { key: 'card_news', label: AD_FORMAT_LABEL.card_news },
    { key: 'reels', label: AD_FORMAT_LABEL.reels },
  ];

  const statusChips: { key: StatusFilter; label: string }[] = [
    { key: 'all', label: '상태 전체' },
    { key: 'published', label: '올림' },
    { key: 'unpublished', label: '안 올림' },
  ];

  return (
    <Page aria-label="보관함">
      <AppHeader
        title="보관함"
        action={
          <CreateButton type="button" onClick={() => navigate('/create')}>
            <PlusIcon />
            만들기
          </CreateButton>
        }
      />

      {ads.length > 0 && (
        <>
          <ChipRail aria-label="형식 거르기">
            {formatChips.map((chip) => (
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

          <ChipRail aria-label="게시 상태 거르기">
            {statusChips.map((chip) => (
              <Chip
                key={chip.key}
                type="button"
                aria-pressed={statusFilter === chip.key}
                $on={statusFilter === chip.key}
                onClick={() => setStatusFilter(chip.key)}
              >
                {chip.label}
                {chip.key !== 'all' && ` ${counts[chip.key]}`}
              </Chip>
            ))}
          </ChipRail>
        </>
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
        <Feed>
          {shown.length === 0 && (
            <NoMatch>
              고른 조건에 맞는 광고가 없어요
              <br />
              위에서 조건을 바꿔보세요
            </NoMatch>
          )}
          {shown.map((ad) => {
            const isReels = ad.format === 'reels';
            const isPublished = ad.status === 'published';

            return (
              <Post key={ad.adId}>
                <PostHead>
                  <Avatar aria-hidden="true">{profile.name.slice(0, 1)}</Avatar>
                  <HeadText>
                    <ShopName>{profile.name}</ShopName>
                    <PostMeta>
                      {AD_FORMAT_LABEL[ad.format]}
                      {!isReels && ` · ${ad.cards.length}장`}
                    </PostMeta>
                  </HeadText>
                  <StatusBadge $published={isPublished}>
                    {isPublished ? '올림' : '안 올림'}
                  </StatusBadge>
                </PostHead>

                <MediaButton
                  type="button"
                  aria-label={`${ad.title} 광고 열기`}
                  onClick={() => navigate(`/ads/${ad.adId}`)}
                >
                  {isReels ? (
                    <>
                      <MediaVideo
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
                    <>
                      <MediaImage src={ad.cards[0]} alt="" />
                      <Counter>1 / {ad.cards.length}</Counter>
                    </>
                  )}
                </MediaButton>

                <Caption>
                  <CaptionName>{profile.name}</CaptionName>
                  {firstLine(ad.caption)}
                </Caption>
                {ad.publishedAt && (
                  <PostDate>{formatPublishedAt(ad.publishedAt)}에 올림</PostDate>
                )}
              </Post>
            );
          })}
        </Feed>
      )}

      <BottomNavigation />
    </Page>
  );
};

export default Archive;
