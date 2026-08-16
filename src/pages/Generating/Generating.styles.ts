import styled from 'styled-components';

import { FlowSubtitle, FlowTitle } from '@/components/common/FlowTitle';
import PageFrame from '@/components/layout/PageFrame';
import { COLORS } from '@/constants/colors';

export const Page = styled(PageFrame)`
  display: flex;
  min-height: 100svh;
  flex-direction: column;
  background: ${COLORS.background.main};
`;

export const Content = styled.main`
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  padding: clamp(92px, 19svh, 154px) 24px 0;
  text-align: center;
`;

export const Popo = styled.img`
  width: 57px;
  height: 54px;
`;

export const Title = styled(FlowTitle)`
  margin-top: 18px;
`;

export const Description = styled(FlowSubtitle)`
  margin-top: 2px;
`;

export const LoaderArea = styled.div`
  display: grid;
  margin-top: 46px;
  place-items: center;
`;
