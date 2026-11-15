import { css, keyframes } from 'styled-components';

import { COLORS } from '@/constants/colors';

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.45; }
`;

/**
 * 불러오는 동안 자리를 잡아 두는 회색 블록. 실제 내용과 같은 크기로 그려
 * 다 불러온 뒤에도 화면이 밀리지 않게 한다. 움직임은 opacity 만 쓴다.
 */
export const skeleton = css`
  background-color: ${COLORS.background.subtle};
  animation: ${pulse} 1.4s ease-in-out infinite;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;
