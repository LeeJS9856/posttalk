import { createGlobalStyle } from 'styled-components';

import gabarito from '@/assets/fonts/Gabarito.woff2';
import pretendard from '@/assets/fonts/PretendardVariable.woff2';
import { COLORS } from '@/constants/colors';
import { MAX_APP_WIDTH } from '@/constants/layout';

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
    line-height: 1.5;
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

  /* 전시 기기에서 스크롤바가 보이지 않게 한다 */
  * {
    scrollbar-width: none;
  }

  *::-webkit-scrollbar {
    display: none;
  }
`;

export default GlobalStyle;
