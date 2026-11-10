/**
 * 홈 제안 블록에 돌아가는 테마.
 * 전시 기간이 짧아 상수로 관리한다. 문구를 바꾸려면 이 파일만 고치면 된다.
 * id 는 제작 흐름으로 넘길 때 선택된 테마를 가리킨다.
 */
export const SUGGESTION_THEMES = [
  {
    id: 'christmas',
    kicker: '12월 제안',
    title: '사장님,\n크리스마스 광고 어떠세요?',
    description: '연말 분위기에 맞는 문구와 색으로 만들어드려요',
    action: '크리스마스 광고 만들기',
    tone: {
      surface: 'linear-gradient(145deg, #e8f1ea, #cfe3d4)',
      orb: '#8fbf9f',
      kicker: '#4e7a5e',
      description: '#5c7a66',
    },
  },
  {
    id: 'winter-menu',
    kicker: '이번 주',
    title: '날이 추워졌어요.\n따뜻한 메뉴를 알려볼까요?',
    description: '온기가 보이는 사진 구도로 안내해드려요',
    action: '겨울 메뉴 광고 만들기',
    tone: {
      surface: 'linear-gradient(145deg, #f3ebe2, #e4d2bd)',
      orb: '#c9a47c',
      kicker: '#8a6a45',
      description: '#7a6450',
    },
  },
  {
    id: 'new-menu',
    kicker: '새로 나왔다면',
    title: '새 메뉴가 있나요?\n첫인상을 만들어드려요',
    description: '신메뉴를 소개하는 구성으로 카드뉴스를 짭니다',
    action: '신메뉴 광고 만들기',
    tone: {
      surface: 'linear-gradient(145deg, #e6ecf5, #ccd8ea)',
      orb: '#8fa6cc',
      kicker: '#4a6a96',
      description: '#5a6a85',
    },
  },
  {
    id: 'thanks',
    kicker: '단골에게',
    title: '감사 인사를 담은\n광고는 어떠세요?',
    description: '오래 찾아준 손님에게 건네는 톤으로 문구를 씁니다',
    action: '감사 광고 만들기',
    tone: {
      surface: 'linear-gradient(145deg, #f5e9ee, #ead0da)',
      orb: '#cc9db0',
      kicker: '#8f5f73',
      description: '#80636d',
    },
  },
] as const;

export type SuggestionTheme = (typeof SUGGESTION_THEMES)[number];
export type SuggestionThemeId = SuggestionTheme['id'];

/** 제안이 다음 테마로 넘어가는 간격 */
export const SUGGESTION_INTERVAL_MS = 4000;
