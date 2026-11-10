import styled, { keyframes } from 'styled-components';

import { COLORS } from '@/constants/colors';
import { FONT_SIZE, FONT_WEIGHT, RADIUS } from '@/constants/typography';

export const Page = styled.div`
  display: flex;
  flex-direction: column;
  height: 100svh;
  padding: calc(18px + env(safe-area-inset-top)) 16px calc(20px + env(safe-area-inset-bottom));
  background-color: ${COLORS.background.main};
`;

/** 올린 재료를 한 장씩 넘겨 보여준다. 기다리는 동안 볼 것을 준다. */
export const Frame = styled.div`
  position: relative;
  /* 비율을 고정하면 세로가 짧은 기기에서 아래 단계가 잘린다. 남는 만큼만 차지한다. */
  flex: 1;
  min-height: 140px;
  border-radius: ${RADIUS.panel};
  background-color: ${COLORS.background.subtle};
  overflow: hidden;
`;

export const Slide = styled.div<{ $shown: boolean }>`
  position: absolute;
  inset: 0;
  opacity: ${({ $shown }) => ($shown ? 1 : 0)};
  transition: opacity 0.6s ease;
`;

export const SlideImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

export const SlideVideo = styled.video`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

export const Dots = styled.div`
  position: absolute;
  right: 0;
  bottom: 10px;
  left: 0;
  display: flex;
  gap: 4px;
  justify-content: center;
`;

export const Dot = styled.span<{ $on: boolean }>`
  width: 14px;
  height: 2.5px;
  border-radius: 2px;
  background-color: ${({ $on }) => ($on ? COLORS.brand.main : COLORS.border.strong)};
  transition: background-color 0.3s ease;
`;

export const Heading = styled.h2`
  margin-top: 20px;
  color: ${COLORS.text.main};
  font-size: ${FONT_SIZE.titleLarge};
  font-weight: ${FONT_WEIGHT.medium};
  line-height: 1.45;
`;

export const Note = styled.p`
  margin-top: 6px;
  color: ${COLORS.text.muted};
  font-size: ${FONT_SIZE.body};
`;

export const Steps = styled.ul`
  margin-top: 20px;
  list-style: none;
`;

export const Step = styled.li<{ $done: boolean; $active: boolean }>`
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 11px 12px;
  border-radius: ${RADIUS.chip};
  background-color: ${({ $active }) => ($active ? COLORS.brand.soft : COLORS.background.subtle)};
  color: ${({ $done, $active }) =>
    $done || $active ? COLORS.text.main : COLORS.text.muted};
  font-size: ${FONT_SIZE.bodyLarge};

  & + & {
    margin-top: 7px;
  }
`;

export const StepMark = styled.span`
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  color: ${COLORS.brand.main};

  svg {
    width: 15px;
    height: 15px;
  }
`;

const spin = keyframes`
  to { transform: rotate(360deg); }
`;

/** transform 만 쓴다. 촬영 직후라 기기가 더워져 있다. */
export const Spinner = styled.span`
  width: 14px;
  height: 14px;
  border: 2px solid ${COLORS.border.main};
  border-top-color: ${COLORS.brand.main};
  border-radius: 50%;
  animation: ${spin} 0.8s linear infinite;
`;

export const EmptyWrap = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
`;

export const EmptyText = styled.p`
  color: ${COLORS.text.grey};
  font-size: ${FONT_SIZE.bodyLarge};
  line-height: 1.7;
  text-align: center;
`;

export const BackButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 48px;
  padding: 0 20px;
  border: 1.5px solid ${COLORS.border.strong};
  border-radius: ${RADIUS.card};
  color: ${COLORS.text.main};
  font-size: ${FONT_SIZE.bodyLarge};
  font-weight: ${FONT_WEIGHT.medium};
`;
