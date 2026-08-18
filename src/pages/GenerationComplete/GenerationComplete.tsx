import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import popo from '@/assets/popo2.png';
import { requestPublish } from '@/apis/creation';
import { FlowTitleStrong } from '@/components/common/FlowTitle';
import PrimaryActionButton from '@/components/common/PrimaryActionButton';
import PhotoPreviewCarousel from '@/components/create/PhotoPreviewCarousel';
import VideoPreview from '@/components/create/VideoPreview';
import { PHOTO_PREVIEW_IMAGES } from '@/constants/create';
import { useAdDraft } from '@/hooks/useAdDraft';
import { ActionArea, Description, Feedback, FeedbackArea, Page, Popo, RemakeButton, Title, TitleArea } from '@/pages/GenerationComplete/GenerationComplete.styles';

const GenerationComplete = (): React.JSX.Element => {
  const navigate = useNavigate();
  const { draft } = useAdDraft();
  const previewImages = draft.generatedResultUrl ? [draft.generatedResultUrl] : PHOTO_PREVIEW_IMAGES;
  const [isRequesting, setIsRequesting] = useState(false);
  const [requestError, setRequestError] = useState<string | null>(null);
  const handleRemake = (): void => {
    const shouldRemake = window.confirm('기존 만들었던 광고가 초기화 됩니다. 다시 만들겠습니까?');
    if (shouldRemake) navigate('/create');
  };

  const handlePublishRequest = async (): Promise<void> => {
    if (!draft.submissionId) {
      setRequestError('게시 요청 정보가 없어요. 광고를 다시 만들어주세요.');
      return;
    }

    setIsRequesting(true);
    setRequestError(null);
    try {
      await requestPublish({ format: draft.format, submissionId: draft.submissionId });
      navigate('/create/requested');
    } catch (error) {
      setRequestError(error instanceof Error ? error.message : '게시 요청 중 문제가 발생했어요.');
      setIsRequesting(false);
    }
  };

  return (
    <Page aria-label="광고 생성 완료">
      <TitleArea>
        <Title>
          광고가 <FlowTitleStrong>완성</FlowTitleStrong>됐어요
        </Title>
        <Description>좌우로 넘겨 내용을 확인해보세요</Description>
      </TitleArea>

      {draft.format === 'video' && draft.generatedResultUrl ? (
        <VideoPreview videoSrc={draft.generatedResultUrl} />
      ) : (
        <PhotoPreviewCarousel images={previewImages} />
      )}

      <FeedbackArea>
        <Feedback>{requestError ?? '상품이 눈에 잘 띄도록 사진을 크게 쓰고, 가게 이름은 위쪽에 넣었어요!'}</Feedback>
        <Popo src={popo} alt="" />
      </FeedbackArea>

      <ActionArea>
        <RemakeButton type="button" onClick={handleRemake}>
          다시 만들기
        </RemakeButton>
        <PrimaryActionButton type="button" onClick={() => void handlePublishRequest()} disabled={isRequesting}>
          {isRequesting ? '요청 중...' : '게시 요청'}
        </PrimaryActionButton>
      </ActionArea>
    </Page>
  );
};

export default GenerationComplete;
