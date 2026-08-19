import styled from 'styled-components';

import Button from '@/components/common/Button';
import { FlowSubtitle, FlowTitle } from '@/components/common/FlowTitle';
import PageFrame from '@/components/layout/PageFrame';
import { COLORS } from '@/constants/colors';
import { FONT_SIZE } from '@/constants/typography';

export const Page = styled(PageFrame)`
  display: flex;
  height: 100svh;
  flex-direction: column;
  overflow: hidden;
  background: ${COLORS.background.main};
`;

export const ScrollableContent = styled.main`
  flex: 1;
  overflow-y: auto;
  overscroll-behavior: contain;
  padding-bottom: 94px;
`;

export const TitleArea = styled.header`
  padding: 58px 24px 18px;
  text-align: center;
`;

export const Title = styled(FlowTitle)``;

export const Description = styled(FlowSubtitle)`
  margin-top: 2px;
`;

export const FeedbackArea = styled.section`
  position: relative;
  display: flex;
  flex: 1;
  align-items: center;
  min-height: 108px;
  padding: 20px 24px;
`;

export const Feedback = styled.p`
  width: calc(100% - 26px);
  padding: 10px 12px;
  border: 1px solid ${COLORS.black200};
  border-radius: 12px 12px 3px 12px;
  color: ${COLORS.black500};
  background: ${COLORS.white};
  box-shadow: 0 3px 8px rgba(33, 33, 33, 0.06);
  font-size: ${FONT_SIZE.body};
  line-height: 1.45;
  white-space: pre-wrap;
`;

export const Popo = styled.img`
  position: absolute;
  right: -4px;
  bottom: 0;
  width: 46px;
  height: 103px;
`;

export const ActionArea = styled.div`
  position: fixed;
  z-index: 2;
  bottom: 0;
  width: min(100%, 480px);
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 8px;
  padding: 12px 14px 14px;
  background: ${COLORS.background.main};
`;

export const EmptyPreview = styled.p`
  margin: 24px;
  padding: 40px 20px;
  color: ${COLORS.black500};
  background: ${COLORS.primary100};
  text-align: center;
`;

export const RemakeButton = styled(Button)`
  border: 1px solid ${COLORS.black400};
  border-radius: 10px;
  padding: 14px 10px;
  color: ${COLORS.black500};
  background: ${COLORS.white};
  box-shadow: 0 2px 5px rgba(33, 33, 33, 0.12);
  font-size: ${FONT_SIZE.body};
  font-weight: 700;

  &:hover {
    background: ${COLORS.white};
  }
`;
