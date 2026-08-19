import { useLocation, useNavigate } from 'react-router-dom';

import PhotoPreviewCarousel from '@/components/create/PhotoPreviewCarousel';
import PageHeader from '@/components/layout/PageHeader';
import type { ArchivedAd } from '@/constants/archive';
import { ActionArea, AdContent, Content, Date, EmptyMessage, Format, Meta, Page, PreviewImage, PrimaryButton, SecondaryButton, Title } from '@/pages/ArchiveDetail/ArchiveDetail.styles';

type ArchiveDetailLocationState = {
  ad?: ArchivedAd;
};

const ArchiveDetail = (): React.JSX.Element => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const ad = (state as ArchiveDetailLocationState | null)?.ad;
  const formatLabel = ad?.format === 'video' ? '영상 광고' : '사진 광고';
  const previewImages = ad?.images.length ? ad.images : ad?.thumbnailUrl ? [ad.thumbnailUrl] : [];

  return (
    <Page aria-label="광고 상세">
      <PageHeader title="보관함" showTitle={false} onBack={() => navigate(-1)} />
      <Content>
        {!ad ? <EmptyMessage>광고 정보를 불러올 수 없어요.</EmptyMessage> : (
          <>
            <Meta>
              <Title>{ad.title}</Title>
              <Date>{ad.date}</Date>
            </Meta>
            <Format>{formatLabel}</Format>
            {previewImages.length > 0 ? (
              ad.format === 'photo' ? <PhotoPreviewCarousel images={previewImages} /> : <PreviewImage src={previewImages[0]} alt={`${ad.title} 광고 미리보기`} />
            ) : <EmptyMessage>미리보기를 준비 중이에요.</EmptyMessage>}
            <AdContent>광고 내용은 준비 중이에요.</AdContent>
          </>
        )}
      </Content>
      <ActionArea>
        <SecondaryButton type="button">수정하기</SecondaryButton>
        <PrimaryButton type="button">게시 요청</PrimaryButton>
      </ActionArea>
    </Page>
  );
};

export default ArchiveDetail;
