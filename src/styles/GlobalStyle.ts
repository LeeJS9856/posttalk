import { createGlobalStyle } from 'styled-components';

import { COLORS } from '@/constants/colors';

const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;700&display=swap');

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    font-family: 'Noto Sans KR', sans-serif;
  }

  html, body, #root {
    min-width: 320px;
    min-height: 100%;
  }

  body {
    color: ${COLORS.black700};
    background: ${COLORS.background.main};
    -webkit-font-smoothing: antialiased;
  }

  button, input, textarea { font: inherit; }
  button { cursor: pointer; }
`;

export default GlobalStyle;
