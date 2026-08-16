import styled from 'styled-components';

import { FlowSubtitle, FlowTitle } from '@/components/common/FlowTitle';
import PageFrame from '@/components/layout/PageFrame';
import { COLORS } from '@/constants/colors';

export const Page = styled(PageFrame)`
  display: flex;
  min-height: 100svh;
  flex-direction: column;
  padding: 0 14px 14px;
  background: ${COLORS.background.main};
`;

export const Content = styled.main`
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  padding-top: clamp(140px, 27svh, 216px);
  text-align: center;
`;

export const Popo = styled.img`
  width: 135px;
  height: 179px;
  object-fit: contain;
`;

export const Title = styled(FlowTitle)`
  margin-top: 22px;
`;

export const Description = styled(FlowSubtitle)`
  margin-top: 4px;
`;

export const ActionArea = styled.div`
  width: 100%;
`;
