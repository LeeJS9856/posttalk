import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

import { getAdminReviewDetail, type AdminReviewDetail, type AdminReviewItem } from '@/apis/adminReviews';
import PageHeader from '@/components/layout/PageHeader';
import { ActionArea, AdContent, ApproveButton, Content, Date, Format, Meta, Page, Preview, RejectButton, Title } from '@/pages/AdminReviewDetail/AdminReviewDetail.styles';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1610057099431-d73a1c9d2f2f?auto=format&fit=crop&w=900&q=90';
const FALLBACK_CONTENT = '주당들을 일단 저장해야하는 가성비 갑 👍\n말바우시장 특랑만 횟집🐟\n\n양도 혜자인데 신선한 회까지 가성비는 제대로 챙겼다!!\n싱싱에 매주 3천원, 소주 2천원으로\n술까지 가성비 챙긴 특랑만 횟집 😁\n1년 365일 회를 부축이는 이유가 있다구~~~~\n\n@@푸~찐한 시장 정 느끼러 가자!!\n\n📍광주 북구 동문대로 97번길 81\n📍매일 11:00 ~ 23:00 (한달에 두번 휴일)\n\n#광주맛집 #광주맛집추천 #광주횟집 #광주가볼만한곳\n#광주동어시장횟집 #광주횟집추천 #말바우시장맛집';

type ReviewLocationState = { review?: AdminReviewItem };

const toFallbackDetail = (review?: AdminReviewItem): AdminReviewDetail => ({
  submissionId: review?.submissionId ?? 'demo-review-1',
  thumbnailUrl: review?.thumbnailUrl ?? FALLBACK_IMAGE,
  primaryAssetUrl: review?.thumbnailUrl ?? FALLBACK_IMAGE,
  title: review?.title ?? '특랑만',
  createdAt: review?.createdAt ?? '2026-07-30T09:30:00.000Z',
  mediaType: review?.mediaType ?? 'photo',
  content: { caption: FALLBACK_CONTENT },
});

const AdminReviewDetailPage = (): React.JSX.Element => {
  const navigate = useNavigate();
  const { submissionId = '' } = useParams();
  const { state } = useLocation();
  const review = (state as ReviewLocationState | null)?.review;
  const [detail, setDetail] = useState<AdminReviewDetail>(() => toFallbackDetail(review));

  useEffect(() => {
    const controller = new AbortController();

    const loadDetail = async (): Promise<void> => {
      try {
        const response = await getAdminReviewDetail({ submissionId, signal: controller.signal });
        setDetail(response.data);
      } catch {
        // 관리자 키가 설정되기 전에도 예시 상세 화면을 확인할 수 있습니다.
      }
    };

    if (submissionId) void loadDetail();
    return () => controller.abort();
  }, [submissionId]);

  const formatLabel = detail.mediaType === 'video' ? '영상 광고' : '사진 광고';
  const date = detail.createdAt.slice(0, 10).replaceAll('-', '.');
  const content = [detail.content.caption, detail.content.hashtags?.join(' ')].filter(Boolean).join('\n\n');

  return (
    <Page aria-label="광고 검토 상세">
      <PageHeader title="검토" showTitle={false} onBack={() => navigate(-1)} />
      <Content>
        <Meta>
          <Title>{detail.title}</Title>
          <Date>{date}</Date>
        </Meta>
        <Format>{formatLabel}</Format>
        <Preview src={detail.primaryAssetUrl ?? detail.thumbnailUrl ?? FALLBACK_IMAGE} alt={`${detail.title} 광고 미리보기`} />
        <AdContent>{content || FALLBACK_CONTENT}</AdContent>
      </Content>
      <ActionArea>
        <RejectButton type="button">반려</RejectButton>
        <ApproveButton type="button">승인 및 게시</ApproveButton>
      </ActionArea>
    </Page>
  );
};

export default AdminReviewDetailPage;
