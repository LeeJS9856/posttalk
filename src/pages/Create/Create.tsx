import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import PrimaryActionButton from '@/components/common/PrimaryActionButton';
import SegmentedToggle from '@/components/common/SegmentedToggle';
import PhotoPreviewCarousel from '@/components/create/PhotoPreviewCarousel';
import VideoPreview from '@/components/create/VideoPreview';
import BottomNavigation from '@/components/layout/BottomNavigation';
import PageFrame from '@/components/layout/PageFrame';
import { COLORS } from '@/constants/colors';
import { AD_FORMAT_OPTIONS, PHOTO_PREVIEW_IMAGES, VIDEO_PREVIEW_SOURCE, type AdFormat } from '@/constants/create';

const Create = (): React.JSX.Element => {
  const [selectedFormat, setSelectedFormat] = useState<AdFormat>('photo');
  const navigate = useNavigate();

  return (
    <Page aria-label="광고 제작 페이지">
      <TopContent>
        <Title>
          어떤 광고를 만들어볼까요?
          <br />
          원하는 방식을 골라주세요.
        </Title>
        <SegmentedToggle
          ariaLabel="광고 형식 선택"
          options={AD_FORMAT_OPTIONS}
          value={selectedFormat}
          onChange={setSelectedFormat}
        />
      </TopContent>

      {selectedFormat === 'photo' ? (
        <PhotoPreviewCarousel images={PHOTO_PREVIEW_IMAGES} />
      ) : (
        <VideoPreview videoSrc={VIDEO_PREVIEW_SOURCE} />
      )}

      <Guide>
        <GuideTitle>{selectedFormat === 'photo' ? '사진과 글로 한눈에 보여줘요.' : '영상으로 생생하게 보여줘요.'}</GuideTitle>
        <GuideDescription>
          {selectedFormat === 'photo' ? '여러 장으로 보기 쉽게 정리해드려요.' : '짧은 영상으로 가게의 매력을 알려드려요.'}
        </GuideDescription>
        <ActionArea>
          <PrimaryActionButton type="button" onClick={() => navigate('/create/capture')}>
            선택하기
          </PrimaryActionButton>
        </ActionArea>
      </Guide>

      <BottomNavigation />
    </Page>
  );
};

const Page = styled(PageFrame)`
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100svh;
  padding-bottom: 96px;
  overflow: hidden;
  background: ${COLORS.background.main};
`;

const TopContent = styled.header`
  flex: 0 0 auto;
  padding: 30px 24px 20px;
`;

const Title = styled.h1`
  color: ${COLORS.black700};
  font-size: 23px;
  font-weight: 700;
  line-height: 1.42;
  letter-spacing: -0.55px;
`;

const Guide = styled.section`
  display: flex;
  flex: 1;
  flex-direction: column;
  padding: 16px 24px 16px;
  text-align: center;
`;

const GuideTitle = styled.h2`
  color: ${COLORS.black700};
  font-size: 19px;
  font-weight: 700;
  line-height: 1.45;
`;

const GuideDescription = styled.p`
  margin-top: 2px;
  color: ${COLORS.black500};
  font-size: 18px;
  font-weight: 400;
  line-height: 1.45;
`;

const ActionArea = styled.div`
  margin-top: auto;
`;

export default Create;
