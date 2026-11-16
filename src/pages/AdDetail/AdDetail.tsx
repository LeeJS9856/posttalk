import { Check, Copy, ExternalLink, Play, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';

import { isAbortError } from '@/apis/api';
import { getAdSession, getArchive, type ApiAdType } from '@/apis/posttalk';
import AppHeader from '@/components/layout/AppHeader';
import {
  AD_STATUS_LABEL,
  formatRelativeDate,
  fromAdSession,
  fromArchiveItem,
  type AdItem,
} from '@/constants/ads';
import { AD_FORMAT_LABEL } from '@/constants/home';
import { posterSrc } from '@/constants/media';
import { useAds } from '@/hooks/useAds';
import { useAdDraft } from '@/hooks/useAdDraft';
import { useWorkspace } from '@/hooks/useWorkspace';
import {
  Caption,
  CaptionHashtag,
  Card,
  CardImage,
  CardVideo,
  Content,
  Counter,
  EditButton,
  Footer,
  Meta,
  MetaLabel,
  MetaLine,
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

type LoadState = { status: 'loading' } | { status: 'ready'; ad: AdItem } | { status: 'error'; message: string };

/** 보관함 조회는 형식을 하나씩 받는다. 어느 형식인지 모르니 카드뉴스부터 찾아본다. */
const MEDIA_TYPES: readonly ApiAdType[] = ['photo', 'video'];

/** 캡션 뒤에 해시태그를 붙인 글. 그대로 복사해 인스타그램에 붙여 넣는다. */
const fullCaption = (ad: AdItem): string => {
  const tags = ad.hashtags
    .map((tag) => (tag.startsWith('#') ? tag : `#${tag}`))
    .filter((tag) => !ad.caption.includes(tag))
    .join(' ');
  return [ad.caption, tags].filter(Boolean).join('\n\n');
};

const HASHTAG_PATTERN = /(#[^\s#]+)/g;

/** 인스타그램처럼 글 속 해시태그만 파란 글씨로 그린다. 복사되는 글은 그대로다. */
const CaptionText = ({ text }: { text: string }): React.JSX.Element => (
  <>
    {text.split(HASHTAG_PATTERN).map((part, order) =>
      part.startsWith('#') ? (
        // 같은 해시태그가 여러 번 나올 수 있어 순서를 키로 쓴다.
        // oxlint-disable-next-line react/no-array-index-key
        <CaptionHashtag key={order}>{part}</CaptionHashtag>
      ) : (
        part
      ),
    )}
  </>
);

/**
 * 광고 상세. 제작 직후와 보관함 양쪽에서 쓴다.
 * - 제작 직후(?from=create&session=…): 제작 결과 API 로 결과물과 캡션을 받는다.
 * - 보관함에서(/ads/:submissionId): 보관함 한 건 조회로 받는다.
 * 게시 기능이 꺼져 있는 동안은 캡션을 복사해 사장님이 직접 올린다.
 */
const AdDetail = (): React.JSX.Element => {
  const navigate = useNavigate();
  const { adId } = useParams();
  const [params] = useSearchParams();
  const { resetDraft } = useAdDraft();
  const { invalidate } = useAds();
  const { storeId } = useWorkspace();

  const fromCreate = params.get('from') === 'create';
  const sessionId = params.get('session');

  /**
   * 받아 둔 결과에 어느 요청의 것인지 붙여 둔다.
   * 이펙트 안에서 loading 으로 되돌리면 렌더가 한 번 더 돌고, 주소가 바뀌는 사이
   * 앞선 광고의 결과가 잠깐 보일 수 있다. 키가 다르면 그냥 로딩으로 친다.
   */
  const [loaded, setLoaded] = useState<{ key: string; state: LoadState } | null>(null);
  const requestKey = adId ? `${adId}:${sessionId ?? ''}:${storeId ?? ''}` : '';
  const state: LoadState = loaded?.key === requestKey ? loaded.state : { status: 'loading' };
  const [cardIndex, setCardIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [copied, setCopied] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const copiedTimerRef = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(copiedTimerRef.current), []);

  /**
   * 방금 만든 광고다. 들고 있던 목록에는 없으므로 낡은 것으로 표시해 둔다.
   * 홈이나 보관함으로 돌아가면 그때 다시 받는다.
   */
  useEffect(() => {
    if (fromCreate) invalidate();
  }, [fromCreate, invalidate]);

  useEffect(() => {
    if (!adId) return;
    if (!sessionId && !storeId) return;

    const controller = new AbortController();

    const load = async (): Promise<AdItem | null> => {
      if (sessionId) {
        const session = await getAdSession(sessionId, controller.signal);
        return fromAdSession(session);
      }
      for (const mediaType of MEDIA_TYPES) {
        const result = await getArchive(
          { storeId: storeId as string, mediaType, submissionId: adId, limit: 1 },
          controller.signal,
        );
        const item = (result.items ?? []).find((entry) => entry.submissionId === adId);
        if (item) return fromArchiveItem(item);
      }
      return null;
    };

    load()
      .then((ad) =>
        setLoaded({
          key: requestKey,
          state: ad
            ? { status: 'ready', ad }
            : { status: 'error', message: '광고를 찾지 못했어요.\n보관함에서 다시 골라주세요.' },
        }),
      )
      .catch((cause: unknown) => {
        if (isAbortError(cause)) return;
        setLoaded({
          key: requestKey,
          state: {
            status: 'error',
            message: cause instanceof Error ? cause.message : '광고를 불러오지 못했어요.',
          },
        });
      });

    return () => controller.abort();
  }, [adId, sessionId, storeId, requestKey]);

  /** 체험이 끝나면 다음 관람객을 위해 입력값을 비운다. */
  const finish = (): void => {
    resetDraft();
    void navigate('/', { replace: true });
  };

  const header = fromCreate ? (
    <AppHeader
      title="다 만들었어요"
      action={
        <TopAction type="button" aria-label="닫기" onClick={finish}>
          <X aria-hidden="true" />
        </TopAction>
      }
    />
  ) : (
    // 홈과 보관함에서 이름으로 부르던 광고다. 열었다고 '광고'가 되면 안 된다.
    <AppHeader
      title={state.status === 'ready' ? state.ad.title : '광고'}
      onBack={() => void navigate(-1)}
    />
  );

  if (state.status !== 'ready') {
    return (
      <Page aria-label="광고 상세">
        {header}
        <MissingWrap>
          <MissingText>
            {state.status === 'loading' ? '광고를 불러오고 있어요' : state.message}
          </MissingText>
          {state.status === 'error' && (
            <TopAction type="button" onClick={() => void navigate('/')}>
              홈으로
            </TopAction>
          )}
        </MissingWrap>
      </Page>
    );
  }

  const { ad } = state;
  const isReels = ad.format === 'reels';
  const caption = fullCaption(ad);

  const copyCaption = async (): Promise<void> => {
    try {
      await navigator.clipboard.writeText(caption);
      setCopied(true);
      window.clearTimeout(copiedTimerRef.current);
      copiedTimerRef.current = window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // 복사가 막힌 브라우저에서는 사장님이 글을 길게 눌러 직접 복사한다.
    }
  };

  return (
    <Page aria-label="광고 상세">
      {header}

      <Content>
        <Card $tall={isReels}>
          {isReels ? (
            <>
              <CardVideo
                ref={videoRef}
                // 크롬은 preload=metadata 만으로는 첫 장면을 그리지 않아 검은 상자로 남는다.
                src={ad.videoUrl ? posterSrc(ad.videoUrl) : undefined}
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
                    <Play fill="currentColor" strokeWidth={0} />
                  </PlayMark>
                </PlayOverlay>
              )}
            </>
          ) : (
            <>
              <CardImage src={ad.cards[cardIndex]} alt={`${ad.title} ${cardIndex + 1}번째 카드`} />
              {ad.cards.length > 1 && (
                <Counter>
                  {cardIndex + 1} / {ad.cards.length}
                </Counter>
              )}
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
          {/* 올린 광고에만 뱃지를 단다. 전부 '보관 중'인 동안은 달아 봐야 구분이 안 된다. */}
          {ad.status === 'published' && (
            <StatusBadge $status={ad.status}>
              <Check aria-hidden="true" />
              {AD_STATUS_LABEL[ad.status]}
            </StatusBadge>
          )}

          <MetaLine>
            {[
              AD_FORMAT_LABEL[ad.format],
              ad.cards.length > 1 ? `${ad.cards.length}장` : null,
              formatRelativeDate(ad.createdAt),
            ]
              .filter(Boolean)
              .join(' · ')}
          </MetaLine>

          {caption && (
            <>
              <MetaRow>
                <MetaLabel>캡션</MetaLabel>
                <EditButton type="button" onClick={() => void copyCaption()}>
                  {copied ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />}
                  {copied ? '복사했어요' : '복사하기'}
                </EditButton>
              </MetaRow>
              <Caption $muted={false}>
                <CaptionText text={caption} />
              </Caption>
            </>
          )}
        </Meta>
      </Content>

      {(fromCreate || ad.permalink) && (
        <Footer>
          {fromCreate ? (
            <PrimaryButton type="button" onClick={finish}>
              확인했어요
            </PrimaryButton>
          ) : (
            <SecondaryButton href={ad.permalink} target="_blank" rel="noreferrer">
              <ExternalLink aria-hidden="true" />
              게시물 보기
            </SecondaryButton>
          )}
        </Footer>
      )}
    </Page>
  );
};

export default AdDetail;
