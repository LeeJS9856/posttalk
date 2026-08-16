import styled from 'styled-components';

import PageFrame from '@/components/layout/PageFrame';
import type { ArchiveFormat } from '@/constants/archive';
import { COLORS } from '@/constants/colors';
import { FONT_SIZE } from '@/constants/typography';

export const Page = styled(PageFrame)`
  padding-bottom: 80px;
  background: ${COLORS.background.main};
`;

export const SearchButton = styled.button`
  display: grid;
  width: 36px;
  height: 36px;
  place-items: center;
  border: 0;
  background: transparent;
`;

export const SearchIcon = styled.span`
  position: relative;
  width: 15px;
  height: 15px;
  border: 2px solid ${COLORS.black700};
  border-radius: 50%;

  &::after {
    position: absolute;
    right: -5px;
    bottom: -3px;
    width: 7px;
    height: 2px;
    border-radius: 2px;
    background: ${COLORS.black700};
    content: '';
    transform: rotate(45deg);
  }
`;

export const FormatTabs = styled.div`
  position: relative;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  border-bottom: 1px solid ${COLORS.black200};
  background: ${COLORS.background.main};
`;

export const FormatIndicator = styled.span<{ $format: ArchiveFormat }>`
  position: absolute;
  right: auto;
  bottom: -1px;
  left: 24px;
  width: calc(50% - 48px);
  height: 2px;
  background: ${COLORS.black700};
  transform: ${({ $format }) => ($format === 'photo' ? 'translateX(0)' : 'translateX(calc(100% + 48px))')};
  transition: transform 220ms ease-out;
`;

export const FormatTab = styled.button<{ $active: boolean }>`
  position: relative;
  height: 48px;
  border: 0;
  color: ${({ $active }) => ($active ? COLORS.black700 : COLORS.black400)};
  background: transparent;
  font-size: ${FONT_SIZE.body};
  font-weight: ${({ $active }) => ($active ? 700 : 500)};
`;

export const FilterList = styled.div`
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding: 20px 24px 14px;
  background: ${COLORS.background.main};
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
`;

export const FilterButton = styled.button<{ $active: boolean }>`
  flex: 0 0 auto;
  border: 0;
  border-radius: 999px;
  padding: 9px 12px;
  color: ${({ $active }) => ($active ? COLORS.white : COLORS.black400)};
  background: ${({ $active }) => ($active ? COLORS.primary : COLORS.primary100)};
  box-shadow: 0 2px 5px rgba(33, 33, 33, 0.12);
  font-size: ${FONT_SIZE.label};
  font-weight: 400;
`;

export const Content = styled.section`
  padding-top: 20px;
`;

export const AdList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const EmptyMessage = styled.p`
  padding: 72px 24px;
  color: ${COLORS.black500};
  font-size: ${FONT_SIZE.body};
  text-align: center;
`;
