import { useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import popo from '@/assets/popo.svg';
import { FlowTitleStrong } from '@/components/common/FlowTitle';
import PrimaryActionButton from '@/components/common/PrimaryActionButton';
import PageHeader from '@/components/layout/PageHeader';
import { useAdDraft } from '@/hooks/useAdDraft';
import { ActionArea, CameraInput, Content, EmptyPhoto, GuideCopy, Page, PhotoPreview, Popo, RetakeButton } from '@/pages/CaptureResult/CaptureResult.styles';

const CaptureResult = (): React.JSX.Element => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { draft, setAsset } = useAdDraft();
  const assetType = searchParams.get('asset') === 'food_photo' ? 'food_photo' : 'menu_board';
  const isMenuBoard = assetType === 'menu_board';
  const photoUrl = isMenuBoard ? draft.menuBoard?.previewUrl : draft.foodPhoto?.previewUrl;

  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const [photo] = Array.from(event.target.files ?? []);
    if (photo) setAsset(assetType, photo);
  };

  const goNext = (): void => {
    if (isMenuBoard) {
      navigate('/create/capture?asset=food_photo');
      return;
    }

    navigate('/create/questions/0');
  };

  return (
    <Page aria-label="촬영 사진 확인">
      <PageHeader title="광고 제작" onBack={() => navigate(`/create/capture?asset=${assetType}`)} />
      <Content>
        <Popo src={popo} alt="" />
        <GuideCopy>
          {isMenuBoard ? (
            <><FlowTitleStrong>메뉴판</FlowTitleStrong> 사진을</>
          ) : (
            <><FlowTitleStrong>주력 메뉴</FlowTitleStrong>의 사진을</>
          )}
          <br />
          이걸로 하실래요?
        </GuideCopy>
        {photoUrl ? <PhotoPreview src={photoUrl} alt="방금 촬영한 사진" /> : <EmptyPhoto>촬영한 사진이 없어요.</EmptyPhoto>}
      </Content>
      <ActionArea>
        <RetakeButton type="button" onClick={() => fileInputRef.current?.click()}>
          다시 촬영
        </RetakeButton>
        <PrimaryActionButton type="button" onClick={goNext} disabled={!photoUrl}>
          확인
        </PrimaryActionButton>
      </ActionArea>
      <CameraInput ref={fileInputRef} type="file" accept="image/*" capture="environment" onChange={handlePhotoChange} />
    </Page>
  );
};

export default CaptureResult;
