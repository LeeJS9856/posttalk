import styled from 'styled-components';

import { COLORS } from '@/constants/colors';
import { FONT_SIZE, FONT_WEIGHT, RADIUS } from '@/constants/typography';

export const Page = styled.div`
  display: flex;
  flex-direction: column;
  height: 100svh;
  background-color: ${COLORS.background.main};
`;

export const Header = styled.header`
  flex-shrink: 0;
  padding: calc(14px + env(safe-area-inset-top)) 16px 12px;
`;

export const Title = styled.h1`
  color: ${COLORS.text.main};
  font-size: ${FONT_SIZE.titleLarge};
  font-weight: ${FONT_WEIGHT.medium};
`;

export const ChipRail = styled.div`
  display: flex;
  flex-shrink: 0;
  gap: 6px;
  padding: 0 16px 14px;
  overflow-x: auto;
  scroll-padding-left: 16px;
`;

export const Chip = styled.button<{ $on: boolean }>`
  flex-shrink: 0;
  padding: 7px 13px;
  border-radius: 999px;
  background-color: ${({ $on }) => ($on ? COLORS.brand.main : COLORS.background.subtle)};
  color: ${({ $on }) => ($on ? COLORS.text.inverse : COLORS.text.grey)};
  font-size: ${FONT_SIZE.body};
  font-weight: ${({ $on }) => ($on ? FONT_WEIGHT.medium : FONT_WEIGHT.regular)};
  white-space: nowrap;
  transition: background-color 0.18s ease;
`;

export const List = styled.ul`
  flex: 1;
  min-height: 0;
  padding: 0 16px 16px;
  list-style: none;
  overflow-y: auto;
`;

export const Item = styled.li`
  & + & {
    margin-top: 20px;
  }
`;

export const AdButton = styled.button`
  display: block;
  width: 100%;
  text-align: left;
`;

/**
 * 한 줄에 하나씩. 카드뉴스와 릴스가 같은 비율로 서야 목록 리듬이 흐트러지지 않는다.
 * 릴스는 세로가 더 길어 가운데가 잘린다.
 */
export const Frame = styled.div`
  position: relative;
  aspect-ratio: 4 / 5;
  border-radius: ${RADIUS.panel};
  background-color: ${COLORS.background.subtle};
  overflow: hidden;
`;

export const FrameImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

export const FrameVideo = styled.video`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

export const FormatBadge = styled.span`
  position: absolute;
  top: 10px;
  left: 10px;
  padding: 3px 9px;
  border-radius: 999px;
  background-color: ${COLORS.scrim};
  color: ${COLORS.text.inverse};
  font-size: ${FONT_SIZE.label};
`;

export const PlayMark = styled.span`
  position: absolute;
  top: 50%;
  left: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 46px;
  height: 46px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.88);
  color: ${COLORS.text.main};
  transform: translate(-50%, -50%);

  svg {
    width: 18px;
    height: 18px;
  }
`;

export const Caption = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 10px;
  margin-top: 9px;
`;

export const AdTitle = styled.p`
  color: ${COLORS.text.main};
  font-size: ${FONT_SIZE.bodyLarge};
  font-weight: ${FONT_WEIGHT.medium};
`;

export const AdStatusText = styled.p<{ $pending: boolean }>`
  flex-shrink: 0;
  color: ${({ $pending }) => ($pending ? COLORS.status.unpublished : COLORS.text.muted)};
  font-size: ${FONT_SIZE.label};
`;

export const EmptyWrap = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  padding: 0 24px;
`;

export const EmptyMark = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: ${RADIUS.chip};
  background-color: ${COLORS.background.subtle};
  color: #b2b3b9;

  svg {
    width: 21px;
    height: 21px;
  }
`;

export const EmptyText = styled.p`
  color: ${COLORS.text.grey};
  font-size: ${FONT_SIZE.bodyLarge};
  line-height: 1.7;
  text-align: center;
`;

export const EmptyAction = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 48px;
  padding: 0 20px;
  border-radius: ${RADIUS.card};
  background-color: ${COLORS.brand.main};
  color: ${COLORS.text.inverse};
  font-size: ${FONT_SIZE.bodyLarge};
  font-weight: ${FONT_WEIGHT.medium};
`;
