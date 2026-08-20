import { useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import popo from '@/assets/popo.svg';
import { submitAdSessionPhoto } from '@/apis/adSessions';
import { uploadAsset, type UploadAssetType } from '@/apis/creation';
import { FlowTitleStrong } from '@/components/common/FlowTitle';
import PrimaryActionButton from '@/components/common/PrimaryActionButton';
import PageHeader from '@/components/layout/PageHeader';
import { useAdDraft } from '@/hooks/useAdDraft';
import { useMerchantSession } from '@/hooks/useMerchantSession';
import { ActionArea, CameraInput, Content, EmptyPhoto, ErrorMessage, GuideCopy, Page, PhotoPreview, Popo, RetakeButton } from '@/pages/CaptureResult/CaptureResult.styles';

const CaptureResult = (): React.JSX.Element => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { draft, setAsset, setCurrentRequest, setRetryMessage, setSessionPhoto } = useAdDraft();
  const { session } = useMerchantSession();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const assetType = searchParams.get('asset') === 'food_photo' ? 'food_photo' : 'menu_board';
  const isSessionFlow = draft.format === 'photo';
  const isMenuBoard = assetType === 'menu_board';
  const photoRequestSubject = draft.currentRequest?.prompt.match(/^\s*사진\s*요청\s*[:：]\s*(.+?)\s*$/)?.[1];
  const requestTarget = photoRequestSubject ?? draft.currentRequest?.prompt ?? (isMenuBoard ? '메뉴판' : '주력 메뉴');
  const photoUrl = isSessionFlow
    ? draft.sessionPhoto?.previewUrl
    : (isMenuBoard ? draft.menuBoard?.previewUrl : draft.foodPhoto?.previewUrl);

  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const [photo] = Array.from(event.target.files ?? []);
    if (!photo) return;
    if (isSessionFlow) {
      setSessionPhoto(draft.currentRequest?.assetType ?? 'food_photo', photo);
      return;
    }
    setAsset(assetType, photo);
  };

  const goNext = async (): Promise<void> => {
    if (isSessionFlow) {
      if (!session || !draft.sessionId || !draft.sessionPhoto) {
        setErrorMessage('사진 전송에 필요한 정보가 없어요. 다시 촬영해주세요.');
        return;
      }

      setIsSubmitting(true);
      setErrorMessage(null);
      try {
        const uploadedAsset = await uploadAsset({
          assetType: (draft.sessionPhoto.assetType === 'menu_board' ? 'menu_board' : 'food_photo') as UploadAssetType,
          file: draft.sessionPhoto.file,
          session,
        });
        const response = await submitAdSessionPhoto({ sessionId: draft.sessionId, asset: uploadedAsset });

        if (response.data.response === 'fail') {
          setRetryMessage(response.data.retryMessage ?? '사진을 다시 찍어주세요.');
          navigate('/create/capture', { replace: true });
          return;
        }

        if (response.data.status === 'collecting' && response.data.request) {
          setCurrentRequest(response.data.request);
          navigate('/create/capture', { replace: true });
          return;
        }

        if (response.data.status === 'generating') {
          navigate('/create/generating', { replace: true });
          return;
        }

        throw new Error('다음 촬영 요청을 받지 못했어요. 다시 시도해주세요.');
      } catch (error) {
        setErrorMessage(error instanceof Error ? error.message : '사진을 확인하지 못했어요. 다시 시도해주세요.');
      } finally {
        setIsSubmitting(false);
      }
      return;
    }

    if (isMenuBoard) {
      navigate('/create/capture?asset=food_photo');
      return;
    }

    navigate('/create/questions/0');
  };

  return (
    <Page aria-label="촬영 사진 확인">
      <PageHeader title="광고 제작" onBack={() => navigate(isSessionFlow ? '/create/capture' : `/create/capture?asset=${assetType}`)} />
      <Content>
        <Popo src={popo} alt="" />
        <GuideCopy>
          <FlowTitleStrong>{requestTarget}</FlowTitleStrong> 사진을<br />이걸로 하실래요?
        </GuideCopy>
        {photoUrl ? <PhotoPreview src={photoUrl} alt="방금 촬영한 사진" /> : <EmptyPhoto>촬영한 사진이 없어요.</EmptyPhoto>}
      </Content>
      <ActionArea>
        <RetakeButton type="button" onClick={() => fileInputRef.current?.click()}>
          다시 촬영
        </RetakeButton>
        <PrimaryActionButton type="button" onClick={() => void goNext()} disabled={!photoUrl || isSubmitting}>
          {isSubmitting ? '사진 확인 중...' : '확인'}
        </PrimaryActionButton>
      </ActionArea>
      {errorMessage && <ErrorMessage role="alert">{errorMessage}</ErrorMessage>}
      <CameraInput ref={fileInputRef} type="file" accept="image/*" capture="environment" onChange={handlePhotoChange} />
    </Page>
  );
};

export default CaptureResult;
