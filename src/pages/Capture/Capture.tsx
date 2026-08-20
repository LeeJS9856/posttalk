import { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import foodExampleImage from '@/assets/food.webp';
import menuExampleImage from '@/assets/menu.png';
import popo from '@/assets/popo.svg';
import { startAdSession } from '@/apis/adSessions';
import { FlowTitleStrong } from '@/components/common/FlowTitle';
import PrimaryActionButton from '@/components/common/PrimaryActionButton';
import PageHeader from '@/components/layout/PageHeader';
import { useAdDraft } from '@/hooks/useAdDraft';
import { useMerchantSession } from '@/hooks/useMerchantSession';
import {
  ActionArea,
  CameraInput,
  ChoiceButton,
  ExampleImage,
  Guide,
  GuideCopy,
  HelperText,
  ModalBackdrop,
  ModalCancelButton,
  ModalContent,
  ModalDescription,
  ModalTitle,
  Page,
  Popo,
} from '@/pages/Capture/Capture.styles';

const MAX_PHOTO_SIZE_BYTES = 10 * 1024 * 1024;
const SUPPORTED_PHOTO_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);

const Capture = (): React.JSX.Element => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const [isSourceModalOpen, setIsSourceModalOpen] = useState(false);
  const [startError, setStartError] = useState<string | null>(null);
  const [selectionError, setSelectionError] = useState<string | null>(null);
  const { draft, setAsset, setSession, setSessionPhoto } = useAdDraft();
  const { session } = useMerchantSession();
  const assetType = searchParams.get('asset') === 'food_photo' ? 'food_photo' : 'menu_board';
  const isSessionFlow = draft.format === 'photo';
  const sessionAssetType = draft.currentRequest?.assetType === 'menu_board' ? 'menu_board' : 'food_photo';
  const displayedAssetType = isSessionFlow ? sessionAssetType : assetType;
  const isMenuBoard = displayedAssetType === 'menu_board';
  const photoRequestSubject = draft.currentRequest?.prompt.match(/^\s*사진\s*요청\s*[:：]\s*(.+?)\s*$/)?.[1];
  const hasSessionRequest = Boolean(draft.currentRequest);

  useEffect(() => {
    if (!isSessionFlow || draft.sessionId || startError) return;

    const menuIntro = draft.answers.menuIntro?.trim();
    const storeSpecialty = draft.answers.storeSpecialty?.trim();
    if (!session || !menuIntro || !storeSpecialty) {
      setStartError('광고 소개 정보가 없어요. 처음부터 다시 입력해주세요.');
      return;
    }

    const startSession = async (): Promise<void> => {
      try {
        const response = await startAdSession({
          storeId: session.storeId,
          adType: 'photo',
          menuIntro,
          storeSpecialty,
        });
        const { data } = response;
        const sessionId = data.sessionId ?? data.session?.id ?? data.session?.sessionId;
        const request = data.currentRequest ?? data.request;
        if (!sessionId || !request) throw new Error('첫 촬영 요청을 받지 못했어요. 다시 시도해주세요.');
        setSession({ sessionId, request });
      } catch (error) {
        setStartError(error instanceof Error ? error.message : '촬영 요청을 준비하지 못했어요.');
      }
    };

    void startSession();
  }, [draft.answers.menuIntro, draft.answers.storeSpecialty, draft.sessionId, isSessionFlow, session, setSession, startError]);

  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const [photo] = Array.from(event.target.files ?? []);
    if (!photo) return;

    if (!SUPPORTED_PHOTO_TYPES.has(photo.type)) {
      setSelectionError('JPG, PNG, WebP 형식의 사진만 사용할 수 있어요. 사진을 변환한 뒤 다시 선택해주세요.');
      return;
    }

    if (photo.size > MAX_PHOTO_SIZE_BYTES) {
      setSelectionError('사진은 10MB 이하 파일만 사용할 수 있어요. 용량을 줄인 뒤 다시 선택해주세요.');
      return;
    }

    setSelectionError(null);

    if (isSessionFlow) {
      setSessionPhoto(sessionAssetType, photo);
      navigate('/create/capture/result');
      return;
    }

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
      <PageHeader title="광고 제작" onBack={() => navigate(isSessionFlow ? '/create/questions/1' : (isMenuBoard ? '/create' : '/create/capture/result?asset=menu_board'))} />

      <Guide>
        <Popo src={popo} alt="" />
        <GuideCopy>
          {isSessionFlow ? (photoRequestSubject ? (
            <>
              아래 사진과 같이
              <br />
              <FlowTitleStrong>{photoRequestSubject}</FlowTitleStrong>을 찍어주세요
            </>
          ) : (draft.currentRequest?.prompt ?? '촬영 요청을 준비하고 있어요.')) : (
            <>
              아래 사진과 같이
              <br />
              <FlowTitleStrong>{isMenuBoard ? '메뉴판' : '주력 메뉴'}</FlowTitleStrong>을 찍어주세요
            </>
          )}
        </GuideCopy>
        {isSessionFlow && <HelperText>{startError ?? selectionError ?? draft.retryMessage ?? draft.currentRequest?.helperText ?? '사진 촬영 안내를 불러오고 있어요.'}</HelperText>}
        {(!isSessionFlow || hasSessionRequest) && (
          <ExampleImage src={isMenuBoard ? menuExampleImage : foodExampleImage} alt={isMenuBoard ? '메뉴판 촬영 예시' : '음식 사진 촬영 예시'} />
        )}
      </Guide>

      {(!isSessionFlow || hasSessionRequest) && (
        <ActionArea>
          <PrimaryActionButton type="button" onClick={() => setIsSourceModalOpen(true)} disabled={Boolean(startError)}>
            촬영하기
          </PrimaryActionButton>
        </ActionArea>
      )}
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
