import { useEffect } from 'react';
import { ClipLoader } from 'react-spinners';
import { useLocation, useNavigate } from 'react-router-dom';

import popo from '@/assets/popo.svg';
import { FlowTitleStrong } from '@/components/common/FlowTitle';
import { COLORS } from '@/constants/colors';
import { Content, Description, LoaderArea, Page, Popo, Title } from '@/pages/Generating/Generating.styles';

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

export default Generating;
