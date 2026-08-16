import { useLocation, useNavigate } from 'react-router-dom';

import popo from '@/assets/popo2.png';
import { FlowTitleStrong } from '@/components/common/FlowTitle';
import PrimaryActionButton from '@/components/common/PrimaryActionButton';
import PhotoPreviewCarousel from '@/components/create/PhotoPreviewCarousel';
import { PHOTO_PREVIEW_IMAGES } from '@/constants/create';
import { ActionArea, Description, Feedback, FeedbackArea, Page, Popo, RemakeButton, Title, TitleArea } from '@/pages/GenerationComplete/GenerationComplete.styles';

type GenerationCompleteLocationState = { photoUrl?: string | null };

const GenerationComplete = (): React.JSX.Element => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const photoUrl = (state as GenerationCompleteLocationState | null)?.photoUrl ?? null;
  const previewImages = photoUrl ? [photoUrl, ...PHOTO_PREVIEW_IMAGES] : PHOTO_PREVIEW_IMAGES;
  const handleRemake = (): void => {
    const shouldRemake = window.confirm('기존 만들었던 광고가 초기화 됩니다. 다시 만들겠습니까?');
    if (shouldRemake) navigate('/create');
  };

  return (
    <Page aria-label="광고 생성 완료">
      <TitleArea>
        <Title>
          광고가 <FlowTitleStrong>완성</FlowTitleStrong>됐어요
        </Title>
        <Description>좌우로 넘겨 내용을 확인해보세요</Description>
      </TitleArea>

      <PhotoPreviewCarousel images={previewImages} />

      <FeedbackArea>
        <Feedback>상품이 눈에 잘 띄도록 사진을 크게 쓰고, 가게 이름은 위쪽에 넣었어요!</Feedback>
        <Popo src={popo} alt="" />
      </FeedbackArea>

      <ActionArea>
        <RemakeButton type="button" onClick={handleRemake}>
          다시 만들기
        </RemakeButton>
        <PrimaryActionButton type="button" onClick={() => navigate('/create/requested')}>
          게시 요청
        </PrimaryActionButton>
      </ActionArea>
    </Page>
  );
};

export default GenerationComplete;
