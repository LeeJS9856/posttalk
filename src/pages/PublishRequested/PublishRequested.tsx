import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import popo from '@/assets/popo3.png';
import { FlowSubtitle, FlowTitle, FlowTitleStrong } from '@/components/common/FlowTitle';
import PrimaryActionButton from '@/components/common/PrimaryActionButton';
import PageFrame from '@/components/layout/PageFrame';
import { COLORS } from '@/constants/colors';

const PublishRequested = (): React.JSX.Element => {
  const navigate = useNavigate();

  return (
    <Page aria-label="광고 게시 요청 완료">
      <Content>
        <Popo src={popo} alt="" />
        <Title>광고 게시 <FlowTitleStrong>요청</FlowTitleStrong>을 완료했어요</Title>
        <Description>관리자의 승인 이후 광고가 게시돼요</Description>
      </Content>
      <ActionArea>
        <PrimaryActionButton type="button" onClick={() => navigate('/')}>홈으로</PrimaryActionButton>
      </ActionArea>
    </Page>
  );
};

const Page = styled(PageFrame)`
  display: flex;
  min-height: 100svh;
  flex-direction: column;
  padding: 0 14px 14px;
  background: ${COLORS.background.main};
`;

const Content = styled.main`
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  padding-top: clamp(140px, 27svh, 216px);
  text-align: center;
`;

const Popo = styled.img`
  width: 135px;
  height: 179px;
  object-fit: contain;
`;

const Title = styled(FlowTitle)`
  margin-top: 22px;
`;

const Description = styled(FlowSubtitle)`
  margin-top: 4px;
`;

const ActionArea = styled.div`
  width: 100%;
`;

export default PublishRequested;
