import styled from 'styled-components';

import chevronRightIcon from '@/assets/icons/chevron right.svg?raw';
import StatusBadge from '@/components/common/StatusBadge';
import SurfaceCard from '@/components/common/SurfaceCard';
import { COLORS } from '@/constants/colors';
import { REVIEW_DESCRIPTION, type ReviewStatus } from '@/constants/home';
import { FONT_SIZE } from '@/constants/typography';

type ReviewAdCardProps = { status: ReviewStatus; storeName: string; image: string; onClick: () => void };

const ReviewAdCard = ({ status, storeName, image, onClick }: ReviewAdCardProps): React.JSX.Element => (
  <CardButton type="button" onClick={onClick} $status={status}>
    <Thumbnail src={image} alt="" />
    <CardText>
      <StatusWrapper><StatusBadge status={status} /></StatusWrapper>
      <StoreName>{storeName}</StoreName>
      <Description>{REVIEW_DESCRIPTION[status]}</Description>
    </CardText>
    <Chevron $status={status} aria-hidden="true" dangerouslySetInnerHTML={{ __html: chevronRightIcon }} />
  </CardButton>
);

const CardButton = styled(SurfaceCard).attrs({ as: 'button' })<{ $status: ReviewStatus }>`
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  min-height: 108px;
  overflow: hidden;
  border: 0;
  padding: 10px 16px 10px 32px;
  text-align: left;

  &::before {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    width: 18px;
    background: ${({ $status }) => ($status === 'pending' ? COLORS.primary : COLORS.statusCheck)};
    content: '';
  }
`;

const Thumbnail = styled.img`
  width: 88px;
  height: 88px;
  flex: 0 0 auto;
  border-radius: 12px;
  object-fit: cover;
`;

const CardText = styled.div`
  display: flex;
  min-width: 0;
  flex: 1;
  flex-direction: column;
  align-items: flex-start;
  gap: 0;
  margin-left: 15px;
`;

const StatusWrapper = styled.div`
  margin-bottom: 8px;
`;

const StoreName = styled.strong`
  color: ${COLORS.black700};
  margin-bottom: 3px;
  font-size: ${FONT_SIZE.titleSmall};
  line-height: 1.2;
`;

const Description = styled.span`
  color: ${COLORS.black500};
  font-size: ${FONT_SIZE.caption};
  font-weight: 400;
`;

const Chevron = styled.span<{ $status: ReviewStatus }>`
  display: flex;
  align-items: center;
  justify-content: center;
  align-self: center;
  width: 20px;
  height: 20px;
  flex: 0 0 auto;
  margin-left: 8px;
  color: ${({ $status }) => ($status === 'pending' ? COLORS.primary : COLORS.statusCheck)};

  svg {
    display: block;
    width: 100%;
    height: 100%;
  }
`;

export default ReviewAdCard;
