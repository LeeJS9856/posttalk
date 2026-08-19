import styled from 'styled-components';

import Button from '@/components/common/Button';
import { FlowTitle } from '@/components/common/FlowTitle';
import PageFrame from '@/components/layout/PageFrame';
import { COLORS } from '@/constants/colors';
import { FONT_SIZE } from '@/constants/typography';

export const Page = styled(PageFrame)`
  display: flex;
  flex-direction: column;
  padding-bottom: 24px;
  background: ${COLORS.background.main};
`;

export const Content = styled.section`
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

export const PhotoPreview = styled.img`
  width: 100%;
  aspect-ratio: 1.2;
  margin-top: 16px;
  object-fit: cover;
`;

export const EmptyPhoto = styled.p`
  display: grid;
  width: 100%;
  aspect-ratio: 1.2;
  margin-top: 16px;
  place-items: center;
  color: ${COLORS.black500};
  background: ${COLORS.primary100};
  font-size: ${FONT_SIZE.bodyLarge};
`;

export const ActionArea = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 8px;
  margin: auto 24px 0;
`;

export const RetakeButton = styled(Button)`
  border: 1px solid ${COLORS.black400};
  border-radius: 10px;
  padding: 16px 10px;
  color: ${COLORS.black500};
  background: ${COLORS.white};
  box-shadow: 0 2px 5px rgba(33, 33, 33, 0.12);
  font-size: ${FONT_SIZE.bodyLarge};
  font-weight: 700;

  &:hover {
    background: ${COLORS.white};
  }
`;

export const CameraInput = styled.input`
  display: none;
`;

export const ErrorMessage = styled.p`
  margin: 12px 24px 0;
  color: #c24a3d;
  font-size: ${FONT_SIZE.body};
  text-align: center;
`;
