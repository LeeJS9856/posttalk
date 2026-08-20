import styled from 'styled-components';

import { FlowTitle } from '@/components/common/FlowTitle';
import PageFrame from '@/components/layout/PageFrame';
import { COLORS } from '@/constants/colors';
import { FONT_SIZE } from '@/constants/typography';

export const Page = styled(PageFrame)`
  position: relative;
  display: flex;
  flex-direction: column;
  padding-bottom: 24px;
  background: ${COLORS.background.main};
`;

export const Guide = styled.section`
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  padding: clamp(56px, 12svh, 104px) 24px 0;
  text-align: center;
`;

export const Popo = styled.img`
  width: 57px;
  height: 54px;
`;

export const GuideCopy = styled(FlowTitle)`
  margin-top: 20px;
`;

export const HelperText = styled.p`
  margin-top: 10px;
  color: ${COLORS.black500};
  font-size: ${FONT_SIZE.body};
  line-height: 1.45;
`;

export const ExampleImage = styled.img`
  width: auto;
  max-width: 100%;
  height: min(34svh, 300px);
  aspect-ratio: 9 / 16;
  margin-top: 16px;
  border-radius: 14px;
  object-fit: cover;
`;

export const ActionArea = styled.div`
  margin: auto 24px 0;
`;

export const CameraInput = styled.input`
  display: none;
`;

export const ModalBackdrop = styled.div`
  position: fixed;
  z-index: 10;
  inset: 0;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding: 24px;
  background: rgba(0, 0, 0, 0.45);
`;

export const ModalContent = styled.section`
  display: flex;
  width: min(100%, 400px);
  flex-direction: column;
  gap: 10px;
  border-radius: 20px;
  padding: 28px 20px 20px;
  background: ${COLORS.white};
`;

export const ModalTitle = styled.h2`
  color: ${COLORS.black700};
  font-size: ${FONT_SIZE.bodyLarge};
  font-weight: 700;
`;

export const ModalDescription = styled.p`
  margin-bottom: 10px;
  color: ${COLORS.black500};
  font-size: ${FONT_SIZE.body};
  line-height: 1.45;
`;

export const ChoiceButton = styled.button`
  width: 100%;
  border: 0;
  border-radius: 10px;
  padding: 15px 20px;
  color: ${COLORS.white};
  background: ${COLORS.primary700};
  font-size: ${FONT_SIZE.bodyLarge};
  font-weight: 700;
`;

export const ModalCancelButton = styled.button`
  width: 100%;
  border: 0;
  border-radius: 10px;
  padding: 13px 20px;
  color: ${COLORS.black500};
  background: transparent;
  font-size: ${FONT_SIZE.body};
  font-weight: 600;
`;
