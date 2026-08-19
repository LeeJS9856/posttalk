import styled from 'styled-components';

import heroImage from '@/assets/temporary-market-hero.jpg';
import PageFrame from '@/components/layout/PageFrame';
import { COLORS } from '@/constants/colors';
import { FONT_SIZE } from '@/constants/typography';

export const AppFrame = styled(PageFrame)`
  position: relative;
  overflow: hidden;
  background: ${COLORS.background.main};
`;

export const Hero = styled.header`
  position: absolute;
  inset: 0 0 auto;
  height: 62svh;
  background-image: url(${heroImage});
  background-position: center;
  background-size: cover;

  &::after {
    position: absolute;
    inset: 0 0 auto;
    height: 310px;
    background: linear-gradient(180deg, rgba(21, 22, 37, 0.82) 0%, rgba(31, 31, 48, 0.6) 46%, rgba(31, 31, 48, 0) 100%);
    backdrop-filter: blur(8px);
    content: '';
    mask-image: linear-gradient(to bottom, black 0%, black 58%, transparent 100%);
  }
`;

export const HeroMessage = styled.h1`
  position: relative;
  z-index: 1;
  margin: 52px 24px 0;
  color: ${COLORS.white};
  font-size: clamp(22px, 5.6vw, 26px);
  font-weight: 400;
  line-height: 1.42;
  letter-spacing: -0.7px;
`;

export const HeroStrong = styled.strong`
  font-weight: 700;
`;

export const Section = styled.section`
  & + & {
    margin-top: 24px;
  }
`;

export const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const SectionTitle = styled.h2`
  margin-bottom: 14px;
  color: ${COLORS.black700};
  font-size: ${FONT_SIZE.title};
  font-weight: 700;
`;

export const AllButton = styled.button`
  margin-bottom: 14px;
  border: 0;
  color: ${COLORS.black700};
  background: transparent;
  font-size: ${FONT_SIZE.label};
`;

export const ReviewList = styled.div`
  display: grid;
  gap: 12px;
`;

export const EmptyMessage = styled.p`
  display: grid;
  min-height: 86px;
  place-items: center;
  margin: 0;
  border-radius: 12px;
  color: ${COLORS.black500};
  background: ${COLORS.primary100};
  font-size: ${FONT_SIZE.body};
  text-align: center;
`;

export const RecentList = styled.div`
  display: flex;
  gap: 14px;
  overflow-x: auto;
  margin: 0 -24px;
  padding: 0 24px;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
`;

export const RecentCard = styled.button`
  width: 144px;
  flex: 0 0 auto;
  overflow: hidden;
  border: 0;
  padding: 0;
  color: ${COLORS.black700};
  background: transparent;
  text-align: left;

  img {
    display: block;
    width: 144px;
    height: 144px;
    border-radius: 12px;
    object-fit: cover;
  }

  strong {
    display: block;
    margin-top: 7px;
    font-size: ${FONT_SIZE.bodyLarge};
    font-weight: 700;
  }
`;
