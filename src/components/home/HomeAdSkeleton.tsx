import { keyframes } from 'styled-components';
import styled from 'styled-components';

import { COLORS } from '@/constants/colors';

type HomeAdSkeletonProps = {
  variant: 'attention' | 'promotion';
};

const HomeAdSkeleton = ({ variant }: HomeAdSkeletonProps): React.JSX.Element => (
  variant === 'attention' ? (
    <AttentionCard aria-hidden="true">
      <AttentionThumbnail />
      <AttentionText>
        <Line $width="42%" />
        <Line $width="62%" />
        <Line $width="78%" />
      </AttentionText>
    </AttentionCard>
  ) : <PromotionCard aria-hidden="true" />
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

const AttentionCard = styled.div`
  display: flex;
  align-items: center;
  min-height: 108px;
  overflow: hidden;
  border-radius: 14px;
  padding: 10px 16px 10px 32px;
  background: ${COLORS.white};
  box-shadow: 0 4px 14px rgba(33, 33, 33, 0.12);
`;

const AttentionThumbnail = styled(SkeletonBase)`
  width: 88px;
  height: 88px;
  flex: 0 0 auto;
  border-radius: 12px;
`;

const AttentionText = styled.div`
  display: grid;
  width: 100%;
  gap: 9px;
  margin-left: 15px;
`;

const Line = styled(SkeletonBase)<{ $width: string }>`
  width: ${({ $width }) => $width};
  height: 12px;
  border-radius: 999px;
`;

const PromotionCard = styled(SkeletonBase)`
  width: 180px;
  height: 180px;
  flex: 0 0 auto;
  border-radius: 14px;
`;

export default HomeAdSkeleton;
