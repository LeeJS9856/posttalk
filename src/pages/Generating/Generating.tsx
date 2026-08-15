import { useEffect } from 'react';
import { ClipLoader } from 'react-spinners';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import popo from '@/assets/popo.svg';
import { FlowSubtitle, FlowTitle, FlowTitleStrong } from '@/components/common/FlowTitle';
import PageFrame from '@/components/layout/PageFrame';
import { COLORS } from '@/constants/colors';

const Generating = (): React.JSX.Element => (
  <GeneratingContent />
);

type GenerationLocationState = { photoUrl?: string | null };

const GeneratingContent = (): React.JSX.Element => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const photoUrl = (state as GenerationLocationState | null)?.photoUrl ?? null;

  useEffect(() => {
    const timer = window.setTimeout(() => {
      navigate('/create/complete', { replace: true, state: { photoUrl } });
    }, 3000);

    return () => window.clearTimeout(timer);
  }, [navigate, photoUrl]);

  return (
    <Page aria-label="광고 생성 중" aria-busy="true">
      <Content>
        <Popo src={popo} alt="" />
        <Title>
          <FlowTitleStrong>광고</FlowTitleStrong>를 만들고 있어요
        </Title>
        <Description>조금만 기다려 주세요</Description>
        <LoaderArea aria-label="광고 생성 중입니다">
          <ClipLoader color={COLORS.primary} size={30} speedMultiplier={0.8} />
        </LoaderArea>
      </Content>
    </Page>
  );
};

const Page = styled(PageFrame)`
  display: flex;
  min-height: 100svh;
  flex-direction: column;
  background: ${COLORS.background.main};
`;

const Content = styled.main`
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  padding: clamp(92px, 19svh, 154px) 24px 0;
  text-align: center;
`;

const Popo = styled.img`
  width: 57px;
  height: 54px;
`;

const Title = styled(FlowTitle)`
  margin-top: 18px;
`;

const Description = styled(FlowSubtitle)`
  margin-top: 2px;
`;

const LoaderArea = styled.div`
  display: grid;
  margin-top: 46px;
  place-items: center;
`;

export default Generating;
