import styled from 'styled-components';

import { COLORS } from '@/constants/colors';
import { FONT_SIZE } from '@/constants/typography';

export const FlowTitle = styled.h1`
  color: ${COLORS.black700};
  font-size: ${FONT_SIZE.titleLarge};
  font-weight: 400;
  line-height: 1.55;
`;

export const FlowTitleStrong = styled.strong`
  color: ${COLORS.primary700};
  font-size: ${FONT_SIZE.titleEmphasis};
  font-weight: 700;
`;

export const FlowSubtitle = styled.p`
  color: ${COLORS.black500};
  font-size: ${FONT_SIZE.bodyLarge};
  font-weight: 400;
  line-height: 1.45;
`;
