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
  overflow-y: auto;
`;

export const Question = styled.h2`
  padding: 2px 16px 0;
  color: ${COLORS.text.main};
  font-size: ${FONT_SIZE.titleLarge};
  font-weight: ${FONT_WEIGHT.medium};
`;

export const Guide = styled.p`
  padding: 0 16px 14px;
  color: ${COLORS.text.muted};
  font-size: ${FONT_SIZE.body};
`;

export const Lines = styled.ul`
  list-style: none;
`;

export const Row = styled.li<{ $editing: boolean; $dim: boolean }>`
  display: flex;
  gap: 11px;
  padding: 12px 16px;
  background-color: ${({ $editing }) => ($editing ? COLORS.brand.soft : 'transparent')};
  opacity: ${({ $dim }) => ($dim ? 0.4 : 1)};
  transition: opacity 0.18s ease;

  & + & {
    border-top: 0.5px solid ${COLORS.background.subtle};
  }
`;

export const Thumb = styled.div`
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 48px;
  aspect-ratio: 3 / 4;
  border-radius: 9px;
  background-color: ${COLORS.background.subtle};
  color: #b2b3b9;
  overflow: hidden;

  svg {
    width: 16px;
    height: 16px;
  }
`;

export const ThumbImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

export const ThumbVideo = styled.video`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

export const Body = styled.div`
  flex: 1;
  min-width: 0;
`;

export const SceneLabel = styled.p`
  color: ${COLORS.text.muted};
  font-size: ${FONT_SIZE.label};
`;

/** 읽을 때의 자막 한 줄. 누르면 같은 자리에서 입력칸으로 바뀐다. */
export const LineButton = styled.button`
  display: block;
  width: 100%;
  margin-top: 3px;
  color: ${COLORS.text.main};
  font-size: ${FONT_SIZE.bodyLarge};
  line-height: 1.5;
  text-align: left;
`;

export const LineField = styled.div`
  margin-top: 3px;
  padding: 7px 9px;
  border: 1.5px solid ${COLORS.brand.main};
  border-radius: 10px;
  background-color: ${COLORS.background.main};
`;

export const LineInput = styled.textarea`
  display: block;
  width: 100%;
  /* 감싼 칸의 보라색 테두리가 이미 초점을 알린다. 두 겹으로 보이지 않게 지운다. */
  outline: none;
  color: ${COLORS.text.main};
  font-size: ${FONT_SIZE.bodyLarge};
  line-height: 1.5;
  resize: none;
`;

export const Meta = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 5px;
`;

export const Count = styled.span<{ $full: boolean }>`
  color: ${({ $full }) => ($full ? COLORS.status.failed : COLORS.text.muted)};
  font-size: ${FONT_SIZE.label};
`;

export const UndoButton = styled.button`
  display: flex;
  align-items: center;
  gap: 4px;
  color: ${COLORS.brand.main};
  font-size: ${FONT_SIZE.label};

  svg {
    width: 13px;
    height: 13px;
  }
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
  background-color: ${COLORS.brand.main};
  color: ${COLORS.text.inverse};
  font-size: ${FONT_SIZE.bodyLarge};
  font-weight: ${FONT_WEIGHT.medium};
  transition: background-color 0.18s ease;

  &:active {
    transform: scale(0.98);
  }
`;
