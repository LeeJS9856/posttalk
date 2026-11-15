import type { AdSession, ArchiveItem } from '@/apis/posttalk';
import type { AdFormat } from '@/constants/home';

/**
 * 광고 상태. 백엔드 이름을 그대로 쓴다.
 * 게시 기능이 꺼져 있는 동안은 만든 광고가 모두 '보관 중'이다.
 */
export type AdStatus = 'draft' | 'published';

export const AD_STATUS_LABEL: Record<AdStatus, string> = {
  draft: '보관 중이에요',
  published: '올렸어요',
};

/** 썸네일 위와 보관함 필터에 쓰는 짧은 이름. */
export const AD_STATUS_SHORT_LABEL: Record<AdStatus, string> = {
  draft: '보관 중',
  published: '올림',
};

/** 화면이 쓰는 광고 한 건. 보관함 응답과 제작 결과 응답을 모두 이 모양으로 바꿔 쓴다. */
export type AdItem = {
  /** 보관함 항목 번호(submissionId). 상세 주소에 쓴다. */
  id: string;
  title: string;
  format: AdFormat;
  status: AdStatus;
  /** 목록 썸네일. 없으면 카드 첫 장, 그것도 없으면 영상을 대신 세운다. */
  thumbnail?: string;
  /** 카드뉴스 PNG. 릴스는 비운다. */
  cards: string[];
  /** 릴스 MP4. 카드뉴스는 비운다. */
  videoUrl?: string;
  caption: string;
  hashtags: string[];
  createdAt?: string;
  permalink?: string;
};

const formatOf = (mediaType: string | undefined): AdFormat =>
  mediaType === 'video' ? 'reels' : 'card_news';

const nonEmpty = (values: (string | null | undefined)[]): string[] =>
  values.filter((value): value is string => Boolean(value));

/** 보관함 항목 → 화면 모양. 서명 URL 은 조회할 때마다 새로 받으므로 저장하지 않는다. */
export const fromArchiveItem = (item: ArchiveItem): AdItem => {
  const format = formatOf(item.mediaType);
  const previews = [...(item.previewAssets ?? [])]
    .sort((a, b) => (a.sortOrder ?? a.index ?? 0) - (b.sortOrder ?? b.index ?? 0))
    .map((asset) => asset.url);
  const cards = format === 'card_news' ? nonEmpty(previews.length > 0 ? previews : [item.generatedAssetUrl]) : [];

  return {
    id: item.submissionId,
    title: item.title ?? '광고',
    format,
    status: item.status === 'published' ? 'published' : 'draft',
    thumbnail: item.thumbnailUrl ?? cards[0] ?? undefined,
    cards,
    videoUrl: format === 'reels' ? (item.generatedAssetUrl ?? undefined) : undefined,
    caption: item.publishCaption ?? '',
    hashtags: [],
    createdAt: item.createdAt,
    permalink: item.instagramPermalink ?? undefined,
  };
};

/** 제작 결과 → 화면 모양. 생성 직후 결과 화면에서 쓴다. */
export const fromAdSession = (session: AdSession): AdItem | null => {
  const submissionId = session.submission?.submissionId;
  if (!submissionId) return null;

  const format = formatOf(session.adType);
  const cards =
    format === 'card_news'
      ? nonEmpty((session.generation?.generatedAssets ?? []).map((asset) => asset.url))
      : [];

  return {
    id: submissionId,
    title: session.intro?.menuIntro || session.store?.primarySubject || '광고',
    format,
    status: session.submission?.status === 'published' ? 'published' : 'draft',
    thumbnail: cards[0],
    cards,
    videoUrl: format === 'reels' ? (session.generation?.resultUrl ?? undefined) : undefined,
    caption: session.submission?.caption ?? '',
    hashtags: session.submission?.hashtags ?? [],
    createdAt: session.createdAt,
  };
};

const DAY_MS = 24 * 60 * 60 * 1000;

/**
 * 만든 날짜를 오늘 기준으로 짧게. 목록에서 같은 메뉴 광고끼리 구분하는 데 쓴다.
 * 오늘 · 어제 · N일 전(일주일 안) · M월 D일.
 */
export const formatRelativeDate = (value: string | undefined, now: Date = new Date()): string => {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';

  const target = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const days = Math.round((today.getTime() - target.getTime()) / DAY_MS);

  if (days <= 0) return '오늘';
  if (days === 1) return '어제';
  if (days < 7) return `${days}일 전`;
  return `${date.getMonth() + 1}월 ${date.getDate()}일`;
};
