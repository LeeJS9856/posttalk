import styled from 'styled-components';

import Button from '@/components/common/Button';
import { COLORS } from '@/constants/colors';
import { FONT_SIZE } from '@/constants/typography';

const PrimaryActionButton = styled(Button)`
  width: 100%;
  border-radius: 10px;
  padding: 16px 20px;
  color: ${COLORS.white};
  background: ${COLORS.primary700};
  box-shadow: 0 3px 8px rgba(33, 33, 33, 0.18);
  font-size: ${FONT_SIZE.bodyLarge};
  font-weight: 700;
  line-height: 1.2;

  &:hover {
    background: ${COLORS.primary700};
  }
`;

export default PrimaryActionButton;
