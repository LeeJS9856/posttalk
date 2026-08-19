import { useNavigate, useSearchParams } from 'react-router-dom';

import popo from '@/assets/popo.svg';
import { FlowTitleStrong } from '@/components/common/FlowTitle';
import PrimaryActionButton from '@/components/common/PrimaryActionButton';
import PageHeader from '@/components/layout/PageHeader';
import { getVideoCaptureSteps } from '@/constants/videoCapture';
import { useAdDraft } from '@/hooks/useAdDraft';
import { ActionArea, Content, EmptyVideo, GuideCopy, Page, PreviewVideo, Popo, RetakeButton } from '@/pages/VideoCaptureResult/VideoCaptureResult.styles';

const VideoCaptureResult = (): React.JSX.Element => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { draft } = useAdDraft();
  const steps = getVideoCaptureSteps(draft.answers.menuIntro?.trim() || '대표 메뉴');
  const stepIndex = Math.min(Math.max(Number(searchParams.get('step')) || 0, 0), steps.length - 1);
  const clip = draft.videoClips.find((item) => item.stepIndex === stepIndex);

  const next = (): void => {
    if (!clip) return;
    navigate(stepIndex === steps.length - 1 ? '/create/video-capture/complete' : `/create/video-capture?step=${stepIndex + 1}`);
  };

  return (
    <Page aria-label="촬영 영상 확인">
      <PageHeader title="영상 광고 제작" onBack={() => navigate(`/create/video-capture?step=${stepIndex}`)} />
      <Content>
        <Popo src={popo} alt="" />
        <GuideCopy><FlowTitleStrong>{steps[stepIndex].title}</FlowTitleStrong> 영상을<br />이걸로 하실래요?</GuideCopy>
        {clip ? <PreviewVideo src={clip.previewUrl} controls playsInline /> : <EmptyVideo>촬영한 영상이 없어요.</EmptyVideo>}
      </Content>
      <ActionArea>
        <RetakeButton type="button" onClick={() => navigate(`/create/video-capture?step=${stepIndex}`)}>다시 촬영</RetakeButton>
        <PrimaryActionButton type="button" onClick={next} disabled={!clip}>확인</PrimaryActionButton>
      </ActionArea>
    </Page>
  );
};

export default VideoCaptureResult;
