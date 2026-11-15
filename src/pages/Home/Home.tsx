import { ChevronRight, Play, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import BottomNavigation from '@/components/layout/BottomNavigation';
import {
  AD_STATUS_LABEL,
  AD_STATUS_SHORT_LABEL,
  formatRelativeDate,
  type AdItem,
} from '@/constants/ads';
import { GENERATION_FAILED_NOTICE } from '@/constants/generating';
import { AD_FORMAT_LABEL } from '@/constants/home';
import { posterSrc } from '@/constants/media';
import { useAds } from '@/hooks/useAds';
import {
  AdGrid,
  AdMeta,
  AdName,
  AdThumb,
  AdTile,
  AllButton,
  CreateCard,
  CreateSub,
  CreateText,
  CreateTitle,
  EmptyLine,
  FailNotice,
  FailNoticeClose,
  FailNoticeText,
  HandleBar,
  Hero,
  HeroMessage,
  LoadingTile,
  Page,
  PlayBadge,
  RecentBadge,
  RecentCard,
  RecentDescription,
  RecentName,
  RecentText,
  RecentThumb,
  RetryButton,
  Section,
  SectionHeader,
  SectionTitle,
  Sheet,
  SheetBody,
  SheetHandle,
  Stage,
} from '@/pages/Home/Home.styles';

/** 썸네일이 없는 릴스는 영상 첫 장면을 대신 세운다. */
const AdCover = ({ ad }: { ad: AdItem }): React.JSX.Element | null => {
  if (ad.thumbnail) return <img src={ad.thumbnail} alt="" />;
  if (ad.videoUrl) return <video src={posterSrc(ad.videoUrl)} muted playsInline preload="metadata" />;
  return null;
};

/** 홈 격자에 미리 보여줄 광고 수. 나머지는 보관함에서 본다. */
const PREVIEW_COUNT = 4;

/** 이만큼 끌어야 시트가 열리거나 닫힌다. 스크롤과 헷갈리지 않을 만큼만 둔다. */
const SWIPE_THRESHOLD = 24;

/**
 * 홈. 위는 시장 사진 위의 인사, 아래는 끌어올리는 시트다.
 * 시트는 새 광고 만들기 → 최근 업로드한 광고 → 내가 만든 광고 순서다.
 */
const Home = (): React.JSX.Element => {
  const navigate = useNavigate();
  const location = useLocation();

  const [isExpanded, setIsExpanded] = useState(false);
  const touchStartY = useRef<number | null>(null);
  const bodyRef = useRef<HTMLDivElement>(null);

  // 생성에 실패해 돌아왔을 때만 한 번 띄운다.
  const [showFailNotice, setShowFailNotice] = useState(
    () => (location.state as { notice?: string } | null)?.notice === GENERATION_FAILED_NOTICE,
  );

  // 표시는 기록에서 지운다. 새로고침이나 뒤로 가기로 다시 뜨지 않게 한다.
  useEffect(() => {
    if (location.state) navigate('.', { replace: true, state: null });
  }, [location.state, navigate]);

  const { ads, status, error, reload } = useAds();
  const recentUpload = ads.find((ad) => ad.status === 'published');

  const openAd = (ad: AdItem): void => {
    void navigate(`/ads/${ad.id}`);
  };

  const handleTouchStart = (event: React.TouchEvent): void => {
    touchStartY.current = event.touches[0]?.clientY ?? null;
  };

  // 손잡이에서는 위아래로, 목록에서는 맨 위에 있을 때만 아래로 끌어 닫는다.
  const handleTouchEnd = (event: React.TouchEvent, from: 'handle' | 'body'): void => {
    const startY = touchStartY.current;
    const endY = event.changedTouches[0]?.clientY;
    touchStartY.current = null;
    if (startY === null || endY === undefined) return;

    const distance = endY - startY;
    if (from === 'handle' && distance < -SWIPE_THRESHOLD) setIsExpanded(true);
    const atTop = (bodyRef.current?.scrollTop ?? 0) <= 0;
    if (distance > SWIPE_THRESHOLD && (from === 'handle' || atTop)) setIsExpanded(false);
  };

  return (
    <Page aria-label="홈">
      <Stage>
        <Hero>
          <HeroMessage $hidden={isExpanded}>
            사장님,
            <br />
            <strong>오늘 광고</strong> 하나
            <br />
            만들어 볼까요?
          </HeroMessage>
        </Hero>

        <Sheet $expanded={isExpanded}>
          <SheetHandle
            type="button"
            aria-label={isExpanded ? '목록 접기' : '목록 펼치기'}
            aria-expanded={isExpanded}
            onClick={() => setIsExpanded((current) => !current)}
            onTouchStart={handleTouchStart}
            onTouchEnd={(event) => handleTouchEnd(event, 'handle')}
          >
            <HandleBar />
          </SheetHandle>

          <SheetBody
            ref={bodyRef}
            onScroll={(event) => {
              // 목록을 밀어 올리면 시트도 함께 펼친다. 손잡이를 몰라도 끝까지 볼 수 있다.
              if (!isExpanded && event.currentTarget.scrollTop > 8) setIsExpanded(true);
            }}
            onTouchStart={handleTouchStart}
            onTouchEnd={(event) => handleTouchEnd(event, 'body')}
          >
            {showFailNotice && (
              <FailNotice role="alert">
                <FailNoticeText>광고를 만들지 못했어요. 다시 만들어 주세요.</FailNoticeText>
                <FailNoticeClose
                  type="button"
                  aria-label="안내 닫기"
                  onClick={() => setShowFailNotice(false)}
                >
                  <X aria-hidden="true" />
                </FailNoticeClose>
              </FailNotice>
            )}

            <CreateCard type="button" onClick={() => navigate('/create')}>
              <CreateText>
                <CreateTitle>새 광고 만들기</CreateTitle>
                <CreateSub>사진 몇 장이면 광고가 나와요</CreateSub>
              </CreateText>
              <ChevronRight aria-hidden="true" />
            </CreateCard>

            {recentUpload && (
              <Section>
                <SectionHeader>
                  <SectionTitle>최근 업로드한 광고</SectionTitle>
                  <AllButton type="button" onClick={() => navigate('/archive?status=published')}>
                    전체 보기
                  </AllButton>
                </SectionHeader>
                <RecentCard
                  type="button"
                  aria-label={`${recentUpload.title}, ${AD_STATUS_LABEL[recentUpload.status]}`}
                  onClick={() => openAd(recentUpload)}
                >
                  <RecentThumb src={recentUpload.thumbnail} alt="" />
                  <RecentText>
                    <RecentBadge>{AD_STATUS_SHORT_LABEL[recentUpload.status]}</RecentBadge>
                    <RecentName>{recentUpload.title}</RecentName>
                    <RecentDescription>
                      {AD_FORMAT_LABEL[recentUpload.format]} · {formatRelativeDate(recentUpload.createdAt)}
                    </RecentDescription>
                  </RecentText>
                  <ChevronRight aria-hidden="true" />
                </RecentCard>
              </Section>
            )}

            <Section>
              <SectionHeader>
                <SectionTitle>내가 만든 광고</SectionTitle>
                {status === 'ready' && ads.length > 0 && (
                  <AllButton type="button" onClick={() => navigate('/archive')}>
                    전체 보기
                  </AllButton>
                )}
              </SectionHeader>
              {status === 'loading' ? (
                <AdGrid aria-label="광고를 불러오는 중">
                  {Array.from({ length: 2 }, (_, order) => (
                    <li key={order}>
                      <LoadingTile />
                    </li>
                  ))}
                </AdGrid>
              ) : status === 'error' ? (
                <>
                  <EmptyLine>{error ?? '광고를 불러오지 못했어요.'}</EmptyLine>
                  <RetryButton type="button" onClick={reload}>
                    다시 불러오기
                  </RetryButton>
                </>
              ) : ads.length > 0 ? (
                <AdGrid>
                  {ads.slice(0, PREVIEW_COUNT).map((ad) => (
                    <li key={ad.id}>
                      <AdTile
                        type="button"
                        aria-label={`${ad.title}, ${AD_FORMAT_LABEL[ad.format]}, ${AD_STATUS_LABEL[ad.status]}`}
                        onClick={() => openAd(ad)}
                      >
                        <AdThumb>
                          <AdCover ad={ad} />
                          {ad.format === 'reels' && (
                            <PlayBadge>
                              <Play fill="currentColor" strokeWidth={0} />
                            </PlayBadge>
                          )}
                        </AdThumb>
                        <AdName>
                          {ad.title}
                          <AdMeta> · {formatRelativeDate(ad.createdAt)}</AdMeta>
                        </AdName>
                      </AdTile>
                    </li>
                  ))}
                </AdGrid>
              ) : (
                <EmptyLine>만든 광고가 여기에 모여요</EmptyLine>
              )}
            </Section>
          </SheetBody>
        </Sheet>
      </Stage>

      <BottomNavigation />
    </Page>
  );
};

export default Home;
