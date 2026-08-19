import { useNavigate } from 'react-router-dom';

import popo from '@/assets/popo2.png';
import { FlowTitleStrong } from '@/components/common/FlowTitle';
import PrimaryActionButton from '@/components/common/PrimaryActionButton';
import { useAdDraft } from '@/hooks/useAdDraft';
import { Content, Description, Page, Popo, Title } from '@/pages/Generating/Generating.styles';

const VideoCaptureComplete = (): React.JSX.Element => {
  const navigate = useNavigate();
  const { draft } = useAdDraft();

  return (
    <Page aria-label="영상 촬영 완료">
      <Content>
        <Popo src={popo} alt="" />
        <Title><FlowTitleStrong>{draft.videoClips.length}개 영상</FlowTitleStrong> 촬영을<br />완료했어요</Title>
        <Description>영상 광고 생성 결과 연결은 다음 단계에서 진행할게요.</Description>
        <PrimaryActionButton type="button" onClick={() => navigate('/create')} style={{ marginTop: 36 }}>광고 만들기로 돌아가기</PrimaryActionButton>
      </Content>
    </Page>
  );
};

export default VideoCaptureComplete;
