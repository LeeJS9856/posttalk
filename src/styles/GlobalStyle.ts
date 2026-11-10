import { createGlobalStyle } from 'styled-components';

import { COLORS } from '@/constants/colors';

// 폰트 파일은 src/assets/fonts/ 에 두고 아래에서 import 해 @font-face 로 정의한다.
// 예) import Pretendard from '@/assets/fonts/Pretendard.woff2';

const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    /* 폰트 파일 수급 전까지는 시스템 스택을 쓴다. 확정되면 @font-face 로 교체한다. */
    font-family: 'Pretendard', system-ui, -apple-system, 'Apple SD Gothic Neo',
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
