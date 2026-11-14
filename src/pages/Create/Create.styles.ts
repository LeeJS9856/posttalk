import styled from 'styled-components';

import { COLORS } from '@/constants/colors';
import { FONT_SIZE, FONT_WEIGHT, RADIUS } from '@/constants/typography';

export const Page = styled.div`
  display: flex;
  flex-direction: column;
  height: 100svh;
  background-color: ${COLORS.background.main};
`;

/** 이 화면은 세로로 스크롤하지 않는다. 미리보기가 남은 높이를 전부 가져간다. */
export const Content = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  min-height: 0;
  overflow: hidden;
`;

export const Question = styled.h2`
  flex-shrink: 0;
  padding: 2px 16px 14px;
  color: ${COLORS.text.main};
  font-size: ${FONT_SIZE.titleLarge};
  font-weight: ${FONT_WEIGHT.medium};
  line-height: 1.35;
`;

export const FormatBar = styled.div`
  flex-shrink: 0;
  padding: 0 16px 18px;
`;

export const ConceptRail = styled.ul`
  display: flex;
  flex: 1;
  gap: 12px;
  min-height: 0;
  padding: 0 16px;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scroll-padding-left: 16px;
  list-style: none;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
`;

export const ConceptItem = styled.li`
  display: flex;
  flex: 0 0 calc(100% - 46px);
  min-height: 0;
  scroll-snap-align: start;
`;

export const ConceptCard = styled.button<{ $selected: boolean }>`
  position: relative;
  display: block;
  overflow: hidden;
  width: 100%;
  min-height: 0;
  padding: 0;
  border-radius: 24px;
  background-color: ${COLORS.background.subtle};
  transition: transform 0.22s cubic-bezier(0.2, 0.85, 0.25, 1);
  transform: scale(${({ $selected }) => ($selected ? 1 : 0.965)});
`;

export const ConceptMedia = styled.div<{ $surface: string }>`
  width: 100%;
  height: 100%;
  background: ${({ $surface }) => $surface};

  img,
  video {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

export const ConceptScrim = styled.span`
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  height: 44%;
  background: linear-gradient(to top, rgba(10, 10, 12, 0.72), rgba(10, 10, 12, 0));
  pointer-events: none;
`;

export const ConceptCaption = styled.span`
  position: absolute;
  bottom: 18px;
  left: 18px;
  text-align: left;
`;

export const ConceptLabel = styled.span`
  display: block;
  color: ${COLORS.white};
  font-size: 22px;
  font-weight: ${FONT_WEIGHT.medium};
  letter-spacing: -0.01em;
`;

export const ConceptDescription = styled.span`
  display: block;
  margin-top: 3px;
  color: rgba(255, 255, 255, 0.78);
  font-size: ${FONT_SIZE.body};
`;

export const Dots = styled.div`
  display: flex;
  flex-shrink: 0;
  justify-content: center;
  gap: 5px;
  padding: 14px 0 4px;
`;

export const Dot = styled.span<{ $active: boolean }>`
  width: ${({ $active }) => ($active ? '14px' : '5px')};
  height: 5px;
  border-radius: 3px;
  background-color: ${({ $active }) => ($active ? COLORS.brand.main : COLORS.border.strong)};
  transition:
    width 0.3s ease,
    background-color 0.3s ease;
`;

export const Footer = styled.div`
  flex-shrink: 0;
  padding: 8px 16px calc(14px + env(safe-area-inset-bottom));
`;

export const NextButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-height: 54px;
  border-radius: ${RADIUS.card};
  background-color: ${COLORS.brand.main};
  color: ${COLORS.text.inverse};
  font-size: ${FONT_SIZE.bodyLarge};
  font-weight: ${FONT_WEIGHT.medium};
  transition: transform 0.18s cubic-bezier(0.2, 0.85, 0.25, 1);

  &:active {
    transform: scale(0.98);
  }
`;
