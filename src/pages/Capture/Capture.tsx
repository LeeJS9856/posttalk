import { useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import foodExampleImage from '@/assets/food.webp';
import menuExampleImage from '@/assets/menu.png';
import popo from '@/assets/popo.svg';
import { FlowTitleStrong } from '@/components/common/FlowTitle';
import PrimaryActionButton from '@/components/common/PrimaryActionButton';
import PageHeader from '@/components/layout/PageHeader';
import { useAdDraft } from '@/hooks/useAdDraft';
import { ActionArea, CameraInput, ExampleImage, Guide, GuideCopy, Page, Popo } from '@/pages/Capture/Capture.styles';

const Capture = (): React.JSX.Element => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { setAsset } = useAdDraft();
  const assetType = searchParams.get('asset') === 'food_photo' ? 'food_photo' : 'menu_board';
  const isMenuBoard = assetType === 'menu_board';

  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const [photo] = Array.from(event.target.files ?? []);
    if (!photo) return;

    setAsset(assetType, photo);
    navigate(`/create/capture/result?asset=${assetType}`);
  };

  return (
    <Page aria-label="광고 사진 촬영 안내">
      <PageHeader title="광고 제작" onBack={() => navigate(isMenuBoard ? '/create' : '/create/capture/result?asset=menu_board')} />

      <Guide>
        <Popo src={popo} alt="" />
        <GuideCopy>
          아래 사진과 같이
          <br />
          <FlowTitleStrong>{isMenuBoard ? '메뉴판' : '주력 메뉴'}</FlowTitleStrong>을 찍어주세요
        </GuideCopy>
        <ExampleImage src={isMenuBoard ? menuExampleImage : foodExampleImage} alt={isMenuBoard ? '메뉴판 촬영 예시' : '음식 사진 촬영 예시'} />
      </Guide>

      <ActionArea>
        <PrimaryActionButton type="button" onClick={() => fileInputRef.current?.click()}>
          촬영하기
        </PrimaryActionButton>
      </ActionArea>
      <CameraInput ref={fileInputRef} type="file" accept="image/*" capture="environment" onChange={handlePhotoChange} />
    </Page>
  );
};

export default Capture;
