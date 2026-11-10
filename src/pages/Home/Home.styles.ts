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
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: space-between;
  padding: calc(16px + env(safe-area-inset-top)) 16px 14px;
`;

export const BrandName = styled.span`
  color: ${COLORS.text.main};
  font-size: ${FONT_SIZE.display};
  font-weight: ${FONT_WEIGHT.medium};
  letter-spacing: -0.01em;
`;

export const IconButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  margin-right: -10px;
  color: ${COLORS.text.grey};

  svg {
    width: 20px;
    height: 20px;
  }
`;

export const Content = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  min-height: 0;
  padding-top: 2px;
  overflow-y: auto;
`;

export const SectionHeader = styled.div`
  display: flex;
  flex-shrink: 0;
  align-items: baseline;
  justify-content: space-between;
  padding: 18px 16px 10px;
`;

export const SectionTitle = styled.h2`
  color: ${COLORS.text.main};
  font-size: ${FONT_SIZE.bodyLarge};
  font-weight: ${FONT_WEIGHT.medium};
`;

export const SectionAction = styled.button`
  color: ${COLORS.text.muted};
  font-size: ${FONT_SIZE.label};
`;

export const AdRail = styled.ul`
  display: flex;
  flex-shrink: 0;
  gap: 10px;
  padding: 0 16px 4px;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  /* 첫 카드가 화면 좌측 여백에 맞춰 멈추게 한다 */
  scroll-padding-left: 16px;
  list-style: none;
`;

export const AdItem = styled.li`
  flex: 0 0 164px;
  scroll-snap-align: start;
`;

export const AdButton = styled.button`
  display: block;
  width: 100%;
  text-align: left;
`;

export const AdThumbnail = styled.img`
  width: 100%;
  aspect-ratio: 3 / 4;
  border-radius: ${RADIUS.card};
  object-fit: cover;
  background-color: ${COLORS.background.subtle};
`;

export const AdTitle = styled.p`
  margin-top: 7px;
  color: ${COLORS.text.main};
  font-size: ${FONT_SIZE.body};
  font-weight: ${FONT_WEIGHT.medium};
`;

export const AdFormatLabel = styled.p`
  margin-top: 1px;
  color: ${COLORS.text.muted};
  font-size: ${FONT_SIZE.caption};
`;

export const EmptyNotice = styled.p`
  padding: 6px 16px 18px;
  color: ${COLORS.text.muted};
  font-size: ${FONT_SIZE.body};
  line-height: 1.6;
`;

export const Toast = styled.div`
  position: fixed;
  right: 16px;
  bottom: calc(76px + env(safe-area-inset-bottom));
  left: 16px;
  z-index: 20;
  padding: 12px 14px;
  border-radius: ${RADIUS.chip};
  background-color: ${COLORS.text.main};
  color: ${COLORS.text.inverse};
  font-size: ${FONT_SIZE.body};
  text-align: center;
`;
