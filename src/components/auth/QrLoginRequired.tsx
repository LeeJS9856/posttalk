import styled from 'styled-components';

import { COLORS } from '@/constants/colors';
import { FONT_SIZE } from '@/constants/typography';

const Notice = styled.section`
  display: flex;
  min-height: 250px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 14px;
  padding: 32px 24px;
  text-align: center;
`;

const WarningIcon = styled.span`
  display: grid;
  width: 44px;
  height: 44px;
  place-items: center;
  border: 2px solid ${COLORS.black400};
  border-radius: 50%;
  color: ${COLORS.black400};
  font-size: 27px;
  font-weight: 700;
  line-height: 1;
`;

const Message = styled.p`
  color: ${COLORS.black500};
  font-size: ${FONT_SIZE.bodyLarge};
  font-weight: 600;
`;

const QrLoginRequired = (): React.JSX.Element => (
  <Notice role="status">
    <WarningIcon aria-hidden="true">!</WarningIcon>
    <Message>QR로그인이 필요한 서비스 입니다</Message>
  </Notice>
);

export default QrLoginRequired;
