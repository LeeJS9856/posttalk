import styled from 'styled-components';

import { COLORS } from '@/constants/colors';
import { FONT_SIZE } from '@/constants/typography';

type FloatingCreateButtonProps = { onClick: () => void };

const FloatingCreateButton = ({ onClick }: FloatingCreateButtonProps): React.JSX.Element => (
  <CreateButton type="button" onClick={onClick}>
    <Plus aria-hidden="true">+</Plus>
    <Label>새 광고 만들기</Label>
  </CreateButton>
);

const CreateButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  width: min(260px, calc(100% - 48px));
  height: 64px;
  border: 0;
  border-radius: 32px;
  color: ${COLORS.white};
  background: ${COLORS.primary700};
  box-shadow: 0 8px 18px rgba(33, 33, 33, 0.22);
  font-size: ${FONT_SIZE.bodyLarge};
  font-weight: 700;
`;

const Plus = styled.span`
  font-size: 32px;
  font-weight: 400;
  line-height: 1;
`;

const Label = styled.span`
  display: flex;
  align-items: center;
  line-height: 1;
`;

export default FloatingCreateButton;
