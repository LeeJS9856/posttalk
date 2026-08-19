import { keyframes } from 'styled-components';
import styled from 'styled-components';

import { COLORS } from '@/constants/colors';

const ArchivedAdCardSkeleton = (): React.JSX.Element => (
  <Card aria-hidden="true">
    <Preview />
    <CardInfo>
      <Title />
      <Badge />
      <Date />
    </CardInfo>
  </Card>
);

const shimmer = keyframes`
  100% {
    transform: translateX(100%);
  }
`;

const SkeletonBase = styled.span`
  position: relative;
  display: block;
  overflow: hidden;
  background: ${COLORS.primary100};

  &::after {
    position: absolute;
    inset: 0;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.72), transparent);
    content: '';
    transform: translateX(-100%);
    animation: ${shimmer} 1.4s infinite;
  }
`;

const Card = styled.article`
  overflow: hidden;
  background: ${COLORS.white};
`;

const Preview = styled(SkeletonBase)`
  width: 100%;
  aspect-ratio: 1;
`;

const CardInfo = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  gap: 10px 12px;
  padding: 20px 24px 22px;
`;

const Title = styled(SkeletonBase)`
  width: 44%;
  height: 20px;
  border-radius: 999px;
`;

const Badge = styled(SkeletonBase)`
  width: 62px;
  height: 24px;
  border-radius: 999px;
`;

const Date = styled(SkeletonBase)`
  width: 31%;
  height: 14px;
  border-radius: 999px;
`;

export default ArchivedAdCardSkeleton;
