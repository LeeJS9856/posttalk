import { useNavigate } from 'react-router-dom';

import popo from '@/assets/popo3.png';
import { FlowTitleStrong } from '@/components/common/FlowTitle';
import PrimaryActionButton from '@/components/common/PrimaryActionButton';
import { ActionArea, Content, Description, Page, Popo, Title } from '@/pages/PublishRequested/PublishRequested.styles';

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

export default PublishRequested;
