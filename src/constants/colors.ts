export const COLORS = {
  white: '#ffffff',
  black: '#000000',
  background: {
    main: '#ffffff',
    subtle: '#f3f3f5',
    /** 결과물 사진을 띄우는 어두운 면. 사진이 가장 또렷하게 보이는 바탕이다. */
    inverse: '#1d1c22',
  },
  /**
   * 브랜드 색. 면적은 좁게, 자리는 분명하게 쓴다.
   * 화면 대부분을 사용자가 만든 광고 사진이 채우므로, 넓게 깔면 결과물과 색이 싸운다.
   * 쓰는 곳 — 주 버튼, 활성 탭, 선택 표시.
   */
  brand: {
    main: '#6f63a0',
    pressed: '#5c5188',
    soft: '#f0edf8',
    /** soft 면 위의 점선 테두리. 아직 채우지 않은 촬영 칸에 쓴다. */
    line: '#b9b1d8',
  },
  /**
   * 글씨 색. 밝은 가게와 부스에서도 읽히도록 WCAG 4.5:1 을 지킨다.
   * grey 는 흰 바탕 6.4:1, muted 는 흰 바탕 5.0:1 · 회색 바탕(background.subtle) 4.5:1.
   * 두 단계 차이는 색보다 크기와 굵기로 만든다.
   */
  text: {
    main: '#15161a',
    grey: '#5d5e66',
    muted: '#6e6f77',
    inverse: '#ffffff',
  },
  /** 캡션 속 해시태그. 인스타그램처럼 글과 구분되는 짙은 파랑. 흰 바탕 9:1 이상. */
  hashtag: '#00376b',
  /** 녹화 표시. 다른 곳에 쓰지 않는다. */
  record: '#e2503f',
  /** 바텀시트·모달 뒤를 덮는 막 */
  scrim: 'rgba(10, 10, 12, 0.32)',
  border: {
    main: '#ececef',
    strong: '#dcdce0',
  },
  /** 상태 글씨. 같은 이름의 statusSoft 바탕 위에서 4.5:1 을 넘는다. */
  status: {
    draft: '#7d5f3c',
    published: '#447056',
    failed: '#a3503f',
  },
  /** 상태 뱃지 바탕. 글씨는 같은 이름의 status 색을 쓴다. */
  statusSoft: {
    draft: '#f5efe6',
    published: '#e8f0ea',
    failed: '#f7eceb',
  },
  /**
   * 사진 위에 얹는 상태 점. 어두운 막(overlay) 위에서 보이도록 밝게 둔다.
   * 글씨에는 쓰지 않는다. 글씨는 흰색으로 둔다.
   */
  statusDot: {
    draft: '#f2b54e',
    published: '#7fcf9a',
    failed: '#ff7b67',
  },
  /** 사진 위에 글씨를 얹을 때 까는 막. 흰 글씨가 어떤 사진 위에서도 읽힌다. */
  overlay: 'rgba(10, 10, 12, 0.66)',
  /** 홈 시장 사진을 덮는 막. 위에서 아래로 옅어져 흰 인사가 어떤 사진 위에서도 읽힌다. */
  heroShade: {
    top: 'rgba(21, 22, 37, 0.82)',
    middle: 'rgba(21, 22, 37, 0.55)',
    bottom: 'rgba(21, 22, 37, 0.3)',
  },
  /** 브랜드 면(brand.main) 위의 글씨. main 은 5.6:1, sub 는 4.6:1 */
  onBrand: {
    main: '#ffffff',
    sub: 'rgba(255, 255, 255, 0.85)',
  },
  /** 어두운 면(background.inverse) 위의 글씨 */
  onInverse: {
    main: '#ffffff',
    sub: 'rgba(255, 255, 255, 0.72)',
  },
} as const;
