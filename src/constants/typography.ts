/**
 * 글자 크기. 국내 앱(토스·배민)과 핀터레스트가 공통으로 쓰는 범위에 맞춘다.
 * 본문은 14~16px, 화면 제목은 22px 이상. 12px 아래는 보조 표기에만 쓴다.
 * 실제 폰에서 이보다 작으면 굵기를 올려도 가늘고 흐리게 읽힌다.
 */
export const FONT_SIZE = {
  caption: '12px',
  label: '13px',
  body: '14px',
  bodyLarge: '16px',
  titleSmall: '17px',
  title: '20px',
  titleLarge: '22px',
  display: '26px',
} as const;

/**
 * 굵기. 한글은 같은 굵기에서 라틴보다 획이 가늘어 보여 한 단계씩 올려 쓴다.
 * regular — 긴 설명, 꺼진 상태
 * medium — 일반 본문
 * semibold — 버튼, 목록 제목, 강조할 짧은 글
 * bold — 화면 제목, 구역 제목
 */
export const FONT_WEIGHT = {
  regular: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
} as const;

export const RADIUS = {
  chip: '11px',
  card: '14px',
  panel: '20px',
  round: '50%',
} as const;
