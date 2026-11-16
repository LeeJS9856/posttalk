import styled, { keyframes } from 'styled-components';

import { COLORS } from '@/constants/colors';
import { FONT_SIZE, FONT_WEIGHT } from '@/constants/typography';

export const Stage = styled.div`
  position: relative;
  overflow: hidden;
  height: 100svh;
  background-color: #111113;
`;

export const Preview = styled.video`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

export const Shot = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

export const TopBar = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  padding: calc(14px + env(safe-area-inset-top)) 14px 26px;
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0));
`;

export const TopRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const CloseButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  margin-left: -9px;
  color: ${COLORS.white};

  svg {
    width: 20px;
    height: 20px;
  }
`;

export const Counter = styled.span`
  color: rgba(255, 255, 255, 0.78);
  font-size: ${FONT_SIZE.label};
`;

export const Instruction = styled.p`
  margin-top: 12px;
  color: ${COLORS.white};
  font-size: ${FONT_SIZE.bodyLarge};
  font-weight: ${FONT_WEIGHT.semibold};
`;

export const Hint = styled.p`
  margin-top: 3px;
  color: rgba(255, 255, 255, 0.7);
  font-size: ${FONT_SIZE.label};
`;

/** 구도 샘플. 장면에 예시 사진이 있으면 보여 주고, 없으면 자리만 잡아둔다. */
export const SampleWrap = styled.button`
  position: absolute;
  padding: 0;
  border: 0;
  background: none;
  cursor: zoom-in;
  top: 118px;
  right: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  /* 카메라 화면 위에서 무엇을 찍는지 한눈에 알아볼 만큼 크게. 좁은 폰에서도 화면의 40%를 넘지 않게. */
  width: min(150px, 40vw);
`;

export const SampleFrame = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  aspect-ratio: 3 / 4;
  overflow: hidden;
  border: 3px solid ${COLORS.white};
  border-radius: 14px;
  box-shadow: 0 4px 14px ${COLORS.scrim};
  background-color: rgba(255, 255, 255, 0.14);
  color: rgba(255, 255, 255, 0.72);

  svg {
    width: 19px;
    height: 19px;
  }
`;

export const SampleImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

export const SampleVideo = styled.video`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

export const SampleLabel = styled.p`
  margin-top: 6px;
  padding: 3px 10px;
  border-radius: 999px;
  background-color: ${COLORS.overlay};
  color: ${COLORS.white};
  font-size: ${FONT_SIZE.label};
  font-weight: ${FONT_WEIGHT.semibold};
  text-align: center;
  white-space: nowrap;
`;

/** 예시 사진을 화면 가득 보는 막. 화면 어디를 눌러도 닫힌다. */
export const SampleViewer = styled.button`
  position: absolute;
  inset: 0;
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  padding: 24px 16px;
  border: 0;
  background-color: ${COLORS.overlay};
  cursor: zoom-out;
`;

export const SampleViewerImage = styled.img`
  max-width: 100%;
  max-height: 72svh;
  border-radius: 16px;
  object-fit: contain;
`;

export const SampleViewerVideo = styled.video`
  max-width: 100%;
  max-height: 72svh;
  border-radius: 16px;
  object-fit: contain;
`;

export const SampleViewerHint = styled.p`
  color: ${COLORS.white};
  font-size: ${FONT_SIZE.body};
  font-weight: ${FONT_WEIGHT.semibold};
`;

export const BottomBar = styled.div`
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  padding: 24px 16px calc(20px + env(safe-area-inset-bottom));
  background: linear-gradient(to top, rgba(0, 0, 0, 0.62), rgba(0, 0, 0, 0));
`;

export const ShutterRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const SideButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: 10px;
  color: ${COLORS.white};

  svg {
    width: 20px;
    height: 20px;
  }
`;

export const Shutter = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 68px;
  height: 68px;
  border: 3px solid rgba(255, 255, 255, 0.92);
  border-radius: 50%;
  transition: transform 0.16s cubic-bezier(0.2, 0.85, 0.25, 1);

  &:active {
    transform: scale(0.93);
  }

  &::after {
    content: '';
    width: 54px;
    height: 54px;
    border-radius: 50%;
    background-color: ${COLORS.white};
  }
`;

/** 녹화 버튼. 셔터와 자리는 같고 안쪽만 빨갛다. */
export const RecordButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 68px;
  height: 68px;
  border: 3px solid rgba(255, 255, 255, 0.92);
  border-radius: 50%;
  transition: transform 0.16s cubic-bezier(0.2, 0.85, 0.25, 1);

  &:active {
    transform: scale(0.93);
  }

  &::after {
    content: '';
    width: 46px;
    height: 46px;
    border-radius: 50%;
    background-color: ${COLORS.record};
  }
`;

export const StopWrap = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 68px;
  height: 68px;
  margin: 0 auto;
`;

const fillRing = keyframes`
  from { stroke-dashoffset: 195; }
  to { stroke-dashoffset: 0; }
`;

/** 남은 시간을 숫자 대신 링으로 보여준다. 짧은 녹화에서는 숫자가 바뀔 틈이 없다. */
export const Ring = styled.svg<{ $seconds: number }>`
  position: absolute;
  inset: 0;
  transform: rotate(-90deg);

  circle {
    fill: none;
    stroke-width: 3;
  }

  circle:first-child {
    stroke: rgba(255, 255, 255, 0.25);
  }

  circle:last-child {
    stroke: ${COLORS.white};
    stroke-linecap: round;
    stroke-dasharray: 195;
    animation: ${fillRing} ${({ $seconds }) => $seconds}s linear forwards;
  }
`;

export const StopButton = styled.button`
  width: 24px;
  height: 24px;
  border-radius: 5px;
  background-color: ${COLORS.record};
`;

export const RecChip = styled.span`
  display: flex;
  align-items: center;
  gap: 5px;
  margin: 0 auto;
  padding: 3px 10px;
  border-radius: 999px;
  background-color: ${COLORS.record};
  color: ${COLORS.white};
  font-size: ${FONT_SIZE.label};

  &::before {
    content: '';
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background-color: ${COLORS.white};
  }
`;

export const ReviewVideo = styled.video`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

export const ConfirmRow = styled.div`
  display: flex;
  gap: 9px;
`;

export const RetakeButton = styled.button`
  flex: 0 0 40%;
  min-height: 50px;
  border: 1.5px solid rgba(255, 255, 255, 0.75);
  border-radius: 13px;
  color: ${COLORS.white};
  font-size: ${FONT_SIZE.bodyLarge};
  font-weight: ${FONT_WEIGHT.semibold};
`;

export const UseButton = styled.button`
  /* 확인 줄 안에서는 남는 폭을, 혼자 쓰일 때는 전체 폭을 차지한다. */
  flex: 1;
  width: 100%;
  min-height: 50px;
  border-radius: 13px;
  background-color: ${COLORS.white};
  color: ${COLORS.text.main};
  font-size: ${FONT_SIZE.bodyLarge};
  font-weight: ${FONT_WEIGHT.semibold};
`;

export const NoticeWrap = styled.div`
  position: absolute;
  top: 50%;
  right: 24px;
  left: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
  transform: translateY(-50%);
`;

export const Notice = styled.p`
  color: rgba(255, 255, 255, 0.82);
  font-size: ${FONT_SIZE.body};
  line-height: 1.7;
  text-align: center;
`;

/** 카메라를 열지 못했을 때의 탈출구. 묻힌 아이콘만 두면 길을 못 찾는다. */
export const FallbackButton = styled.button`
  min-height: 44px;
  padding: 0 18px;
  border: 1.5px solid rgba(255, 255, 255, 0.75);
  border-radius: 13px;
  color: ${COLORS.white};
  font-size: ${FONT_SIZE.bodyLarge};
  font-weight: ${FONT_WEIGHT.semibold};
`;

/**
 * 갤러리 경로의 본 화면. 자동으로 뜬 선택창을 취소해도 여기가 남아 있어야 한다.
 */
export const PickArea = styled.button`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 9px;
  width: 100%;
  height: 100%;
  padding: 0 24px;
  color: rgba(255, 255, 255, 0.78);
  transition: opacity 0.16s ease;

  &:active {
    opacity: 0.7;
  }

  /* 상단 지시문과 하단 버튼 사이만 비워 둔다. */
  &::before {
    content: '';
    position: absolute;
    inset: 134px 24px 118px;
    border: 1.5px dashed rgba(255, 255, 255, 0.3);
    border-radius: 16px;
  }

  svg {
    width: 30px;
    height: 30px;
  }
`;

export const PickText = styled.span`
  color: ${COLORS.white};
  font-size: ${FONT_SIZE.titleSmall};
  font-weight: ${FONT_WEIGHT.semibold};
`;

export const PickHint = styled.span`
  color: rgba(255, 255, 255, 0.6);
  font-size: ${FONT_SIZE.label};
`;

export const HiddenInput = styled.input`
  display: none;
`;
