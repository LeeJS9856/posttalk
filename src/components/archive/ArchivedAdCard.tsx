import styled from 'styled-components';

import PhotoPreviewCarousel from '@/components/create/PhotoPreviewCarousel';
import StatusBadge from '@/components/common/StatusBadge';
import { COLORS } from '@/constants/colors';
import type { ArchiveFormat } from '@/constants/archive';
import type { AdStatus } from '@/constants/status';
import { FONT_SIZE } from '@/constants/typography';

type ArchivedAdCardProps = {
  date: string;
  format: ArchiveFormat;
  images: readonly string[];
  status: AdStatus;
  title: string;
  thumbnailUrl?: string;
  onClick?: () => void;
};

const ArchivedAdCard = ({ date, format, images, status, title, thumbnailUrl, onClick }: ArchivedAdCardProps): React.JSX.Element => {
  const content = (
    <>
      {format === 'photo' && images.length > 0 ? (
        <PhotoPreviewCarousel images={images} />
      ) : thumbnailUrl ? (
        <Thumbnail src={thumbnailUrl} alt={`${title} 미리보기`} />
      ) : (
        <MissingPreview>미리보기를 준비 중이에요.</MissingPreview>
      )}
      <CardInfo>
        <Title>{title}</Title>
        <StatusBadge status={status} />
        <Date>{date}</Date>
      </CardInfo>
    </>
  );

  return onClick ? <CardButton type="button" onClick={onClick}>{content}</CardButton> : <Card>{content}</Card>;
};

const Card = styled.article`
  overflow: hidden;
  background: ${COLORS.white};
`;

const CardButton = styled(Card).attrs({ as: 'button' })`
  width: 100%;
  border: 0;
  padding: 0;
  text-align: left;
`;

const Thumbnail = styled.img`
  display: block;
  width: 100%;
  aspect-ratio: 1;
  object-fit: cover;
`;

const MissingPreview = styled.div`
  display: grid;
  width: 100%;
  aspect-ratio: 1;
  place-items: center;
  color: ${COLORS.black500};
  background: ${COLORS.black200};
  font-size: ${FONT_SIZE.body};
`;

const CardInfo = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  gap: 7px 12px;
  padding: 20px 24px 22px;

  > span {
    font-size: ${FONT_SIZE.label};
  }
`;

const Title = styled.h2`
  color: ${COLORS.black700};
  font-size: ${FONT_SIZE.titleSmall};
  font-weight: 700;
  line-height: 1.3;
`;

const Date = styled.time`
  grid-column: 1 / -1;
  color: ${COLORS.black500};
  font-size: ${FONT_SIZE.label};
  font-weight: 400;
`;

export default ArchivedAdCard;
