import styled from 'styled-components';

import { FlowTitle } from '@/components/common/FlowTitle';
import PageFrame from '@/components/layout/PageFrame';
import { COLORS } from '@/constants/colors';

export const Page = styled(PageFrame)`
  position: relative;
  display: flex;
  flex-direction: column;
  padding-bottom: 24px;
  background: ${COLORS.background.main};
`;

export const Guide = styled.section`
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  padding: clamp(56px, 12svh, 104px) 24px 0;
  text-align: center;
`;

export const Popo = styled.img`
  width: 57px;
  height: 54px;
`;

export const GuideCopy = styled(FlowTitle)`
  margin-top: 20px;
`;

export const ExampleImage = styled.img`
  width: 100%;
  aspect-ratio: 1.2;
  margin-top: 16px;
  object-fit: cover;
`;

export const ActionArea = styled.div`
  margin: auto 24px 0;
`;

export const CameraInput = styled.input`
  display: none;
`;
