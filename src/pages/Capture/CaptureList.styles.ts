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

export const TitleRow = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  padding: 2px 16px 0;
`;

export const Title = styled.h2`
  color: ${COLORS.text.main};
  font-size: ${FONT_SIZE.titleLarge};
  font-weight: ${FONT_WEIGHT.medium};
`;

export const Progress = styled.span`
  color: ${COLORS.text.muted};
  font-size: ${FONT_SIZE.label};
`;

export const Track = styled.div`
  height: 3px;
  margin: 12px 16px 20px;
  border-radius: 2px;
  background-color: ${COLORS.border.main};
  overflow: hidden;
`;

export const Bar = styled.div<{ $ratio: number }>`
  width: 100%;
  height: 100%;
  border-radius: 2px;
  background-color: ${COLORS.brand.main};
  transform: scaleX(${({ $ratio }) => $ratio});
  transform-origin: left center;
  transition: transform 0.3s cubic-bezier(0.2, 0.85, 0.25, 1);
`;

export const Grid = styled.ul`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  padding: 0 16px 16px;
  list-style: none;
`;

export const SlotButton = styled.button`
  display: block;
  width: 100%;
  text-align: left;
`;

export const SlotFrame = styled.div<{ $next: boolean; $filled: boolean }>`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 5px;
  aspect-ratio: 3 / 4;
  border: ${({ $next, $filled }) =>
    $filled ? 'none' : $next ? `1.5px solid ${COLORS.brand.main}` : 'none'};
  border-radius: 12px;
  background-color: ${({ $next, $filled }) =>
    $filled ? COLORS.background.subtle : $next ? COLORS.brand.soft : COLORS.background.subtle};
  color: ${({ $next }) => ($next ? COLORS.brand.main : '#b2b3b9')};
  overflow: hidden;

  svg {
    width: 21px;
    height: 21px;
  }
`;

export const SlotImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

export const SlotVideo = styled.video`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

export const SlotBadge = styled.span`
  position: absolute;
  top: 6px;
  right: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: ${COLORS.brand.main};
  color: ${COLORS.text.inverse};

  svg {
    width: 12px;
    height: 12px;
  }
`;

export const SlotAction = styled.span`
  font-size: ${FONT_SIZE.caption};
  font-weight: ${FONT_WEIGHT.medium};
`;

export const SlotLabel = styled.p<{ $done: boolean }>`
  margin-top: 7px;
  color: ${({ $done }) => ($done ? COLORS.text.main : COLORS.text.muted)};
  font-size: ${FONT_SIZE.label};
  font-weight: ${({ $done }) => ($done ? FONT_WEIGHT.medium : FONT_WEIGHT.regular)};
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
  transition: background-color 0.18s ease;

  &:not(:disabled):active {
    transform: scale(0.98);
  }
`;
