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
  font-size: 15px;
  font-weight: ${FONT_WEIGHT.medium};
`;

export const Hint = styled.p`
  margin-top: 3px;
  color: rgba(255, 255, 255, 0.7);
  font-size: ${FONT_SIZE.label};
`;

/** 구도 샘플. 실제 이미지가 나오기 전까지 자리만 잡아둔다. */
export const SampleWrap = styled.div`
  position: absolute;
  top: 118px;
  right: 12px;
  width: 76px;
`;

export const SampleFrame = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  aspect-ratio: 3 / 4;
  border: 1.5px solid rgba(255, 255, 255, 0.62);
  border-radius: 9px;
  background-color: rgba(255, 255, 255, 0.14);
  color: rgba(255, 255, 255, 0.72);

  svg {
    width: 19px;
    height: 19px;
  }
`;

export const SampleLabel = styled.p`
  margin-top: 4px;
  color: rgba(255, 255, 255, 0.72);
  font-size: ${FONT_SIZE.caption};
  text-align: center;
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
  font-weight: ${FONT_WEIGHT.medium};
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
  font-weight: ${FONT_WEIGHT.medium};
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
  font-weight: ${FONT_WEIGHT.medium};
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
  font-weight: ${FONT_WEIGHT.medium};
`;

export const PickHint = styled.span`
  color: rgba(255, 255, 255, 0.6);
  font-size: ${FONT_SIZE.label};
`;

export const HiddenInput = styled.input`
  display: none;
`;
