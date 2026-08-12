import styled from 'styled-components';

import PhotoPreviewCarousel from '@/components/create/PhotoPreviewCarousel';
import VideoPreview from '@/components/create/VideoPreview';
import StatusBadge from '@/components/common/StatusBadge';
import { COLORS } from '@/constants/colors';
import type { ArchiveFormat } from '@/constants/archive';
import type { AdStatus } from '@/constants/status';

type ArchivedAdCardProps = {
  date: string;
  format: ArchiveFormat;
  images: readonly string[];
  status: AdStatus;
  title: string;
  videoSrc?: string;
};

const ArchivedAdCard = ({ date, format, images, status, title, videoSrc }: ArchivedAdCardProps): React.JSX.Element => (
  <Card>
    {format === 'photo' ? (
      <PhotoPreviewCarousel images={images} />
    ) : (
      <VideoPreview videoSrc={videoSrc ?? ''} />
    )}
    <CardInfo>
      <Title>{title}</Title>
      <StatusBadge status={status} />
      <Date>{date}</Date>
    </CardInfo>
  </Card>
);

const Card = styled.article`
  overflow: hidden;
  background: ${COLORS.white};
`;

const CardInfo = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  gap: 7px 12px;
  padding: 20px 24px 22px;

  > span {
    font-size: 14px;
  }
`;

const Title = styled.h2`
  color: ${COLORS.black700};
  font-size: 19px;
  font-weight: 700;
  line-height: 1.3;
`;

const Date = styled.time`
  grid-column: 1 / -1;
  color: ${COLORS.black500};
  font-size: 14px;
  font-weight: 400;
`;

export default ArchivedAdCard;
