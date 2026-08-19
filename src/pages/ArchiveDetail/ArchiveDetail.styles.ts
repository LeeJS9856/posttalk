import styled from 'styled-components';

import PageFrame from '@/components/layout/PageFrame';
import { COLORS } from '@/constants/colors';
import { FONT_SIZE } from '@/constants/typography';

export const Page = styled(PageFrame)`
  display: flex;
  min-height: 100svh;
  flex-direction: column;
  background: ${COLORS.background.main};
`;

export const Content = styled.main`
  flex: 1;
  padding: 4px 20px 24px;
`;

export const Meta = styled.div`
  display: flex;
  align-items: baseline;
  gap: 12px;
  margin-bottom: 16px;
`;

export const Title = styled.h1`
  color: ${COLORS.black700};
  font-size: ${FONT_SIZE.title};
  font-weight: 700;
`;

export const Date = styled.time`
  color: ${COLORS.black400};
  font-size: ${FONT_SIZE.label};
`;

export const Format = styled.p`
  margin-bottom: 12px;
  color: ${COLORS.black500};
  font-size: ${FONT_SIZE.label};
`;

export const PreviewImage = styled.img`
  display: block;
  width: 100%;
  max-height: 70svh;
  object-fit: contain;
`;

export const AdContent = styled.p`
  margin-top: 26px;
  color: ${COLORS.black700};
  font-size: ${FONT_SIZE.body};
  line-height: 1.35;
  white-space: pre-line;
`;

export const EmptyMessage = styled.p`
  padding: 72px 0;
  color: ${COLORS.black500};
  font-size: ${FONT_SIZE.body};
  text-align: center;
`;
