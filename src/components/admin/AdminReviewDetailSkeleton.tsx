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

const Layout = styled.div`
  display: grid;
  gap: 14px;
`;

const Meta = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const Title = styled(SkeletonBase)`
  width: 34%;
  height: 23px;
  border-radius: 999px;
`;

const Date = styled(SkeletonBase)`
  width: 20%;
  height: 14px;
  border-radius: 999px;
`;

const Format = styled(SkeletonBase)`
  width: 18%;
  height: 14px;
  border-radius: 999px;
`;

const Preview = styled(SkeletonBase)`
  width: 100%;
  aspect-ratio: 1;
  border-radius: 8px;
`;

const Copy = styled.div`
  display: grid;
  gap: 8px;
  margin-top: 10px;
`;

const CopyLine = styled(SkeletonBase)<{ $width: string }>`
  width: ${({ $width }) => $width};
  height: 14px;
  border-radius: 999px;
`;

const AdminReviewDetailSkeleton = (): React.JSX.Element => (
  <Layout aria-hidden="true">
    <Meta><Title /><Date /></Meta>
    <Format />
    <Preview />
    <Copy>
      <CopyLine $width="100%" />
      <CopyLine $width="86%" />
      <CopyLine $width="62%" />
    </Copy>
  </Layout>
);

export default AdminReviewDetailSkeleton;
