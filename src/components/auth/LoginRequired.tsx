import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import popo from '@/assets/popo.svg';
import PrimaryActionButton from '@/components/common/PrimaryActionButton';
import PageFrame from '@/components/layout/PageFrame';
import { COLORS } from '@/constants/colors';
import { FONT_SIZE } from '@/constants/typography';

const LoginRequired = (): React.JSX.Element => {
  const navigate = useNavigate();
  const location = useLocation();

  const goToLogin = (): void => {
    navigate('/login', {
      replace: true,
      state: { from: `${location.pathname}${location.search}` },
    });
  };

  return (
    <Page aria-label="로그인 필요 안내">
      <Content>
        <Logo src={popo} alt="" />
        <Title>로그인하셔야 이용 가능한 서비스입니다.</Title>
        <Description>로그인 후 광고를 만들고 내 광고를 관리해보세요.</Description>
      </Content>
      <ActionArea>
        <PrimaryActionButton type="button" onClick={goToLogin}>로그인</PrimaryActionButton>
      </ActionArea>
    </Page>
  );
};

const Page = styled(PageFrame)`
  display: flex;
  min-height: 100svh;
  flex-direction: column;
  padding: 24px;
  background: ${COLORS.background.main};
`;

const Content = styled.section`
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-bottom: 96px;
  text-align: center;
`;

const Logo = styled.img`
  width: 76px;
  height: 76px;
  margin-bottom: 24px;
`;

const Title = styled.h1`
  color: ${COLORS.black700};
  font-size: ${FONT_SIZE.titleEmphasis};
  font-weight: 700;
  line-height: 1.45;
  letter-spacing: -0.6px;
`;

const Description = styled.p`
  margin-top: 10px;
  color: ${COLORS.black500};
  font-size: ${FONT_SIZE.body};
`;

const ActionArea = styled.div`
  width: 100%;
`;

export default LoginRequired;
