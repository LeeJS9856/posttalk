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
  font-weight: ${FONT_WEIGHT.bold};
`;

export const Progress = styled.span`
  color: ${COLORS.text.muted};
  font-size: ${FONT_SIZE.label};
`;

export const Track = styled.div`
  height: 3px;
  margin: 8px 16px 20px;
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
  font-weight: ${FONT_WEIGHT.semibold};
`;

export const SlotLabel = styled.p<{ $done: boolean }>`
  margin-top: 7px;
  color: ${({ $done }) => ($done ? COLORS.text.main : COLORS.text.muted)};
  font-size: ${FONT_SIZE.label};
  font-weight: ${({ $done }) => ($done ? FONT_WEIGHT.semibold : FONT_WEIGHT.medium)};
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
  font-weight: ${FONT_WEIGHT.semibold};
  transition: background-color 0.18s ease;

  &:not(:disabled):active {
    transform: scale(0.98);
  }
`;

/** 세션을 열지 못했을 때 버튼 위에 띄우는 안내. */
export const ErrorText = styled.p`
  margin-bottom: 10px;
  color: ${COLORS.status.failed};
  font-size: ${FONT_SIZE.body};
  font-weight: ${FONT_WEIGHT.semibold};
  text-align: center;
`;

/*
 * 카드뉴스 · 릴스 일괄 촬영 목록의 칸(BatchCaptureList).
 * 관람객이 칸 이름을 잘 안 읽어 아무 사진이나 넣었다. 빈 칸 안에 무엇을 찍을지를 크게 쓴다.
 * 예시 사진은 칸에 깔지 않는다(올렸는지 헷갈린다). 예시는 칸을 누르면 뜨는 시트에서 보여 준다.
 */
export const TodoSlot = styled.span`
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 16px 14px 14px;
  border: 1.5px dashed ${COLORS.brand.line};
  border-radius: 12px;
  background-color: ${COLORS.brand.soft};
`;

export const TodoOrder = styled.span`
  color: ${COLORS.brand.main};
  font-size: ${FONT_SIZE.label};
  font-weight: ${FONT_WEIGHT.bold};
`;

export const TodoLabel = styled.span`
  color: ${COLORS.text.main};
  font-size: ${FONT_SIZE.titleSmall};
  font-weight: ${FONT_WEIGHT.bold};
  line-height: 1.3;
  word-break: keep-all;
`;

export const TodoHint = styled.span`
  color: ${COLORS.text.grey};
  font-size: ${FONT_SIZE.body};
  line-height: 1.45;
  word-break: keep-all;
`;

export const TodoAction = styled.span`
  position: absolute;
  right: 14px;
  bottom: 14px;
  display: flex;
  align-items: center;
  gap: 2px;
  color: ${COLORS.brand.main};
  font-size: ${FONT_SIZE.label};
  font-weight: ${FONT_WEIGHT.bold};

  svg {
    width: 16px;
    height: 16px;
  }
`;

/** 채운 칸 아래쪽의 이름표. 어느 칸에 무엇을 넣었는지 사진 위에서 바로 읽힌다. */
export const DoneCaption = styled.span`
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  gap: 1px;
  padding: 22px 12px 10px;
  background: linear-gradient(to bottom, rgba(21, 22, 26, 0), rgba(21, 22, 26, 0.78));
  color: ${COLORS.text.inverse};
`;

export const DoneNote = styled.span`
  color: ${COLORS.onInverse.sub};
  font-size: ${FONT_SIZE.caption};
  font-weight: ${FONT_WEIGHT.semibold};
`;

export const DoneLabel = styled.span`
  font-size: ${FONT_SIZE.bodyLarge};
  font-weight: ${FONT_WEIGHT.bold};
`;

/** 칸을 누르면 뜨는 시트 속 예시. 갤러리로 가든 카메라로 가든 한 번은 크게 보게 한다. */
export const SheetSample = styled.div`
  position: relative;
  height: min(240px, 30svh);
  margin-top: 12px;
  overflow: hidden;
  border-radius: ${RADIUS.panel};
  background-color: ${COLORS.background.inverse};

  img,
  video {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

export const SheetSampleChip = styled.span`
  position: absolute;
  top: 10px;
  left: 10px;
  padding: 4px 10px;
  border-radius: 999px;
  background-color: rgba(255, 255, 255, 0.92);
  color: ${COLORS.text.main};
  font-size: ${FONT_SIZE.caption};
  font-weight: ${FONT_WEIGHT.bold};
`;

/** 칸 아래쪽에 붙는 상태 띠. 올리는 중이거나, 다시 올려야 할 때 보인다. */
export const SlotStatus = styled.span<{ $tone: 'muted' | 'danger' }>`
  position: absolute;
  right: 6px;
  bottom: 6px;
  left: 6px;
  padding: 4px 6px;
  border-radius: 8px;
  background-color: ${({ $tone }) => ($tone === 'danger' ? COLORS.status.failed : COLORS.overlay)};
  color: ${COLORS.text.inverse};
  font-size: ${FONT_SIZE.caption};
  font-weight: ${FONT_WEIGHT.semibold};
  text-align: center;
`;
