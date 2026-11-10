import christmasPhoto from '@/assets/photo-ex2.jpg';
import minimalPhoto from '@/assets/photo-ex4.jpg';
import reelsSample from '@/assets/video-ex.mp4';

/**
 * 광고 콘셉트. 홈 제안 블록과 콘셉트 선택 화면이 같은 값을 쓴다.
 * id 는 생성 요청에 그대로 실어 보낸다.
 * 전시 기간이 짧아 상수로 관리한다. 문구를 바꾸려면 이 파일만 고치면 된다.
 * sample 은 형식별 결과물 미리보기다. 콘셉트별 샘플이 나오기 전까지 임시 자료를 쓰며,
 * 릴스 샘플은 두 콘셉트가 같은 파일을 공유한다.
 */
export const SUGGESTION_THEMES = [
  {
    id: 'christmas',
    label: '크리스마스',
    kicker: '12월 제안',
    title: '사장님,\n크리스마스 광고 어떠세요?',
    description: '연말 분위기에 맞는 문구와 색으로 만들어드려요',
    action: '크리스마스 광고 만들기',
    sample: { card_news: christmasPhoto, reels: reelsSample },
    tone: {
      surface: 'linear-gradient(145deg, #e8f1ea, #cfe3d4)',
      orb: '#8fbf9f',
      kicker: '#4e7a5e',
      description: '#5c7a66',
    },
  },
  {
    id: 'minimal',
    label: '미니멀',
    kicker: '언제든',
    title: '군더더기 없이\n메뉴만 또렷하게',
    description: '장식을 덜어내고 음식과 글씨만 남깁니다',
    action: '미니멀 광고 만들기',
    sample: { card_news: minimalPhoto, reels: reelsSample },
    tone: {
      surface: 'linear-gradient(145deg, #f3f3f4, #e0e0e4)',
      orb: '#bfbfc6',
      kicker: '#6a6b73',
      description: '#76777f',
    },
  },
] as const;

export type SuggestionTheme = (typeof SUGGESTION_THEMES)[number];
export type SuggestionThemeId = SuggestionTheme['id'];

/** 제안이 다음 콘셉트로 넘어가는 간격 */
export const SUGGESTION_INTERVAL_MS = 4000;
