import { useEffect, useRef, useState } from 'react';
import { ClipLoader } from 'react-spinners';
import { useNavigate } from 'react-router-dom';

import popo from '@/assets/popo.svg';
import { getAdSession, type GeneratedAsset } from '@/apis/adSessions';
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

const getGeneratedAssetUrl = (asset: GeneratedAsset | string): string | undefined => {
  if (typeof asset === 'string') return asset;
  return asset.url ?? asset.publicUrl ?? asset.resultUrl ?? asset.filePath;
};

const normalizeHashtags = (hashtags?: string[] | string): string[] | undefined => {
  if (Array.isArray(hashtags)) return hashtags;
  if (!hashtags) return undefined;
  return hashtags.split(/[\n,]/).map((hashtag) => hashtag.trim()).filter(Boolean);
};

const GeneratingContent = (): React.JSX.Element => {
  const navigate = useNavigate();
  const { draft, setGeneratedResultUrl, setGeneration, setGenerationResult } = useAdDraft();
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

      if (draft.sessionId) {
        if (!draft.sessionId) {
          setErrorMessage('광고 생성 세션을 찾지 못했어요. 다시 만들어주세요.');
          return;
        }

        try {
          while (true) {
            const response = await getAdSession({ sessionId: draft.sessionId });
            const sessionData = response.data;
            const isCompleted = sessionData.status === 'completed' || sessionData.generation?.status === 'completed';

            if (isCompleted) {
              const generatedAssets = (sessionData.generation?.generatedAssets ?? [])
                .map(getGeneratedAssetUrl)
                .filter((url): url is string => Boolean(url));
              const resultUrl = sessionData.generation?.resultUrl ?? generatedAssets[0];
              const previewImages = generatedAssets.length > 0
                ? generatedAssets
                : (resultUrl ? [resultUrl] : []);

              if (previewImages.length === 0) {
                throw new Error('생성된 광고 이미지를 받지 못했어요.');
              }

              setGenerationResult({
                generatedAssets: previewImages,
                resultUrl: resultUrl ?? previewImages[0],
                submissionId: sessionData.submission?.id ?? sessionData.submission?.submissionId,
                caption: sessionData.submission?.caption ?? sessionData.draft?.caption,
                hashtags: normalizeHashtags(sessionData.submission?.hashtags ?? sessionData.draft?.hashtags),
              });
              navigate('/create/complete', { replace: true });
              return;
            }

            if (sessionData.status === 'failed' || sessionData.generation?.status === 'failed') {
              throw new Error('광고 생성에 실패했어요. 잠시 후 다시 시도해주세요.');
            }

            await new Promise<void>((resolve) => window.setTimeout(resolve, 2000));
          }
        } catch (error) {
          setErrorMessage(error instanceof Error ? error.message : '광고 생성 중 문제가 발생했어요.');
        }
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
  }, [draft, isQrLoading, navigate, qrErrorMessage, session, setGeneratedResultUrl, setGeneration, setGenerationResult]);

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
