import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import popo from '@/assets/popo2.png';
import Button from '@/components/common/Button';
import { FlowSubtitle, FlowTitle, FlowTitleStrong } from '@/components/common/FlowTitle';
import PrimaryActionButton from '@/components/common/PrimaryActionButton';
import PhotoPreviewCarousel from '@/components/create/PhotoPreviewCarousel';
import PageFrame from '@/components/layout/PageFrame';
import { COLORS } from '@/constants/colors';
import { PHOTO_PREVIEW_IMAGES } from '@/constants/create';
import { FONT_SIZE } from '@/constants/typography';

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

const Page = styled(PageFrame)`
  display: flex;
  min-height: 100svh;
  flex-direction: column;
  overflow: hidden;
  background: ${COLORS.background.main};
`;

const TitleArea = styled.header`
  padding: 58px 24px 18px;
  text-align: center;
`;

const Title = styled(FlowTitle)``;

const Description = styled(FlowSubtitle)`
  margin-top: 2px;
`;

const FeedbackArea = styled.section`
  position: relative;
  display: flex;
  flex: 1;
  align-items: center;
  min-height: 108px;
  padding: 20px 24px;
`;

const Feedback = styled.p`
  width: calc(100% - 26px);
  padding: 10px 12px;
  border: 1px solid ${COLORS.black200};
  border-radius: 12px 12px 3px 12px;
  color: ${COLORS.black500};
  background: ${COLORS.white};
  box-shadow: 0 3px 8px rgba(33, 33, 33, 0.06);
  font-size: ${FONT_SIZE.body};
  line-height: 1.45;
`;

const Popo = styled.img`
  position: absolute;
  right: -4px;
  bottom: 0;
  width: 46px;
  height: 103px;
`;

const ActionArea = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 8px;
  padding: 0 14px 14px;
`;

const RemakeButton = styled(Button)`
  border: 1px solid ${COLORS.black400};
  border-radius: 10px;
  padding: 14px 10px;
  color: ${COLORS.black500};
  background: ${COLORS.white};
  box-shadow: 0 2px 5px rgba(33, 33, 33, 0.12);
  font-size: ${FONT_SIZE.body};
  font-weight: 700;

  &:hover {
    background: ${COLORS.white};
  }
`;

export default GenerationComplete;
