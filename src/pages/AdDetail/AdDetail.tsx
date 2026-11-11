import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';

import AppHeader from '@/components/layout/AppHeader';
import { findAdDetail, formatPublishedAt, type AdStatus } from '@/constants/ads';
import { useAdDraft } from '@/hooks/useAdDraft';
import {
  Caption,
  CaptionField,
  CaptionInput,
  Card,
  CardImage,
  CardVideo,
  Content,
  Counter,
  DoneMark,
  EditButton,
  Footer,
  Meta,
  MetaLabel,
  MetaRow,
  MissingText,
  MissingWrap,
  Page,
  PlayMark,
  PlayOverlay,
  PrimaryButton,
  SecondaryButton,
  StatusBadge,
  Strip,
  Thumb,
  ThumbImage,
  TopAction,
} from '@/pages/AdDetail/AdDetail.styles';

const CheckIcon = (): React.JSX.Element => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M5 12.5l4.5 4.5L19 7.5"
      stroke="currentColor"
      strokeWidth="2.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const CloseIcon = (): React.JSX.Element => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const EditIcon = (): React.JSX.Element => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M4 20h4L19 9l-4-4L4 16v4Z"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinejoin="round"
    />
  </svg>
);

const PlayIcon = (): React.JSX.Element => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M8 5.5l11 6.5-11 6.5v-13Z" fill="currentColor" />
  </svg>
);

const LinkIcon = (): React.JSX.Element => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M14 5h5v5M19 5l-8 8M18 14v5H5V6h5"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const AdDetail = (): React.JSX.Element => {
  const navigate = useNavigate();
  const { adId } = useParams();
  const [params] = useSearchParams();
  const { resetDraft } = useAdDraft();

  const ad = findAdDetail(adId);

  /** 제작 직후로 들어왔는지. 머리와 닫기 동작이 갈린다. */
  const fromCreate = params.get('from') === 'create';

  const [cardIndex, setCardIndex] = useState(0);
  const [status, setStatus] = useState<AdStatus>(ad?.status ?? 'unpublished');
  const [publishedAt, setPublishedAt] = useState(ad?.publishedAt);
  const [caption, setCaption] = useState(ad?.caption ?? '');
  const [isEditing, setIsEditing] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const publishTimerRef = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(publishTimerRef.current), []);

  if (!ad) {
    return (
      <Page aria-label="광고 상세">
        <MissingWrap>
          <MissingText>
            광고를 찾지 못했어요.
            <br />
            보관함에서 다시 골라주세요.
          </MissingText>
          <TopAction type="button" onClick={() => navigate('/')}>
            홈으로
          </TopAction>
        </MissingWrap>
      </Page>
    );
  }

  const isReels = ad.format === 'reels';
  const isPublished = status === 'published';

  /** 체험이 끝나면 다음 관람객을 위해 입력값을 비운다. */
  const finish = (): void => {
    resetDraft();
    navigate('/', { replace: true });
  };

  const publish = (): void => {
    setIsEditing(false);
    setIsPublishing(true);
    // 게시 API 가 붙기 전까지 쓰는 표본 동작. 실제로는 응답을 받고 상태를 바꾼다.
    publishTimerRef.current = window.setTimeout(() => {
      setIsPublishing(false);
      setStatus('published');
      setPublishedAt(new Date().toISOString().slice(0, 10));
    }, 1500);
  };

  return (
    <Page aria-label="광고 상세">
      {fromCreate ? (
        <AppHeader
          title="다 만들었어요"
          leading={
            <DoneMark aria-hidden="true">
              <CheckIcon />
            </DoneMark>
          }
          action={
            <TopAction type="button" aria-label="닫기" onClick={finish}>
              <CloseIcon />
            </TopAction>
          }
        />
      ) : (
        <AppHeader title="보관함" onBack={() => navigate(-1)} />
      )}

      <Content>
        <Card $tall={isReels}>
          {isReels ? (
            <>
              <CardVideo
                ref={videoRef}
                src={ad.videoUrl}
                controls={isPlaying}
                playsInline
                preload="metadata"
                onPause={() => setIsPlaying(false)}
              />
              {!isPlaying && (
                <PlayOverlay
                  type="button"
                  aria-label="영상 재생"
                  onClick={() => {
                    setIsPlaying(true);
                    void videoRef.current?.play();
                  }}
                >
                  <PlayMark>
                    <PlayIcon />
                  </PlayMark>
                </PlayOverlay>
              )}
            </>
          ) : (
            <>
              <CardImage src={ad.cards[cardIndex]} alt={`${ad.title} ${cardIndex + 1}번째 카드`} />
              <Counter>
                {cardIndex + 1} / {ad.cards.length}
              </Counter>
            </>
          )}
        </Card>

        {!isReels && ad.cards.length > 1 && (
          <Strip>
            {ad.cards.map((card, order) => (
              <Thumb
                key={card}
                type="button"
                aria-label={`${order + 1}번째 카드 보기`}
                aria-current={order === cardIndex}
                $on={order === cardIndex}
                onClick={() => setCardIndex(order)}
              >
                <ThumbImage src={card} alt="" />
              </Thumb>
            ))}
          </Strip>
        )}

        <Meta>
          {isPublished && publishedAt && (
            <StatusBadge>
              <CheckIcon />
              {formatPublishedAt(publishedAt)}에 올림
            </StatusBadge>
          )}

          <MetaRow>
            <MetaLabel>캡션</MetaLabel>
            {!isPublished && !isPublishing && (
              <EditButton type="button" onClick={() => setIsEditing((on) => !on)}>
                <EditIcon />
                {isEditing ? '다 고쳤어요' : '고치기'}
              </EditButton>
            )}
          </MetaRow>

          {isEditing ? (
            <CaptionField>
              <CaptionInput
                // oxlint-disable-next-line jsx-a11y/no-autofocus -- 고치기를 눌러 들어온 자리다
                autoFocus
                rows={4}
                value={caption}
                aria-label="캡션"
                onChange={(event) => setCaption(event.target.value)}
              />
            </CaptionField>
          ) : (
            <Caption $muted={isPublished}>{caption}</Caption>
          )}
        </Meta>
      </Content>

      <Footer>
        {isPublished ? (
          <SecondaryButton href={ad.postUrl} target="_blank" rel="noreferrer">
            <LinkIcon />
            게시물 보기
          </SecondaryButton>
        ) : (
          <PrimaryButton type="button" disabled={isPublishing} onClick={publish}>
            {isPublishing ? '올리는 중이에요' : '인스타그램에 올리기'}
          </PrimaryButton>
        )}
      </Footer>
    </Page>
  );
};

export default AdDetail;
