import styled from 'styled-components';

import { COLORS } from '@/constants/colors';
import { FONT_SIZE, FONT_WEIGHT, RADIUS } from '@/constants/typography';

export const Page = styled.div`
  display: flex;
  flex-direction: column;
  height: 100svh;
  background-color: ${COLORS.background.main};
`;

export const TopBar = styled.div`
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: space-between;
  padding: calc(8px + env(safe-area-inset-top)) 8px 6px;
`;

export const TopAction = styled.button`
  display: flex;
  align-items: center;
  gap: 4px;
  min-height: 44px;
  padding: 0 8px;
  color: ${COLORS.text.main};
  font-size: ${FONT_SIZE.body};

  svg {
    width: 17px;
    height: 17px;
  }
`;

export const DoneMark = styled.span`
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 0 8px;
  color: ${COLORS.text.main};
  font-size: ${FONT_SIZE.body};

  svg {
    width: 15px;
    height: 15px;
    color: ${COLORS.brand.main};
  }
`;

export const Content = styled.div`
  flex: 1;
  min-height: 0;
  overflow-y: auto;
`;

export const Card = styled.div<{ $tall: boolean }>`
  position: relative;
  border-radius: ${RADIUS.panel};
  background-color: ${COLORS.background.subtle};
  overflow: hidden;

  /* 세로 영상은 높이를 먼저 정한다. 폭을 다 쓰면 캡션이 화면 밖으로 밀린다. */
  ${({ $tall }) =>
    $tall
      ? `
    height: 52svh;
    width: auto;
    margin: 0 auto;
    aspect-ratio: 9 / 16;
  `
      : `
    margin: 0 16px;
    aspect-ratio: 4 / 5;
  `}
`;

export const CardImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

export const CardVideo = styled.video`
  width: 100%;
  height: 100%;
  object-fit: cover;
  background-color: #111113;
`;

/** 영상 위에 덮는 재생 단추. 까만 상자만 보이면 눌러야 하는지 모른다. */
export const PlayOverlay = styled.button`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  background-color: ${COLORS.scrim};

  svg {
    width: 20px;
    height: 20px;
  }
`;

export const PlayMark = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 54px;
  height: 54px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.92);
  color: ${COLORS.text.main};
  transition: transform 0.16s cubic-bezier(0.2, 0.85, 0.25, 1);

  ${PlayOverlay}:active & {
    transform: scale(0.94);
  }
`;

export const Counter = styled.span`
  position: absolute;
  top: 10px;
  right: 10px;
  padding: 3px 9px;
  border-radius: 999px;
  background-color: ${COLORS.scrim};
  color: ${COLORS.text.inverse};
  font-size: ${FONT_SIZE.label};
`;

/** 카드가 몇 장인지, 지금 몇 번째인지 넘기지 않고도 알린다. */
export const Strip = styled.div`
  display: flex;
  gap: 6px;
  padding: 10px 16px 0;
`;

export const Thumb = styled.button<{ $on: boolean }>`
  flex: 1;
  aspect-ratio: 4 / 5;
  border-radius: 6px;
  background-color: ${COLORS.background.subtle};
  outline: ${({ $on }) => ($on ? `1.5px solid ${COLORS.brand.main}` : 'none')};
  outline-offset: 1.5px;
  overflow: hidden;
  transition: outline-color 0.18s ease;
`;

export const ThumbImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

export const Meta = styled.div`
  padding: 16px 16px 0;
`;

export const StatusBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  margin-bottom: 14px;
  padding: 4px 10px;
  border-radius: 999px;
  background-color: ${COLORS.statusSoft.published};
  color: ${COLORS.status.published};
  font-size: ${FONT_SIZE.label};

  svg {
    width: 13px;
    height: 13px;
  }
`;

export const MetaRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const MetaLabel = styled.p`
  color: ${COLORS.text.muted};
  font-size: ${FONT_SIZE.label};
`;

export const EditButton = styled.button`
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

export const Caption = styled.p<{ $muted: boolean }>`
  margin-top: 5px;
  color: ${({ $muted }) => ($muted ? COLORS.text.grey : COLORS.text.main)};
  font-size: ${FONT_SIZE.bodyLarge};
  line-height: 1.65;
  white-space: pre-line;
`;

export const CaptionField = styled.div`
  margin-top: 5px;
  padding: 9px 11px;
  border: 1.5px solid ${COLORS.brand.main};
  border-radius: ${RADIUS.chip};
`;

export const CaptionInput = styled.textarea`
  display: block;
  width: 100%;
  outline: none;
  color: ${COLORS.text.main};
  font-size: ${FONT_SIZE.bodyLarge};
  line-height: 1.65;
  resize: none;
`;

export const Footer = styled.div`
  flex-shrink: 0;
  padding: 14px 16px calc(14px + env(safe-area-inset-bottom));
  border-top: 0.5px solid ${COLORS.border.main};
  background-color: ${COLORS.background.main};
`;

export const PrimaryButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
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

  svg {
    width: 16px;
    height: 16px;
  }
`;

export const SecondaryButton = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  width: 100%;
  min-height: 52px;
  border: 1.5px solid ${COLORS.border.strong};
  border-radius: ${RADIUS.card};
  color: ${COLORS.text.main};
  font-size: ${FONT_SIZE.bodyLarge};
  font-weight: ${FONT_WEIGHT.medium};

  svg {
    width: 16px;
    height: 16px;
  }
`;

export const MissingWrap = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  padding: 0 24px;
`;

export const MissingText = styled.p`
  color: ${COLORS.text.grey};
  font-size: ${FONT_SIZE.bodyLarge};
  line-height: 1.7;
  text-align: center;
`;
