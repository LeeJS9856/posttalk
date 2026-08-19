import styled from 'styled-components';

import PageFrame from '@/components/layout/PageFrame';
import { COLORS } from '@/constants/colors';
import { FONT_SIZE } from '@/constants/typography';

export const Page = styled(PageFrame)`
  display: flex;
  min-height: 100svh;
  flex-direction: column;
  background: ${COLORS.background.main};
`;

export const Content = styled.main`
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  padding: 38px 24px 48px;
`;

export const Title = styled.h2`
  color: ${COLORS.black700};
  font-size: ${FONT_SIZE.titleLarge};
  font-weight: 700;
`;

export const Description = styled.p`
  margin-top: 8px;
  color: ${COLORS.black500};
  font-size: ${FONT_SIZE.body};
  line-height: 1.5;
  text-align: center;
`;

export const CameraFrame = styled.div`
  position: relative;
  width: min(100%, 360px);
  aspect-ratio: 1;
  margin-top: 32px;
  overflow: hidden;
  border-radius: 24px;
  background: ${COLORS.black700};

  &::after {
    position: absolute;
    inset: 18%;
    border: 2px solid ${COLORS.white};
    border-radius: 18px;
    content: '';
    pointer-events: none;
  }
`;

export const CameraVideo = styled.video`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

export const Status = styled.p<{ $isError: boolean }>`
  margin-top: 22px;
  color: ${({ $isError }) => ($isError ? COLORS.statusWarning : COLORS.black500)};
  font-size: ${FONT_SIZE.body};
  line-height: 1.5;
  text-align: center;
`;
