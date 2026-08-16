import { useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import popo from '@/assets/popo.svg';
import { FlowTitleStrong } from '@/components/common/FlowTitle';
import PrimaryActionButton from '@/components/common/PrimaryActionButton';
import PageHeader from '@/components/layout/PageHeader';
import { ActionArea, CameraInput, Content, EmptyPhoto, GuideCopy, Page, PhotoPreview, Popo, RetakeButton } from '@/pages/CaptureResult/CaptureResult.styles';

type CaptureResultLocationState = {
  photoUrl?: string;
};

const CaptureResult = (): React.JSX.Element => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const initialPhotoUrl = (state as CaptureResultLocationState | null)?.photoUrl ?? null;
  const [photoUrl, setPhotoUrl] = useState<string | null>(initialPhotoUrl);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const [photo] = Array.from(event.target.files ?? []);
    if (photo) setPhotoUrl(URL.createObjectURL(photo));
  };

  return (
    <Page aria-label="촬영 사진 확인">
      <PageHeader title="광고 제작" onBack={() => navigate('/create/capture')} />
      <Content>
        <Popo src={popo} alt="" />
        <GuideCopy>
          <FlowTitleStrong>주력 메뉴</FlowTitleStrong>의 사진을
          <br />
          이걸로 하실래요?
        </GuideCopy>
        {photoUrl ? <PhotoPreview src={photoUrl} alt="방금 촬영한 사진" /> : <EmptyPhoto>촬영한 사진이 없어요.</EmptyPhoto>}
      </Content>
      <ActionArea>
        <RetakeButton type="button" onClick={() => fileInputRef.current?.click()}>
          다시 촬영
        </RetakeButton>
        <PrimaryActionButton type="button" onClick={() => navigate('/create/generating', { state: { photoUrl } })}>
          확인
        </PrimaryActionButton>
      </ActionArea>
      <CameraInput ref={fileInputRef} type="file" accept="image/*" capture="environment" onChange={handlePhotoChange} />
    </Page>
  );
};

export default CaptureResult;
