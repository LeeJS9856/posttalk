import styled from 'styled-components';

import Button from '@/components/common/Button';
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

export const AdContent = styled.p`
  margin-top: 26px;
  color: ${COLORS.black700};
  font-size: ${FONT_SIZE.body};
  line-height: 1.35;
  white-space: pre-line;
`;

export const ActionArea = styled.footer`
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 8px;
  padding: 12px 20px 14px;
  border-top: 1px solid ${COLORS.black200};
  background: ${COLORS.background.main};
`;

export const RejectButton = styled(Button)`
  border: 1px solid ${COLORS.black400};
  border-radius: 10px;
  color: ${COLORS.black500};
  background: ${COLORS.white};
  box-shadow: 0 2px 5px rgba(33, 33, 33, 0.12);

  &:hover {
    background: ${COLORS.white};
  }
`;

export const ApproveButton = styled(Button)`
  border-radius: 10px;
  background: ${COLORS.primary700};
  box-shadow: 0 3px 8px rgba(33, 33, 33, 0.18);
`;
