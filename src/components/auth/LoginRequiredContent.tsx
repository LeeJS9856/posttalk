import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import { COLORS } from '@/constants/colors';
import { FONT_SIZE } from '@/constants/typography';

const LoginRequiredContent = (): React.JSX.Element => {
  const navigate = useNavigate();
  const location = useLocation();

  const goToLogin = (): void => {
    navigate('/login', {
      state: { from: `${location.pathname}${location.search}` },
    });
  };

  return (
    <Prompt>
      <WarningIcon aria-hidden="true">!</WarningIcon>
      <Message>로그인이 필요한 서비스입니다</Message>
      <LoginButton type="button" onClick={goToLogin}>로그인</LoginButton>
    </Prompt>
  );
};

const Prompt = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 64px 24px;
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
  font-size: ${FONT_SIZE.titleLarge};
  font-weight: 700;
`;

const Message = styled.p`
  margin-top: 14px;
  color: ${COLORS.black500};
  font-size: ${FONT_SIZE.bodyLarge};
  font-weight: 700;
`;

const LoginButton = styled.button`
  margin-top: 22px;
  border: 2px solid ${COLORS.black400};
  border-radius: 12px;
  padding: 10px 34px;
  color: ${COLORS.black500};
  background: transparent;
  font-size: ${FONT_SIZE.body};
  font-weight: 700;
`;

export default LoginRequiredContent;
