import christmasLeft from '@/assets/theme-ex/christmas-left.jpg';
import christmasMain from '@/assets/theme-ex/christmas-main.jpg';
import christmasRight from '@/assets/theme-ex/christmas-right.jpg';
import minimalLeft from '@/assets/theme-ex/minimal-left.jpg';
import minimalMain from '@/assets/theme-ex/minimal-main.jpg';
import minimalRight from '@/assets/theme-ex/minimal-right.jpg';
import christmasReels from '@/assets/theme-ex/christmas-reels.mp4';
import christmasReelsPoster from '@/assets/theme-ex/christmas-reels-poster.jpg';
import minimalReels from '@/assets/theme-ex/minimal-reels.mp4';
import minimalReelsPoster from '@/assets/theme-ex/minimal-reels-poster.jpg';

/**
 * 광고 콘셉트. 광고 탭(콘셉트 선택 화면)이 쓴다.
 * id 는 생성 요청에 그대로 실어 보낸다(릴스의 minimal 은 서버에서 simple 이다).
 * 콘셉트는 결과물의 스타일이고 앱 UI 와 무관하다.
 *
 * preview 는 형식별 결과물 미리보기다. 둘 다 운영 서버에서 실제로 만든 결과물이다.
 * 카드뉴스는 2026-11-17 바다곰 사시미, 릴스는 2026-11-18 크림라벨(받은 가로 원본 영상 4개로 생성, 540x960 로 줄이고 소리를 뺐다).
 */
/** 카드뉴스 디자인 요청 길이. 서버가 500자까지 받는다. */
export const MAX_CARD_NEWS_STYLE = 500;

export const SUGGESTION_THEMES = [
  {
    id: 'christmas',
    label: '크리스마스',
    /** 분위기 버튼 아래 한 줄 설명. */
    description: '빨강·초록, 따뜻한 연말',
    /** 카드뉴스 디자인 방향(cardNewsStyle, 500자 이하). 서버가 카드뉴스 AI 의 direction 으로 넘긴다. */
    cardNewsStyle:
      '따뜻한 겨울 분위기, 빨강과 초록 포인트, 손글씨처럼 정겨운 문구. 음식이 먹음직스럽게 보이도록 사진을 크게 쓰고, 가게 이름과 대표 메뉴가 잘 보이게.',
    thumb: christmasMain,
    preview: {
      /** 가운데 카드, 왼쪽, 오른쪽 순서. */
      cards: [christmasMain, christmasLeft, christmasRight],
      reels: { video: christmasReels, poster: christmasReelsPoster },
    },
  },
  {
    id: 'minimal',
    label: '미니멀',
    description: '여백 많고 차분한 톤',
    cardNewsStyle:
      '여백이 넉넉한 깔끔한 레이아웃, 차분한 무채색 톤, 짧고 담백한 문구. 음식 사진이 주인공이 되도록 장식을 줄이고, 가게 이름과 대표 메뉴가 잘 보이게.',
    thumb: minimalMain,
    preview: {
      cards: [minimalMain, minimalLeft, minimalRight],
      reels: { video: minimalReels, poster: minimalReelsPoster },
    },
  },
] as const;

export type SuggestionTheme = (typeof SUGGESTION_THEMES)[number];
export type SuggestionThemeId = SuggestionTheme['id'];
