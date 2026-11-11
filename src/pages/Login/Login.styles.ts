import styled from 'styled-components';

import { COLORS } from '@/constants/colors';
import { FONT_SIZE, FONT_WEIGHT, RADIUS } from '@/constants/typography';

export const Page = styled.div`
  display: flex;
  flex-direction: column;
  height: 100svh;
  padding: calc(20px + env(safe-area-inset-top)) 20px calc(20px + env(safe-area-inset-bottom));
  background-color: ${COLORS.background.main};
`;

export const Form = styled.form`
  display: flex;
  flex: 1;
  flex-direction: column;
`;

export const Intro = styled.div`
  margin-top: auto;
`;

export const BrandName = styled.h1`
  color: ${COLORS.text.main};
  font-size: ${FONT_SIZE.display};
  font-weight: ${FONT_WEIGHT.medium};
`;

export const Role = styled.p`
  margin-top: 6px;
  color: ${COLORS.text.muted};
  font-size: ${FONT_SIZE.body};
`;

export const Field = styled.div`
  margin-top: 26px;
`;

export const Label = styled.label`
  display: block;
  margin-bottom: 3px;
  color: ${COLORS.text.muted};
  font-size: ${FONT_SIZE.label};
`;

/** 밑줄 한 줄만 둔다. 상자를 두르면 고정 계정 하나짜리 화면이 과해 보인다. */
export const Line = styled.div<{ $wrong: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 9px 0 8px;
  border-bottom: 1px solid
    ${({ $wrong }) => ($wrong ? COLORS.status.failed : COLORS.border.main)};
  transition: border-color 0.18s ease;
`;

export const Input = styled.input`
  flex: 1;
  min-width: 0;
  border: none;
  outline: none;
  background: none;
  color: ${COLORS.text.main};
  font-size: ${FONT_SIZE.bodyLarge};

  &::placeholder {
    color: #b2b3b9;
  }
`;

export const PeekButton = styled.button`
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  color: ${COLORS.text.muted};

  svg {
    width: 17px;
    height: 17px;
  }
`;

export const ErrorText = styled.p`
  margin-top: 7px;
  color: ${COLORS.status.failed};
  font-size: ${FONT_SIZE.label};
`;

export const SubmitButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-height: 52px;
  margin-top: 28px;
  border-radius: ${RADIUS.card};
  background-color: ${({ disabled }) => (disabled ? '#e8e8ec' : COLORS.brand.main)};
  color: ${({ disabled }) => (disabled ? '#b2b3b9' : COLORS.text.inverse)};
  font-size: ${FONT_SIZE.bodyLarge};
  font-weight: ${FONT_WEIGHT.medium};
  transition: background-color 0.18s ease;

  &:not(:disabled):active {
    transform: scale(0.98);
  }
`;

export const FootNote = styled.p`
  margin-top: auto;
  padding-top: 20px;
  color: #b2b3b9;
  font-size: ${FONT_SIZE.caption};
  text-align: center;
`;
