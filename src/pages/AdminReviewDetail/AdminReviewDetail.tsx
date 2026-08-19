import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

import { getAdminReviewDetail, type AdminReviewDetail, updateAdminReviewStatus } from '@/apis/adminReviews';
import AdminRejectReasonModal from '@/components/admin/AdminRejectReasonModal';
import PhotoPreviewCarousel from '@/components/create/PhotoPreviewCarousel';
import AdminReviewDetailSkeleton from '@/components/admin/AdminReviewDetailSkeleton';
import VideoPreview from '@/components/create/VideoPreview';
import PageHeader from '@/components/layout/PageHeader';
import { VIDEO_PREVIEW_SOURCE } from '@/constants/create';
import { ActionArea, AdContent, ApproveButton, Content, Date, EmptyMessage, Format, Meta, Page, RejectButton, RejectionReason, RejectionReasonArea, RejectionReasonLabel, Title } from '@/pages/AdminReviewDetail/AdminReviewDetail.styles';

type ArchiveDetailState = {
  archiveStatus?: 'pending' | 'supplement' | 'posted';
};

const AdminReviewDetailPage = (): React.JSX.Element => {
  const navigate = useNavigate();
  const location = useLocation();
  const { submissionId = '' } = useParams();
  const [detail, setDetail] = useState<AdminReviewDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);

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
      setIsRejectModalOpen(false);
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
  const archiveStatus = (location.state as ArchiveDetailState | null)?.archiveStatus;
  const detailStatus = detail?.status === 'pending_review' ? 'pending' : detail?.status === 'rejected' ? 'supplement' : detail?.status === 'approved' ? 'posted' : archiveStatus;
  const isPendingReview = detailStatus === undefined || detailStatus === 'pending';
  const isRejected = detailStatus === 'supplement';
  const rejectionReason = detail?.rejectionReason ?? detail?.rejection?.reason ?? '반려 사유가 등록되지 않았어요.';

  return (
    <Page aria-label="광고 검토 상세">
      <PageHeader title="검토" showTitle={false} onBack={() => navigate(-1)} />
      <Content>
        {isLoading ? <AdminReviewDetailSkeleton /> : hasError || !detail ? <EmptyMessage>광고 내용을 불러오지 못했어요.</EmptyMessage> : (
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
      {!isLoading && detail && isPendingReview && (
        <ActionArea>
          <RejectButton type="button" disabled={isUpdating} onClick={() => setIsRejectModalOpen(true)}>반려</RejectButton>
          <ApproveButton type="button" disabled={isUpdating} onClick={() => void updateStatus('approved')}>
            {isUpdating ? '처리 중...' : '승인 및 게시'}
          </ApproveButton>
        </ActionArea>
      )}
      {!isLoading && detail && isRejected && (
        <RejectionReasonArea>
          <RejectionReasonLabel>반려 이유</RejectionReasonLabel>
          <RejectionReason>{rejectionReason}</RejectionReason>
        </RejectionReasonArea>
      )}
      {isPendingReview && isRejectModalOpen && (
        <AdminRejectReasonModal
          isSubmitting={isUpdating}
          onClose={() => setIsRejectModalOpen(false)}
          onConfirm={() => void updateStatus('rejected')}
        />
      )}
    </Page>
  );
};

export default AdminReviewDetailPage;
