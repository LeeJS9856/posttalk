import styled from 'styled-components';

import PageFrame from '@/components/layout/PageFrame';
import { COLORS } from '@/constants/colors';
import { FONT_SIZE } from '@/constants/typography';

export const Page = styled(PageFrame)`
  display: flex;
  min-height: 100svh;
  flex-direction: column;
  gap: 0;
  padding-bottom: 24px;
  background: ${COLORS.background.main};
`;

export const Content = styled.main`
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  padding: clamp(42px, 8svh, 72px) 24px 0;
  text-align: center;
`;

export const Popo = styled.img`
  width: 57px;
  height: 54px;
`;

export const TitleArea = styled.section`
  margin-top: 18px;

  p {
    margin-top: 4px;
  }
`;

export const QuestionCount = styled.p`
  margin-bottom: 6px;
  color: ${COLORS.primary};
  font-size: ${FONT_SIZE.label};
  font-weight: 700;
`;

export const MicButton = styled.button<{ $recording: boolean }>`
  display: grid;
  width: 76px;
  height: 76px;
  margin-top: 34px;
  place-items: center;
  border: 0;
  border-radius: 50%;
  color: ${COLORS.white};
  background: ${({ $recording }) => ($recording ? COLORS.statusWarning : COLORS.primary700)};
  box-shadow: 0 8px 18px rgba(69, 67, 121, 0.22);

  svg {
    width: 34px;
    height: 34px;
  }
`;

export const RecordStatus = styled.p`
  min-height: 22px;
  margin-top: 12px;
  color: ${COLORS.black500};
  font-size: ${FONT_SIZE.body};
  line-height: 1.45;
`;

export const AnswerField = styled.textarea`
  width: 100%;
  min-height: 116px;
  margin-top: 22px;
  resize: none;
  border: 1px solid ${COLORS.black200};
  border-radius: 14px;
  padding: 14px;
  color: ${COLORS.black700};
  background: ${COLORS.white};
  box-shadow: 0 4px 14px rgba(33, 33, 33, 0.08);
  font-size: ${FONT_SIZE.bodyLarge};
  line-height: 1.5;

  &::placeholder {
    color: ${COLORS.black400};
  }

  &:focus {
    outline: 2px solid ${COLORS.primary200};
    border-color: ${COLORS.primary};
  }
`;

export const AnswerHint = styled.p`
  width: 100%;
  min-height: 22px;
  margin-top: 8px;
  color: ${COLORS.black500};
  font-size: ${FONT_SIZE.label};
  line-height: 1.45;
  text-align: left;
`;

export const ActionArea = styled.div`
  margin-top: auto;
  padding: 0 24px;
`;
