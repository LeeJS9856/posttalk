import { useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import popo from '@/assets/popo.svg';
import Button from '@/components/common/Button';
import { FlowTitle, FlowTitleStrong } from '@/components/common/FlowTitle';
import PrimaryActionButton from '@/components/common/PrimaryActionButton';
import PageFrame from '@/components/layout/PageFrame';
import PageHeader from '@/components/layout/PageHeader';
import { COLORS } from '@/constants/colors';
import { FONT_SIZE } from '@/constants/typography';

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

const Page = styled(PageFrame)`
  display: flex;
  flex-direction: column;
  padding-bottom: 24px;
  background: ${COLORS.background.main};
`;

const Content = styled.section`
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  padding: clamp(56px, 12svh, 104px) 24px 0;
  text-align: center;
`;

const Popo = styled.img`
  width: 57px;
  height: 54px;
`;

const GuideCopy = styled(FlowTitle)`
  margin-top: 20px;
`;

const PhotoPreview = styled.img`
  width: 100%;
  aspect-ratio: 1.2;
  margin-top: 16px;
  object-fit: cover;
`;

const EmptyPhoto = styled.p`
  display: grid;
  width: 100%;
  aspect-ratio: 1.2;
  margin-top: 16px;
  place-items: center;
  color: ${COLORS.black500};
  background: ${COLORS.primary100};
  font-size: ${FONT_SIZE.bodyLarge};
`;

const ActionArea = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 8px;
  margin: auto 24px 0;
`;

const RetakeButton = styled(Button)`
  border: 1px solid ${COLORS.black400};
  border-radius: 10px;
  padding: 16px 10px;
  color: ${COLORS.black500};
  background: ${COLORS.white};
  box-shadow: 0 2px 5px rgba(33, 33, 33, 0.12);
  font-size: ${FONT_SIZE.bodyLarge};
  font-weight: 700;

  &:hover {
    background: ${COLORS.white};
  }
`;

const CameraInput = styled.input`
  display: none;
`;

export default CaptureResult;
