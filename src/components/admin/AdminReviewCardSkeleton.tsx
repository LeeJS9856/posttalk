import { keyframes } from 'styled-components';
import styled from 'styled-components';

import { COLORS } from '@/constants/colors';

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
  display: flex;
  min-height: 108px;
  align-items: center;
  border-radius: 10px;
  padding: 8px 14px 8px 10px;
  background: ${COLORS.white};
  box-shadow: 0 4px 10px rgba(33, 33, 33, 0.16);
`;

const Thumbnail = styled(SkeletonBase)`
  width: 88px;
  height: 88px;
  flex: 0 0 auto;
  border-radius: 8px;
`;

const Text = styled.div`
  display: grid;
  width: 100%;
  gap: 10px;
  margin-left: 14px;
`;

const Line = styled(SkeletonBase)<{ $width: string }>`
  width: ${({ $width }) => $width};
  height: 14px;
  border-radius: 999px;
`;

const AdminReviewCardSkeleton = (): React.JSX.Element => (
  <Card aria-hidden="true">
    <Thumbnail />
    <Text>
      <Line $width="48%" />
      <Line $width="34%" />
    </Text>
  </Card>
);

export default AdminReviewCardSkeleton;
