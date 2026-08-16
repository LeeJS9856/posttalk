import { useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { getServerHealth } from '@/apis/server';
import { uploadAsset } from '@/apis/upload';
import popo from '@/assets/popo.svg';
import { FlowTitleStrong } from '@/components/common/FlowTitle';
import PrimaryActionButton from '@/components/common/PrimaryActionButton';
import PageHeader from '@/components/layout/PageHeader';
import { TEMP_QR_USER_SESSION } from '@/constants/user';
import { ActionArea, CameraInput, Content, EmptyPhoto, GuideCopy, Page, PhotoPreview, Popo, RetakeButton, UploadMessage } from '@/pages/CaptureResult/CaptureResult.styles';

type CaptureResultLocationState = {
  photo?: File;
  photoUrl?: string;
};

const CaptureResult = (): React.JSX.Element => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const initialState = state as CaptureResultLocationState | null;
  const [photo, setPhoto] = useState<File | null>(initialState?.photo ?? null);
  const initialPhotoUrl = initialState?.photoUrl ?? null;
  const [photoUrl, setPhotoUrl] = useState<string | null>(initialPhotoUrl);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const [nextPhoto] = Array.from(event.target.files ?? []);
    if (nextPhoto) {
      setPhoto(nextPhoto);
      setPhotoUrl(URL.createObjectURL(nextPhoto));
      setUploadError(null);
    }
  };

  const handleConfirm = async (): Promise<void> => {
    if (!photo) {
      setUploadError('업로드할 사진을 먼저 촬영해 주세요.');
      return;
    }

    setIsUploading(true);
    setUploadError(null);

    try {
      await getServerHealth();
      const response = await uploadAsset({
        assetType: 'food_photo',
        file: photo,
        storeId: TEMP_QR_USER_SESSION.storeId,
      });

      navigate('/create/generating', {
        state: { photoUrl, uploadedAsset: response.data },
      });
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : '파일을 업로드하지 못했어요. 다시 시도해 주세요.');
    } finally {
      setIsUploading(false);
    }
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
        {uploadError && <UploadMessage role="alert">{uploadError}</UploadMessage>}
      </Content>
      <ActionArea>
        <RetakeButton type="button" onClick={() => fileInputRef.current?.click()} disabled={isUploading}>
          다시 촬영
        </RetakeButton>
        <PrimaryActionButton type="button" onClick={() => void handleConfirm()} disabled={isUploading}>
          {isUploading ? '업로드 중...' : '확인'}
        </PrimaryActionButton>
      </ActionArea>
      <CameraInput ref={fileInputRef} type="file" accept="image/*" capture="environment" onChange={handlePhotoChange} />
    </Page>
  );
};

export default CaptureResult;
