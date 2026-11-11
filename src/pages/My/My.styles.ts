import styled from 'styled-components';

import { COLORS } from '@/constants/colors';
import { FONT_SIZE, FONT_WEIGHT, RADIUS } from '@/constants/typography';

export const Page = styled.div`
  display: flex;
  flex-direction: column;
  height: 100svh;
  background-color: ${COLORS.background.main};
`;

export const Content = styled.div`
  flex: 1;
  min-height: 0;
  padding: 0 16px 16px;
  overflow-y: auto;
`;

export const ShopCard = styled.div`
  padding: 16px 15px;
  border-radius: ${RADIUS.panel};
  background-color: ${COLORS.brand.soft};
`;

export const ShopRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 11px;
`;

export const ShopText = styled.div`
  flex: 1;
  min-width: 0;
`;

export const EditButton = styled.button`
  flex-shrink: 0;
  padding: 5px 11px;
  border-radius: 999px;
  background-color: ${COLORS.background.main};
  color: ${COLORS.brand.main};
  font-size: ${FONT_SIZE.label};
  font-weight: ${FONT_WEIGHT.medium};
`;

export const Avatar = styled.span`
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 42px;
  height: 42px;
  border-radius: ${RADIUS.round};
  background-color: ${COLORS.brand.main};
  color: ${COLORS.text.inverse};
  font-size: ${FONT_SIZE.title};
  font-weight: ${FONT_WEIGHT.medium};
`;

export const ShopName = styled.p`
  color: ${COLORS.text.main};
  font-size: ${FONT_SIZE.bodyLarge};
  font-weight: ${FONT_WEIGHT.medium};
`;

export const ShopDescription = styled.p`
  margin-top: 2px;
  color: ${COLORS.text.grey};
  font-size: ${FONT_SIZE.label};
  line-height: 1.5;
`;

export const Counts = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 14px;
`;

export const CountBox = styled.div`
  flex: 1;
  padding: 10px 12px;
  border-radius: ${RADIUS.chip};
  background-color: ${COLORS.background.main};
`;

export const CountValue = styled.p`
  color: ${COLORS.text.main};
  font-size: ${FONT_SIZE.display};
  font-weight: ${FONT_WEIGHT.medium};
`;

export const CountLabel = styled.p`
  margin-top: 1px;
  color: ${COLORS.text.muted};
  font-size: ${FONT_SIZE.label};
`;

export const SectionTitle = styled.p`
  margin: 22px 0 7px;
  color: ${COLORS.text.muted};
  font-size: ${FONT_SIZE.label};
`;

export const EmptyRow = styled.p`
  padding: 14px 12px;
  border-radius: ${RADIUS.chip};
  background-color: ${COLORS.background.subtle};
  color: ${COLORS.text.muted};
  font-size: ${FONT_SIZE.body};
  text-align: center;
`;

export const Row = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px;
  border-radius: ${RADIUS.chip};
  background-color: ${COLORS.background.subtle};

  & + & {
    margin-top: 7px;
  }
`;

export const RowIcon = styled.span`
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border-radius: 9px;
  background-color: ${COLORS.brand.soft};
  color: ${COLORS.brand.main};

  svg {
    width: 16px;
    height: 16px;
  }
`;

export const RowBody = styled.div`
  flex: 1;
  min-width: 0;
`;

export const RowTitle = styled.p`
  color: ${COLORS.text.main};
  font-size: ${FONT_SIZE.body};
`;

export const RowNote = styled.p`
  margin-top: 1px;
  color: ${COLORS.text.muted};
  font-size: ${FONT_SIZE.label};
`;

export const LinkedMark = styled.span`
  display: flex;
  flex-shrink: 0;
  align-items: center;
  color: ${COLORS.status.published};

  svg {
    width: 15px;
    height: 15px;
  }
`;
