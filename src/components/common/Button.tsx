import styled from 'styled-components';

import { COLORS } from '@/constants/colors';

const Button = styled.button`
  border: 0;
  border-radius: 14px;
  padding: 13px 20px;
  color: ${COLORS.white};
  background: ${COLORS.primary};
  font-weight: 700;
  transition:
    background 0.2s ease,
    transform 0.2s ease;

  &:hover {
    background: ${COLORS.primary700};
    transform: translateY(-1px);
  }
  &:focus-visible {
    outline: 3px solid ${COLORS.primary200};
    outline-offset: 2px;
  }
`;

export default Button;
