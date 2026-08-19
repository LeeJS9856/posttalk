import { useEffect, useRef, useState } from 'react';
import { ClipLoader } from 'react-spinners';
import { useNavigate } from 'react-router-dom';

import popo from '@/assets/popo.svg';
import { checkPhoto, createSubmission, getGenerationResult, startGeneration, type UploadAssetType, uploadAsset } from '@/apis/creation';
import { getServerHealth } from '@/apis/server';
import { FlowTitleStrong } from '@/components/common/FlowTitle';
import { COLORS } from '@/constants/colors';
import { useAdDraft } from '@/hooks/useAdDraft';
import { useMerchantSession } from '@/hooks/useMerchantSession';
import { Content, Description, LoaderArea, Page, Popo, RetakeButton, Title } from '@/pages/Generating/Generating.styles';

const Generating = (): React.JSX.Element => (
  <GeneratingContent />
);

const GeneratingContent = (): React.JSX.Element => {
  const navigate = useNavigate();
  const { draft, setGeneratedResultUrl, setGeneration } = useAdDraft();
  const { errorMessage: qrErrorMessage, isLoading: isQrLoading, session } = useMerchantSession();
  const startedRef = useRef(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [retakeAssetType, setRetakeAssetType] = useState<UploadAssetType | null>(null);

  useEffect(() => {
    if (isQrLoading || startedRef.current) return;
    startedRef.current = true;

    const generateAdvertisement = async (): Promise<void> => {
      const { answers, foodPhoto, format, menuBoard } = draft;

      if (!session) {
        setErrorMessage(qrErrorMessage ?? 'QR로 가게 정보를 확인해주세요.');
        return;
      }

      if (!menuBoard || !foodPhoto || !answers.storeType || !answers.targetMenuName || !answers.appealPoint) {
        setErrorMessage('광고 생성에 필요한 사진 또는 답변이 없어요. 다시 입력해주세요.');
        return;
      }

      try {
        await getServerHealth();
        const [menuBoardAsset, foodPhotoAsset] = await Promise.all([
          uploadAsset({ assetType: 'menu_board', file: menuBoard.file, session }),
          uploadAsset({ assetType: 'food_photo', file: foodPhoto.file, session }),
        ]);
        const [menuBoardReview, foodPhotoReview] = await Promise.all([
          checkPhoto({ asset: menuBoardAsset, assetType: 'menu_board', session, shotOrder: 1 }),
          checkPhoto({ asset: foodPhotoAsset, assetType: 'food_photo', session, shotOrder: 2 }),
        ]);

        const failedReview = [
          { assetType: 'menu_board' as const, result: menuBoardReview },
          { assetType: 'food_photo' as const, result: foodPhotoReview },
        ].find(({ result }) => !result.review.passed);
        if (failedReview) {
          setRetakeAssetType(failedReview.assetType);
          setErrorMessage(`${failedReview.result.review.summary} ${failedReview.result.review.feedback.join(' ')}`);
          return;
        }

        const submission = await createSubmission({
          answers: {
            storeType: answers.storeType,
            targetMenuName: answers.targetMenuName,
            appealPoint: answers.appealPoint,
            targetCustomer: answers.targetCustomer,
            peakSalesTime: answers.peakSalesTime,
            popularMenuNotes: answers.popularMenuNotes,
            extraMessage: answers.extraMessage,
          },
          assets: [menuBoardAsset, foodPhotoAsset],
          session,
        });
        const job = await startGeneration({ format, submissionId: submission.submissionId });
        setGeneration({ jobId: job.jobId, submissionId: submission.submissionId });

        while (true) {
          const result = await getGenerationResult({ format, jobId: job.jobId });

          if (result.status === 'completed' && result.resultUrl) {
            setGeneratedResultUrl(result.resultUrl);
            navigate('/create/complete', { replace: true });
            return;
          }

          if (result.status === 'failed') {
            throw new Error('광고 생성에 실패했어요. 잠시 후 다시 시도해주세요.');
          }

          await new Promise<void>((resolve) => window.setTimeout(resolve, 2000));
        }
      } catch (error) {
        setErrorMessage(error instanceof Error ? error.message : '광고 생성 중 문제가 발생했어요.');
      }
    };

    void generateAdvertisement();
  }, [draft, isQrLoading, navigate, qrErrorMessage, session, setGeneratedResultUrl, setGeneration]);

  return (
    <Page aria-label={retakeAssetType ? '사진 재촬영 안내' : '광고 생성 중'} aria-busy={!errorMessage}>
      <Content>
        <Popo src={popo} alt="" />
        <Title>
          <FlowTitleStrong>광고</FlowTitleStrong>를 만들고 있어요
        </Title>
        <Description>{errorMessage ?? '조금만 기다려 주세요'}</Description>
        {retakeAssetType ? (
          <RetakeButton type="button" onClick={() => navigate(`/create/capture?asset=${retakeAssetType}`)}>
            {retakeAssetType === 'menu_board' ? '메뉴판' : '음식 사진'} 다시 촬영하기
          </RetakeButton>
        ) : (
          <LoaderArea aria-label="광고 생성 중입니다">
            <ClipLoader color={COLORS.primary} size={30} speedMultiplier={0.8} />
          </LoaderArea>
        )}
      </Content>
    </Page>
  );
};

export default Generating;
