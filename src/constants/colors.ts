export const COLORS = {
  white: '#ffffff',
  black: '#000000',
  background: {
    main: '#ffffff',
    subtle: '#f3f3f5',
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
  },
  text: {
    main: '#15161a',
    grey: '#6a6b73',
    muted: '#9a9ba2',
    inverse: '#ffffff',
  },
  /** 바텀시트·모달 뒤를 덮는 막 */
  scrim: 'rgba(10, 10, 12, 0.32)',
  border: {
    main: '#ececef',
    strong: '#dcdce0',
  },
  status: {
    unpublished: '#8a6a45',
    published: '#4e7a5e',
    failed: '#a3503f',
  },
} as const;
