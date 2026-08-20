import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import popo from '@/assets/popo.svg';
import { submitAdSessionVideo } from '@/apis/adSessions';
import { uploadAsset } from '@/apis/creation';
import { FlowTitleStrong } from '@/components/common/FlowTitle';
import PrimaryActionButton from '@/components/common/PrimaryActionButton';
import PageHeader from '@/components/layout/PageHeader';
import { getVideoCaptureSteps } from '@/constants/videoCapture';
import { useAdDraft } from '@/hooks/useAdDraft';
import { useMerchantSession } from '@/hooks/useMerchantSession';
import { ActionArea, Content, EmptyVideo, ErrorMessage, GuideCopy, Page, PreviewVideo, Popo, RetakeButton } from '@/pages/VideoCaptureResult/VideoCaptureResult.styles';

const VideoCaptureResult = (): React.JSX.Element => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { draft, setCurrentRequest, setGeneration, setRetryMessage } = useAdDraft();
  const { session } = useMerchantSession();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const steps = getVideoCaptureSteps(draft.answers.menuIntro?.trim() || '대표 메뉴');
  const stepIndex = Math.min(Math.max(Number(searchParams.get('step')) || 0, 0), steps.length - 1);
  const clip = draft.videoClips.find((item) => item.stepIndex === stepIndex);
  const requestTarget = draft.currentRequest?.prompt.trim() || steps[stepIndex].title;

  const next = async (): Promise<void> => {
    if (!clip || !session || !draft.sessionId) {
      setErrorMessage('영상 검수에 필요한 정보가 없어요. 다시 촬영해주세요.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);
    try {
      const asset = await uploadAsset({
        assetType: draft.currentRequest?.assetType ?? 'video',
        file: clip.file,
        session,
      });
      const response = await submitAdSessionVideo({
        sessionId: draft.sessionId,
        asset,
        durationSeconds: clip.duration,
      });

      if (response.data.response === 'fail') {
        setRetryMessage(response.data.retryMessage ?? '영상 길이가 짧아요. 2초 이상 다시 촬영해주세요.');
        navigate(`/create/video-capture?step=${stepIndex}`, { replace: true });
        return;
      }

      if (response.data.status === 'collecting' && response.data.request) {
        setCurrentRequest(response.data.request);
        navigate(`/create/video-capture?step=${stepIndex + 1}`, { replace: true });
        return;
      }

      if (response.data.status === 'generating' || response.data.state === '끝') {
        if (response.data.generationJobId && response.data.submissionId) {
          setGeneration({ jobId: response.data.generationJobId, submissionId: response.data.submissionId });
        }
        navigate('/create/generating', { replace: true });
        return;
      }

      throw new Error('다음 영상 촬영 요청을 받지 못했어요. 다시 시도해주세요.');
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        setErrorMessage('영상 업로드에 연결하지 못했어요. 10MB 이하의 MP4 또는 WebM 영상인지 확인한 뒤 다시 시도해주세요.');
      } else {
        setErrorMessage(error instanceof Error ? error.message : '영상 검수에 실패했어요. 다시 시도해주세요.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Page aria-label="촬영 영상 확인">
      <PageHeader title="영상 광고 제작" onBack={() => navigate(`/create/video-capture?step=${stepIndex}`)} />
      <Content>
        <Popo src={popo} alt="" />
        <GuideCopy><FlowTitleStrong>{requestTarget}</FlowTitleStrong> 영상을<br />이걸로 하실래요?</GuideCopy>
        {clip ? <PreviewVideo src={clip.previewUrl} controls playsInline /> : <EmptyVideo>촬영한 영상이 없어요.</EmptyVideo>}
        {errorMessage && <ErrorMessage role="alert">{errorMessage}</ErrorMessage>}
      </Content>
      <ActionArea>
        <RetakeButton type="button" onClick={() => navigate(`/create/video-capture?step=${stepIndex}`)}>다시 촬영</RetakeButton>
        <PrimaryActionButton type="button" onClick={() => void next()} disabled={!clip || isSubmitting}>{isSubmitting ? '영상 확인 중...' : '확인'}</PrimaryActionButton>
      </ActionArea>
    </Page>
  );
};

export default VideoCaptureResult;
