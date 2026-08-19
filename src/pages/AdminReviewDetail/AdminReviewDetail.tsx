import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { getAdminReviewDetail, type AdminReviewDetail, updateAdminReviewStatus } from '@/apis/adminReviews';
import PhotoPreviewCarousel from '@/components/create/PhotoPreviewCarousel';
import VideoPreview from '@/components/create/VideoPreview';
import PageHeader from '@/components/layout/PageHeader';
import { VIDEO_PREVIEW_SOURCE } from '@/constants/create';
import { ActionArea, AdContent, ApproveButton, Content, Date, EmptyMessage, Format, Meta, Page, RejectButton, Title } from '@/pages/AdminReviewDetail/AdminReviewDetail.styles';

const AdminReviewDetailPage = (): React.JSX.Element => {
  const navigate = useNavigate();
  const { submissionId = '' } = useParams();
  const [detail, setDetail] = useState<AdminReviewDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    const loadDetail = async (): Promise<void> => {
      try {
        const response = await getAdminReviewDetail({ submissionId, signal: controller.signal });
        setDetail(response.data);
      } catch (error) {
        if (!(error instanceof DOMException && error.name === 'AbortError')) setHasError(true);
      } finally {
        if (!controller.signal.aborted) setIsLoading(false);
      }
    };

    if (submissionId) void loadDetail();
    return () => controller.abort();
  }, [submissionId]);

  const updateStatus = async (status: 'approved' | 'rejected'): Promise<void> => {
    if (!submissionId || isUpdating) return;

    setIsUpdating(true);
    setUpdateError(null);
    try {
      await updateAdminReviewStatus({ submissionId, status });
      navigate('/admin/reviews', { replace: true });
    } catch (error) {
      setUpdateError(error instanceof Error ? error.message : '검토 상태를 변경하지 못했어요.');
    } finally {
      setIsUpdating(false);
    }
  };

  const formatLabel = detail?.mediaType === 'video' ? '영상 광고' : '사진 광고';
  const date = detail?.createdAt.slice(0, 10).replaceAll('-', '.') ?? '';
  const content = [detail?.content.caption, detail?.content.hashtags?.join(' ')].filter(Boolean).join('\n\n');
  const assetUrls = detail?.assets?.flatMap((asset) => [asset.url, asset.publicUrl, asset.fileUrl].filter((url): url is string => Boolean(url))) ?? [];
  const photoImages = assetUrls.length > 0 ? assetUrls : detail?.primaryAssetUrl ? [detail.primaryAssetUrl] : [];
  const videoSrc = detail?.primaryAssetUrl ?? VIDEO_PREVIEW_SOURCE;

  return (
    <Page aria-label="광고 검토 상세">
      <PageHeader title="검토" showTitle={false} onBack={() => navigate(-1)} />
      <Content>
        {isLoading ? <EmptyMessage>광고 내용을 불러오는 중이에요.</EmptyMessage> : hasError || !detail ? <EmptyMessage>광고 내용을 불러오지 못했어요.</EmptyMessage> : (
          <>
            <Meta>
              <Title>{detail.title}</Title>
              <Date>{date}</Date>
            </Meta>
            <Format>{formatLabel}</Format>
            {detail.mediaType === 'video' ? <VideoPreview videoSrc={videoSrc} /> : photoImages.length > 0 ? <PhotoPreviewCarousel images={photoImages} /> : <EmptyMessage>미리보기를 준비 중이에요.</EmptyMessage>}
            <AdContent>{content}</AdContent>
            {updateError && <EmptyMessage>{updateError}</EmptyMessage>}
          </>
        )}
      </Content>
      <ActionArea>
        <RejectButton type="button" disabled={isUpdating || !detail} onClick={() => void updateStatus('rejected')}>반려</RejectButton>
        <ApproveButton type="button" disabled={isUpdating || !detail} onClick={() => void updateStatus('approved')}>
          {isUpdating ? '처리 중...' : '승인 및 게시'}
        </ApproveButton>
      </ActionArea>
    </Page>
  );
};

export default AdminReviewDetailPage;
