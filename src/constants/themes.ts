import photoEx1 from '@/assets/photo-ex1.jpg';
import photoEx2 from '@/assets/photo-ex2.jpg';
import photoEx3 from '@/assets/photo-ex3.jpg';
import photoEx4 from '@/assets/photo-ex4.jpg';
import videoExPoster from '@/assets/video-ex-poster.jpg';
import videoExPoster2 from '@/assets/video-ex-poster-2.jpg';
import reelsSample from '@/assets/video-ex.mp4';

/**
 * 광고 콘셉트. 광고 탭(콘셉트 선택 화면)이 쓴다.
 * id 는 생성 요청에 그대로 실어 보낸다(릴스의 minimal 은 서버에서 simple 이다).
 * 콘셉트는 결과물의 스타일이고 앱 UI 와 무관하다.
 *
 * preview 는 형식별 결과물 미리보기다. 콘셉트별 결과물 샘플이 나오기 전까지 임시 자료를 쓴다.
 * 릴스는 두 콘셉트가 같은 영상을 공유하고 정지 화면만 다르다.
 */
export const SUGGESTION_THEMES = [
  {
    id: 'christmas',
    label: '크리스마스',
    thumb: photoEx2,
    preview: {
      /** 가운데 카드, 왼쪽, 오른쪽 순서. */
      cards: [photoEx2, photoEx1, photoEx3],
      reels: { video: reelsSample, poster: videoExPoster },
    },
  },
  {
    id: 'minimal',
    label: '미니멀',
    thumb: photoEx4,
    preview: {
      cards: [photoEx4, photoEx3, photoEx1],
      reels: { video: reelsSample, poster: videoExPoster2 },
    },
  },
] as const;

export type SuggestionTheme = (typeof SUGGESTION_THEMES)[number];
export type SuggestionThemeId = SuggestionTheme['id'];
