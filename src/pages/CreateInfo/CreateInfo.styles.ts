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
  padding-bottom: 8px;
  overflow-y: auto;
`;

export const Question = styled.h2`
  padding: 2px 16px 18px;
  color: ${COLORS.text.main};
  font-size: ${FONT_SIZE.titleLarge};
  font-weight: ${FONT_WEIGHT.medium};
`;

/** 섹션 라벨. 입력란과 섞이지 않게 작고 흐리게 둔다. */
export const Label = styled.p`
  padding: 0 16px 7px;
  color: ${COLORS.text.muted};
  font-size: ${FONT_SIZE.caption};
  letter-spacing: 0.03em;
`;

export const LabelRow = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  padding: 0 16px 7px;
`;

export const Counter = styled.span`
  color: ${COLORS.text.muted};
  font-size: ${FONT_SIZE.caption};
`;

export const ChipRail = styled.div`
  display: flex;
  gap: 6px;
  padding: 0 16px 20px;
  overflow-x: auto;
  scroll-padding-left: 16px;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
`;

export const Chip = styled.button<{ $selected: boolean }>`
  display: flex;
  flex: 0 0 auto;
  align-items: center;
  gap: 6px;
  min-height: 36px;
  padding: 0 12px 0 7px;
  border: 1px solid ${({ $selected }) => ($selected ? COLORS.brand.main : COLORS.border.main)};
  border-radius: 18px;
  background-color: ${({ $selected }) => ($selected ? COLORS.brand.main : 'transparent')};
  color: ${({ $selected }) => ($selected ? COLORS.text.inverse : COLORS.text.main)};
  font-size: ${FONT_SIZE.body};
  font-weight: ${({ $selected }) => ($selected ? FONT_WEIGHT.medium : FONT_WEIGHT.regular)};
  transition:
    background-color 0.18s ease,
    border-color 0.18s ease,
    color 0.18s ease;
`;

export const ChipAvatar = styled.span<{ $selected: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background-color: ${({ $selected }) => ($selected ? 'rgba(255, 255, 255, 0.25)' : COLORS.background.subtle)};
  color: ${({ $selected }) => ($selected ? COLORS.text.inverse : COLORS.text.grey)};
  font-size: ${FONT_SIZE.caption};
  font-weight: ${FONT_WEIGHT.medium};
`;

export const ChipCount = styled.span<{ $selected: boolean }>`
  color: ${({ $selected }) => ($selected ? 'rgba(255, 255, 255, 0.7)' : COLORS.text.muted)};
  font-size: ${FONT_SIZE.caption};
`;

/** 손댈 수 있는 곳은 전부 같은 회색 박스로 둔다. */
const Field = styled.div`
  margin: 0 16px 18px;
  padding: 11px 12px;
  border-radius: 12px;
  background-color: #f5f5f7;
`;

export const StoreField = styled(Field)`
  min-height: 58px;
`;

export const NameField = styled(Field)`
  margin-bottom: 0;
`;

export const TextArea = styled.textarea`
  display: block;
  width: 100%;
  border: none;
  background: none;
  color: ${COLORS.text.main};
  font-size: ${FONT_SIZE.body};
  line-height: 1.55;
  resize: none;
  field-sizing: content;

  &::placeholder {
    color: #b9bac0;
  }

  &:focus {
    outline: none;
  }
`;

export const MenuRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 8px;
  margin: 0 16px 8px;
  padding: 10px 12px;
  border-radius: 12px;
  background-color: #f5f5f7;
`;

export const MenuFields = styled.div`
  flex: 1;
  min-width: 0;
`;

export const MenuNameInput = styled.input`
  display: block;
  width: 100%;
  border: none;
  background: none;
  color: ${COLORS.text.main};
  font-size: ${FONT_SIZE.body};
  font-weight: ${FONT_WEIGHT.medium};

  &::placeholder {
    color: #b9bac0;
  }

  &:focus {
    outline: none;
  }
`;

export const MenuDescriptionInput = styled.input`
  display: block;
  width: 100%;
  margin-top: 2px;
  border: none;
  background: none;
  color: ${COLORS.text.grey};
  font-size: ${FONT_SIZE.label};

  &::placeholder {
    color: #b9bac0;
  }

  &:focus {
    outline: none;
  }
`;

export const RemoveButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  color: #b2b3b9;

  svg {
    width: 15px;
    height: 15px;
  }
`;

export const AddMenuButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  width: calc(100% - 32px);
  min-height: 46px;
  margin: 0 16px;
  border: 1px dashed #d6d2e4;
  border-radius: 12px;
  color: ${COLORS.brand.main};
  font-size: ${FONT_SIZE.body};
  font-weight: ${FONT_WEIGHT.medium};

  svg {
    width: 16px;
    height: 16px;
  }
`;

export const SaveRow = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  min-height: 48px;
  padding: 0 16px;
  margin-top: 6px;
  text-align: left;
`;

export const CheckBox = styled.span<{ $checked: boolean }>`
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  border: 1.5px solid ${({ $checked }) => ($checked ? COLORS.brand.main : COLORS.border.strong)};
  border-radius: 5px;
  background-color: ${({ $checked }) => ($checked ? COLORS.brand.main : 'transparent')};
  color: ${COLORS.text.inverse};

  svg {
    width: 12px;
    height: 12px;
  }
`;

export const SaveLabel = styled.span<{ $checked: boolean }>`
  color: ${({ $checked }) => ($checked ? COLORS.text.main : COLORS.text.muted)};
  font-size: ${FONT_SIZE.label};
`;

export const Footer = styled.div`
  flex-shrink: 0;
  padding: 14px 16px calc(14px + env(safe-area-inset-bottom));
  border-top: 0.5px solid ${COLORS.border.main};
  background-color: ${COLORS.background.main};
`;

export const NextButton = styled.button`
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
  transition:
    background-color 0.18s ease,
    transform 0.18s cubic-bezier(0.2, 0.85, 0.25, 1);

  &:not(:disabled):active {
    transform: scale(0.98);
  }
`;
