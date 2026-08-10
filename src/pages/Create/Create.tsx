import { useState } from 'react';
import styled from 'styled-components';

import Button from '@/components/common/Button';
import SegmentedToggle, { type SegmentedToggleOption } from '@/components/common/SegmentedToggle';
import PhotoPreviewCarousel from '@/components/create/PhotoPreviewCarousel';
import VideoPreview from '@/components/create/VideoPreview';
import BottomNavigation from '@/components/layout/BottomNavigation';
import { COLORS } from '@/constants/colors';

type AdFormat = 'photo' | 'video';

const AD_FORMAT_OPTIONS: readonly SegmentedToggleOption<AdFormat>[] = [
  { label: '사진 광고', value: 'photo' },
  { label: '동영상 광고', value: 'video' },
];

const PHOTO_PREVIEW_IMAGES = [
  'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=960&q=85',
  'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=960&q=85',
  'https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=960&q=85',
  'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=960&q=85',
  'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=960&q=85',
] as const;

const Create = (): React.JSX.Element => {
  const [selectedFormat, setSelectedFormat] = useState<AdFormat>('photo');

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
        <VideoPreview videoSrc="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4" />
      )}

      <Guide>
        <GuideTitle>{selectedFormat === 'photo' ? '사진과 글로 한눈에 보여줘요.' : '영상으로 생생하게 보여줘요.'}</GuideTitle>
        <GuideDescription>
          {selectedFormat === 'photo' ? '여러 장으로 보기 쉽게 정리해드려요.' : '짧은 영상으로 가게의 매력을 알려드려요.'}
        </GuideDescription>
        <SelectButton type="button">선택하기</SelectButton>
      </Guide>

      <BottomNavigation />
    </Page>
  );
};

const Page = styled.main`
  position: relative;
  display: flex;
  flex-direction: column;
  width: min(100%, 480px);
  height: 100svh;
  min-height: 100svh;
  margin: 0 auto;
  padding-bottom: 96px;
  overflow: hidden;
  background: ${COLORS.white};
`;

const TopContent = styled.header`
  flex: 0 0 auto;
  padding: 66px 24px 32px;
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
  padding: 24px 24px 16px;
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

const SelectButton = styled(Button)`
  width: 100%;
  margin-top: auto;
  border: 0;
  border-radius: 10px;
  padding: 16px 20px;
  color: ${COLORS.white};
  background: ${COLORS.primary};
  box-shadow: 0 3px 8px rgba(33, 33, 33, 0.18);
  font-size: 20px;
  font-weight: 700;
  line-height: 1.2;
`;

export default Create;
