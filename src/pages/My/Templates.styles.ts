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
  display: flex;
  flex: 1;
  min-height: 0;
  flex-direction: column;
  padding: 0 16px 16px;
  overflow-y: auto;
`;

export const Guide = styled.p`
  padding: 2px 0 14px;
  color: ${COLORS.text.muted};
  font-size: ${FONT_SIZE.body};
`;

export const List = styled.ul`
  list-style: none;
`;

export const Item = styled.li`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 13px 14px;
  border-radius: ${RADIUS.chip};
  background-color: ${COLORS.background.subtle};

  & + & {
    margin-top: 8px;
  }
`;

export const TemplateName = styled.p`
  color: ${COLORS.text.main};
  font-size: ${FONT_SIZE.bodyLarge};
  font-weight: ${FONT_WEIGHT.medium};
`;

export const TemplateMenus = styled.p`
  margin-top: 2px;
  color: ${COLORS.text.muted};
  font-size: ${FONT_SIZE.label};
`;

export const RemoveButton = styled.button`
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  margin-right: -10px;
  color: ${COLORS.text.muted};

  svg {
    width: 18px;
    height: 18px;
  }
`;

export const EmptyWrap = styled.div`
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
`;

export const EmptyText = styled.p`
  color: ${COLORS.text.grey};
  font-size: ${FONT_SIZE.bodyLarge};
  line-height: 1.7;
  text-align: center;
`;
