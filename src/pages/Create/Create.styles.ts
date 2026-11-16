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
  padding: 0 16px 12px;
`;

/** 결과물 미리보기. 고른 형식과 분위기에 따라 안의 그림이 바뀐다. */
export const Preview = styled.section`
  position: relative;
  height: clamp(232px, 36svh, 300px);
  overflow: hidden;
  border-radius: ${RADIUS.panel};
  background-color: ${COLORS.background.subtle};
`;

export const PreviewLabel = styled.span`
  position: absolute;
  top: 12px;
  left: 12px;
  z-index: 1;
  padding: 4px 10px;
  border-radius: 999px;
  background-color: ${COLORS.overlay};
  color: ${COLORS.white};
  font-size: ${FONT_SIZE.caption};
  font-weight: ${FONT_WEIGHT.semibold};
`;

/* 카드뉴스: 가운데 카드와 양옆의 흐린 카드. 옆으로 넘겨 보는 결과물이라는 게 그림으로 읽힌다. */
export const CardStage = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
`;

export const CardMain = styled.img`
  flex-shrink: 0;
  width: 44%;
  max-width: 172px;
  aspect-ratio: 4 / 5;
  border-radius: 14px;
  box-shadow: 0 10px 24px rgba(20, 20, 30, 0.2);
  object-fit: cover;
`;

export const CardSide = styled.img`
  flex-shrink: 0;
  width: 31%;
  max-width: 120px;
  aspect-ratio: 4 / 5;
  border-radius: 12px;
  object-fit: cover;
  opacity: 0.55;
`;

export const PageDots = styled.div`
  position: absolute;
  right: 0;
  bottom: 14px;
  left: 0;
  display: flex;
  justify-content: center;
  gap: 5px;
`;

export const PageDot = styled.span<{ $active?: boolean }>`
  width: ${({ $active }) => ($active ? '18px' : '6px')};
  height: 6px;
  border-radius: 999px;
  background-color: ${({ $active }) => ($active ? COLORS.brand.main : COLORS.border.strong)};
`;

/* 릴스: 세로 폰 화면과, 카드뉴스에는 없는 자막 · 음악 · 전환 이름표. */
/* 위쪽은 미리보기 이름표 자리로 비운다. 폰 테두리가 이름표에 걸리지 않게 한다. */
export const ReelsStage = styled.div`
  position: absolute;
  inset: 44px 0 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 18px;
`;

export const Phone = styled.div`
  position: relative;
  height: 100%;
  aspect-ratio: 9 / 16;
  overflow: hidden;
  border: 4px solid ${COLORS.text.main};
  border-radius: 22px;
  background-color: ${COLORS.text.main};
  box-shadow: 0 10px 24px rgba(20, 20, 30, 0.2);

  video {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

export const PhoneTime = styled.span`
  position: absolute;
  right: 6px;
  bottom: 6px;
  padding: 1px 6px;
  border-radius: 4px;
  background-color: ${COLORS.overlay};
  color: ${COLORS.white};
  font-size: ${FONT_SIZE.caption};
  font-weight: ${FONT_WEIGHT.bold};
`;

export const ReelsTags = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 8px;
  list-style: none;
`;

export const ReelsTag = styled.li`
  padding: 6px 10px;
  border-radius: 10px;
  background-color: ${COLORS.white};
  color: ${COLORS.text.main};
  font-size: ${FONT_SIZE.label};
  font-weight: ${FONT_WEIGHT.semibold};
`;

export const SectionLabel = styled.p`
  margin: 18px 0 8px;
  color: ${COLORS.text.main};
  font-size: ${FONT_SIZE.bodyLarge};
  font-weight: ${FONT_WEIGHT.bold};
`;

export const OptionGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;
`;

/* 고른 것은 흰 바탕에 브랜드 테두리, 안 고른 것은 회색 바탕. 두 줄 모두 같은 규칙이다. */
const optionSurface = ({ $selected }: { $selected: boolean }): string =>
  $selected
    ? `background-color: ${COLORS.white}; box-shadow: 0 0 0 2px ${COLORS.brand.main};`
    : `background-color: ${COLORS.background.subtle}; box-shadow: none;`;

export const FormatOption = styled.button<{ $selected: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  min-height: 64px;
  padding: 10px 12px;
  border-radius: ${RADIUS.card};
  text-align: left;
  transition: box-shadow 0.18s ease;
  ${optionSurface}
`;

export const FormatLabel = styled.span`
  color: ${COLORS.text.main};
  font-size: ${FONT_SIZE.bodyLarge};
  font-weight: ${FONT_WEIGHT.bold};
`;

export const MoodOption = styled.button<{ $selected: boolean }>`
  display: flex;
  align-items: center;
  gap: 10px;
  min-height: 60px;
  padding: 8px;
  border-radius: ${RADIUS.card};
  text-align: left;
  transition: box-shadow 0.18s ease;
  ${optionSurface}
`;

export const MoodThumb = styled.img`
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  border-radius: 10px;
  object-fit: cover;
`;

export const MoodLabel = styled.span`
  color: ${COLORS.text.main};
  font-size: ${FONT_SIZE.body};
  font-weight: ${FONT_WEIGHT.bold};
`;

export const Footer = styled.div`
  flex-shrink: 0;
  padding: 12px 16px 14px;
`;

export const NextButton = styled.button`
  width: 100%;
  min-height: 56px;
  border-radius: ${RADIUS.card};
  background-color: ${COLORS.brand.main};
  color: ${COLORS.onBrand.main};
  font-size: ${FONT_SIZE.bodyLarge};
  font-weight: ${FONT_WEIGHT.bold};
  transition: background-color 0.18s ease;

  &:active {
    background-color: ${COLORS.brand.pressed};
  }
`;
