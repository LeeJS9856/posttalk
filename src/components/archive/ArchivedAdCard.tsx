import styled from 'styled-components';

import { COLORS } from '@/constants/colors';
import StatusBadge from '@/components/common/StatusBadge';
import type { AdStatus } from '@/constants/status';

type ArchivedAdCardProps = {
  date: string;
  image: string;
  status: AdStatus;
  title: string;
};

const ArchivedAdCard = ({ date, image, status, title }: ArchivedAdCardProps): React.JSX.Element => (
  <Card>
    <ImageArea>
      <Thumbnail src={image} alt={`${title} 광고 미리보기`} />
      <Pagination aria-hidden="true">
        {[0, 1, 2, 3, 4].map((dot) => (
          <Dot key={dot} $active={dot === 0} />
        ))}
      </Pagination>
    </ImageArea>
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

const ImageArea = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 1.18;
  overflow: hidden;
  background: ${COLORS.black200};
`;

const Thumbnail = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const Pagination = styled.div`
  position: absolute;
  bottom: 12px;
  left: 50%;
  display: flex;
  gap: 5px;
  transform: translateX(-50%);
`;

const Dot = styled.span<{ $active: boolean }>`
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: ${({ $active }) => ($active ? COLORS.primary : 'rgba(255, 255, 255, 0.9)')};
`;

const CardInfo = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  gap: 5px 12px;
  padding: 18px 24px 20px;
`;

const Title = styled.h2`
  color: ${COLORS.black700};
  font-size: 17px;
  font-weight: 700;
  line-height: 1.3;
`;

const Date = styled.time`
  grid-column: 1 / -1;
  color: ${COLORS.black500};
  font-size: 13px;
  font-weight: 400;
`;

export default ArchivedAdCard;
