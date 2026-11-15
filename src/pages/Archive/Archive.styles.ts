import styled from 'styled-components';

import { COLORS } from '@/constants/colors';
import { FONT_SIZE, FONT_WEIGHT, RADIUS } from '@/constants/typography';

export const Page = styled.div`
  display: flex;
  flex-direction: column;
  height: 100svh;
  background-color: ${COLORS.background.main};
`;

/* 머리 제목. 옆에 전체 개수를 옅게 붙인다. */
export const Title = styled.span`
  display: inline-flex;
  align-items: baseline;
  gap: 6px;
`;

export const TitleCount = styled.span`
  color: ${COLORS.text.muted};
  font-size: ${FONT_SIZE.titleSmall};
  font-weight: ${FONT_WEIGHT.semibold};
`;

export const CreateButton = styled.button`
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  margin-right: -10px;
  color: ${COLORS.brand.main};

  svg {
    width: 24px;
    height: 24px;
    stroke-width: 2.2;
  }
`;

/** 형식 탭. 고른 탭은 아래 굵은 선으로 표시한다. */
export const TabList = styled.div`
  display: grid;
  flex-shrink: 0;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  border-bottom: 1px solid ${COLORS.border.main};
`;

export const Tab = styled.button<{ $on: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  min-height: 48px;
  margin-bottom: -1px;
  border-bottom: 2px solid ${({ $on }) => ($on ? COLORS.text.main : 'transparent')};
  color: ${({ $on }) => ($on ? COLORS.text.main : COLORS.text.muted)};
  font-size: ${FONT_SIZE.body};
  font-weight: ${({ $on }) => ($on ? FONT_WEIGHT.bold : FONT_WEIGHT.semibold)};
  transition: color 0.18s ease;

  svg {
    width: 16px;
    height: 16px;
  }
`;

/** 탭 아래로는 칩과 격자가 함께 스크롤된다. */
export const Scroll = styled.div`
  flex: 1;
  min-height: 0;
  overflow-y: auto;
`;

export const FilterRail = styled.div`
  display: flex;
  gap: 8px;
  padding: 12px 16px;
  overflow-x: auto;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
`;

/* 상태 칩. 색으로 상태를 칠하지 않고, 고른 칩만 진하게 채운다. */
export const FilterChip = styled.button<{ $on: boolean }>`
  flex-shrink: 0;
  min-height: 36px;
  padding: 0 14px;
  border: 1px solid ${({ $on }) => ($on ? COLORS.text.main : COLORS.border.strong)};
  border-radius: 999px;
  background-color: ${({ $on }) => ($on ? COLORS.text.main : COLORS.background.main)};
  color: ${({ $on }) => ($on ? COLORS.text.inverse : COLORS.text.grey)};
  font-size: ${FONT_SIZE.label};
  font-weight: ${({ $on }) => ($on ? FONT_WEIGHT.bold : FONT_WEIGHT.semibold)};
  white-space: nowrap;
  transition:
    background-color 0.18s ease,
    border-color 0.18s ease;
`;

/** 세 칸 사진 격자. 간격은 2px 로 좁혀 사진이 주인공이 되게 한다. */
export const Grid = styled.ul`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 2px;
  list-style: none;
`;

export const Tile = styled.button`
  position: relative;
  display: block;
  width: 100%;
  aspect-ratio: 4 / 5;
  overflow: hidden;
  background-color: ${COLORS.background.subtle};

  img,
  video {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  &:active img {
    opacity: 0.85;
  }
`;

export const PlayBadge = styled.span`
  position: absolute;
  top: 6px;
  right: 6px;
  display: flex;
  color: ${COLORS.white};
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.4));

  svg {
    width: 16px;
    height: 16px;
  }
`;

/* 할 일이 남은 광고에만 얹는 글. 사진 속 글씨와 섞이지 않게 어두운 막 위에 둔다. */
export const StatusChip = styled.span`
  position: absolute;
  bottom: 6px;
  left: 6px;
  padding: 2px 8px;
  border-radius: 999px;
  background-color: ${COLORS.overlay};
  color: ${COLORS.white};
  font-size: ${FONT_SIZE.caption};
  font-weight: ${FONT_WEIGHT.semibold};
  line-height: 1.4;
`;

/** 필터를 걸었는데 남는 게 없을 때. 아예 비어 있는 것과 다른 말을 한다. */
export const NoMatch = styled.p`
  padding: 40px 24px;
  color: ${COLORS.text.muted};
  font-size: ${FONT_SIZE.bodyLarge};
  line-height: 1.7;
  text-align: center;
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
  color: ${COLORS.text.muted};

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
  font-weight: ${FONT_WEIGHT.semibold};
`;

export const RetryButton = styled.button`
  min-height: 44px;
  padding: 0 18px;
  border-radius: 999px;
  background-color: ${COLORS.background.subtle};
  color: ${COLORS.text.main};
  font-size: ${FONT_SIZE.body};
  font-weight: ${FONT_WEIGHT.semibold};
`;
