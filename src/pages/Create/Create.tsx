import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import PrimaryActionButton from '@/components/common/PrimaryActionButton';
import SegmentedToggle from '@/components/common/SegmentedToggle';
import PhotoPreviewCarousel from '@/components/create/PhotoPreviewCarousel';
import VideoPreview from '@/components/create/VideoPreview';
import BottomNavigation from '@/components/layout/BottomNavigation';
import { AD_FORMAT_OPTIONS, PHOTO_PREVIEW_IMAGES, VIDEO_PREVIEW_SOURCE, type AdFormat } from '@/constants/create';
import { ActionArea, Guide, GuideDescription, GuideTitle, Page, Title, TopContent } from '@/pages/Create/Create.styles';

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

export default Create;
