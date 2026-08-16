import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import popo from '@/assets/popo.svg';
import { FlowTitleStrong } from '@/components/common/FlowTitle';
import PrimaryActionButton from '@/components/common/PrimaryActionButton';
import PageHeader from '@/components/layout/PageHeader';
import { ActionArea, CameraInput, ExampleImage, Guide, GuideCopy, Page, Popo } from '@/pages/Capture/Capture.styles';

const MENU_EXAMPLE_IMAGE =
  'https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=960&q=85';

const Capture = (): React.JSX.Element => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const [photo] = Array.from(event.target.files ?? []);
    if (photo) navigate('/create/capture/result', { state: { photoUrl: URL.createObjectURL(photo) } });
  };

  return (
    <Page aria-label="광고 사진 촬영 안내">
      <PageHeader title="광고 제작" onBack={() => navigate('/create')} />

      <Guide>
        <Popo src={popo} alt="" />
        <GuideCopy>
          아래 사진과 같이
          <br />
          <FlowTitleStrong>메뉴판</FlowTitleStrong>을 찍어주세요
        </GuideCopy>
        <ExampleImage src={MENU_EXAMPLE_IMAGE} alt="메뉴판 촬영 예시" />
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
