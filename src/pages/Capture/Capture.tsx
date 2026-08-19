import { useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import foodExampleImage from '@/assets/food.webp';
import menuExampleImage from '@/assets/menu.png';
import popo from '@/assets/popo.svg';
import { FlowTitleStrong } from '@/components/common/FlowTitle';
import PrimaryActionButton from '@/components/common/PrimaryActionButton';
import PageHeader from '@/components/layout/PageHeader';
import { useAdDraft } from '@/hooks/useAdDraft';
import {
  ActionArea,
  CameraInput,
  ChoiceButton,
  ExampleImage,
  Guide,
  GuideCopy,
  ModalBackdrop,
  ModalCancelButton,
  ModalContent,
  ModalDescription,
  ModalTitle,
  Page,
  Popo,
} from '@/pages/Capture/Capture.styles';

const Capture = (): React.JSX.Element => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const [isSourceModalOpen, setIsSourceModalOpen] = useState(false);
  const { setAsset } = useAdDraft();
  const assetType = searchParams.get('asset') === 'food_photo' ? 'food_photo' : 'menu_board';
  const isMenuBoard = assetType === 'menu_board';

  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const [photo] = Array.from(event.target.files ?? []);
    if (!photo) return;

    setAsset(assetType, photo);
    navigate(`/create/capture/result?asset=${assetType}`);
  };

  const openCamera = (): void => {
    setIsSourceModalOpen(false);
    cameraInputRef.current?.click();
  };

  const openGallery = (): void => {
    setIsSourceModalOpen(false);
    galleryInputRef.current?.click();
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
        <PrimaryActionButton type="button" onClick={() => setIsSourceModalOpen(true)}>
          촬영하기
        </PrimaryActionButton>
      </ActionArea>
      <CameraInput ref={cameraInputRef} type="file" accept="image/*" capture="environment" onChange={handlePhotoChange} />
      <CameraInput ref={galleryInputRef} type="file" accept="image/*" onChange={handlePhotoChange} />

      {isSourceModalOpen && (
        <ModalBackdrop role="presentation" onClick={() => setIsSourceModalOpen(false)}>
          <ModalContent role="dialog" aria-modal="true" aria-labelledby="photo-source-title" onClick={(event) => event.stopPropagation()}>
            <ModalTitle id="photo-source-title">사진을 가져올 방법을 선택해주세요</ModalTitle>
            <ModalDescription>카메라로 새 사진을 찍거나 앨범에 있는 사진을 선택할 수 있어요.</ModalDescription>
            <ChoiceButton type="button" onClick={openCamera}>카메라로 촬영</ChoiceButton>
            <ChoiceButton type="button" onClick={openGallery}>갤러리에서 선택</ChoiceButton>
            <ModalCancelButton type="button" onClick={() => setIsSourceModalOpen(false)}>취소</ModalCancelButton>
          </ModalContent>
        </ModalBackdrop>
      )}
    </Page>
  );
};

export default Capture;
