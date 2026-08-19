import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

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

const LoginButton = styled.button`
  border: 2px solid ${COLORS.black400};
  border-radius: 12px;
  padding: 11px 28px;
  color: ${COLORS.black500};
  background: transparent;
  font-size: ${FONT_SIZE.body};
  font-weight: 700;
`;

const QrLoginRequired = (): React.JSX.Element => {
  const navigate = useNavigate();

  return (
    <Notice role="status">
      <WarningIcon aria-hidden="true">!</WarningIcon>
      <Message>QR로그인이 필요한 서비스 입니다</Message>
      <LoginButton type="button" onClick={() => navigate('/qr-login')}>로그인</LoginButton>
    </Notice>
  );
};

export default QrLoginRequired;
