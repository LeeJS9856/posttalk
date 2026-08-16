import styled from 'styled-components';

import PageFrame from '@/components/layout/PageFrame';
import { COLORS } from '@/constants/colors';
import { FONT_SIZE } from '@/constants/typography';

export const Page = styled(PageFrame)`
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100svh;
  padding-bottom: 80px;
  overflow: hidden;
  background: ${COLORS.background.main};
`;

export const TopContent = styled.header`
  flex: 0 0 auto;
  padding: 30px 24px 20px;
`;

export const Title = styled.h1`
  color: ${COLORS.black700};
  font-size: ${FONT_SIZE.titleLarge};
  font-weight: 700;
  line-height: 1.42;
  letter-spacing: -0.55px;
`;

export const Guide = styled.section`
  display: flex;
  flex: 1;
  flex-direction: column;
  padding: 16px 24px;
  text-align: center;
`;

export const GuideTitle = styled.h2`
  color: ${COLORS.black700};
  font-size: ${FONT_SIZE.bodyLarge};
  font-weight: 700;
  line-height: 1.45;
`;

export const GuideDescription = styled.p`
  margin-top: 2px;
  color: ${COLORS.black500};
  font-size: ${FONT_SIZE.body};
  font-weight: 400;
  line-height: 1.45;
`;

export const ActionArea = styled.div`
  margin-top: auto;
`;
