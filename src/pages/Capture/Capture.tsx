import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import popo from '@/assets/popo.svg';
import PrimaryActionButton from '@/components/common/PrimaryActionButton';
import PageHeader from '@/components/layout/PageHeader';
import PageFrame from '@/components/layout/PageFrame';
import { COLORS } from '@/constants/colors';

const MENU_EXAMPLE_IMAGE =
  'https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=960&q=85';

const Capture = (): React.JSX.Element => {
  const navigate = useNavigate();

  return (
    <Page aria-label="광고 사진 촬영 안내">
      <PageHeader title="광고 제작" onBack={() => navigate('/create')} />

      <Guide>
        <Popo src={popo} alt="" />
        <GuideCopy>
          아래 사진과 같이
          <br />
          <GuideStrong>메뉴판</GuideStrong>을 찍어주세요
        </GuideCopy>
        <ExampleImage src={MENU_EXAMPLE_IMAGE} alt="메뉴판 촬영 예시" />
      </Guide>

      <ActionArea>
        <PrimaryActionButton type="button">촬영하기</PrimaryActionButton>
      </ActionArea>
    </Page>
  );
};

const Page = styled(PageFrame)`
  position: relative;
  display: flex;
  flex-direction: column;
  padding-bottom: 24px;
  background: ${COLORS.background.main};
`;

const Guide = styled.section`
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  padding: clamp(56px, 12svh, 104px) 24px 0;
  text-align: center;
`;

const Popo = styled.img`
  width: 57px;
  height: 54px;
`;

const GuideCopy = styled.p`
  margin-top: 20px;
  color: ${COLORS.black700};
  font-size: 29px;
  font-weight: 400;
  line-height: 1.55;
`;

const GuideStrong = styled.strong`
  color: ${COLORS.primary700};
  font-size: 33px;
  font-weight: 700;
`;

const ExampleImage = styled.img`
  width: 100%;
  aspect-ratio: 1.2;
  margin-top: 16px;
  object-fit: cover;
`;

const ActionArea = styled.div`
  margin: auto 24px 0;
`;

export default Capture;
