import styled from 'styled-components';

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
