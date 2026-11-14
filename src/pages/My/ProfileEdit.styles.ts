import styled from 'styled-components';

import { COLORS } from '@/constants/colors';
import { FONT_SIZE, FONT_WEIGHT, RADIUS } from '@/constants/typography';

export const Page = styled.div`
  display: flex;
  flex-direction: column;
  height: 100svh;
  background-color: ${COLORS.background.main};
`;

export const Form = styled.form`
  display: flex;
  flex: 1;
  min-height: 0;
  flex-direction: column;
  padding: 0 16px;
  overflow-y: auto;
`;

export const Avatar = styled.span`
  display: flex;
  align-self: center;
  align-items: center;
  justify-content: center;
  width: 62px;
  height: 62px;
  margin: 6px 0 22px;
  border-radius: ${RADIUS.round};
  background-color: ${COLORS.brand.main};
  color: ${COLORS.text.inverse};
  font-size: ${FONT_SIZE.display};
  font-weight: ${FONT_WEIGHT.medium};
`;

export const Field = styled.div`
  & + & {
    margin-top: 20px;
  }
`;

export const Label = styled.label`
  display: block;
  margin-bottom: 2px;
  color: ${COLORS.text.muted};
  font-size: ${FONT_SIZE.label};
`;

/** 밑줄 한 줄. 로그인 화면과 같은 입력 모양을 쓴다. */
export const Line = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 9px 0 8px;
  border-bottom: 1px solid ${COLORS.border.main};
  color: ${COLORS.text.muted};

  svg {
    width: 15px;
    height: 15px;
  }
`;

const fieldText = `
  flex: 1;
  min-width: 0;
  border: none;
  outline: none;
  background: none;
  font-size: ${FONT_SIZE.bodyLarge};
  line-height: 1.6;
`;

export const TextInput = styled.input`
  ${fieldText}
  color: ${COLORS.text.main};

  &::placeholder {
    color: #b2b3b9;
  }
`;

export const TextArea = styled.textarea`
  ${fieldText}
  color: ${COLORS.text.main};
  resize: none;

  &::placeholder {
    color: #b2b3b9;
  }
`;

export const LockedValue = styled.span`
  flex: 1;
  min-width: 0;
  color: ${COLORS.text.muted};
  font-size: ${FONT_SIZE.bodyLarge};
`;

export const LockedNote = styled.p`
  margin-top: 6px;
  color: ${COLORS.text.muted};
  font-size: ${FONT_SIZE.label};
`;

export const Count = styled.p<{ $full: boolean }>`
  margin-top: 6px;
  color: ${({ $full }) => ($full ? COLORS.status.failed : COLORS.text.muted)};
  font-size: ${FONT_SIZE.label};
  text-align: right;
`;

export const Footer = styled.div`
  margin-top: auto;
  padding: 24px 0 calc(16px + env(safe-area-inset-bottom));
`;

export const SaveButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-height: 52px;
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
