import { createGlobalStyle } from 'styled-components';

import gabarito from '@/assets/fonts/Gabarito.woff2';
import pretendard from '@/assets/fonts/PretendardVariable.woff2';
import { COLORS } from '@/constants/colors';
import { MAX_APP_WIDTH } from '@/constants/layout';
import { FONT_WEIGHT } from '@/constants/typography';

const GlobalStyle = createGlobalStyle`
  /* 본문용. 한글 자소 간격이 고른 가변 폰트 하나로 굵기를 모두 덮는다. */
  @font-face {
    font-family: 'Pretendard Variable';
    src: url(${pretendard}) format('woff2-variations');
    font-weight: 100 900;
    font-display: swap;
  }

  /* 로고 전용. 본문에는 쓰지 않는다. 글자가 늦게 와도 다른 글씨로 깜빡이지 않게 block 으로 둔다. */
  @font-face {
    font-family: 'Gabarito';
    src: url(${gabarito}) format('woff2-variations');
    font-weight: 400 900;
    font-display: block;
  }

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Pretendard Variable', system-ui, -apple-system, 'Apple SD Gothic Neo',
      'Noto Sans KR', 'Malgun Gothic', sans-serif;
  }

  html, body, #root {
    min-width: 320px;
    min-height: 100%;
  }

  body {
    color: ${COLORS.text.main};
    background-color: ${COLORS.background.main};
    /* 한글은 400 이면 실제 폰에서 가늘게 읽힌다. 따로 정하지 않은 글은 500 으로 둔다. */
    font-weight: ${FONT_WEIGHT.medium};
    line-height: 1.5;
    letter-spacing: -0.01em;
    -webkit-font-smoothing: antialiased;
  }

  #root {
    max-width: ${MAX_APP_WIDTH};
    margin: 0 auto;
    background-color: ${COLORS.background.main};
  }

  button, input, textarea, select {
    font: inherit;
    color: inherit;
  }

  button {
    cursor: pointer;
    border: none;
    background: none;
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  img, video {
    display: block;
    max-width: 100%;
  }

  /* 브라우저 기본 포커스 테두리 대신 브랜드 색으로 그린다. 키보드로 움직일 때만 보인다. */
  :focus-visible {
    outline: 2px solid ${COLORS.brand.main};
    outline-offset: 2px;
  }

  ::selection {
    background-color: ${COLORS.brand.soft};
    color: ${COLORS.text.main};
  }

  /* 전시 기기에서 스크롤바가 보이지 않게 한다 */
  * {
    scrollbar-width: none;
  }

  *::-webkit-scrollbar {
    display: none;
  }
`;

export default GlobalStyle;
