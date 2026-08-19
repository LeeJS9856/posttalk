import styled from 'styled-components';

import Button from '@/components/common/Button';
import PageFrame from '@/components/layout/PageFrame';
import { COLORS } from '@/constants/colors';
import { FONT_SIZE } from '@/constants/typography';

export const Page = styled(PageFrame)`
  display: flex;
  min-height: 100svh;
  align-items: center;
  padding: 24px;
  background: ${COLORS.background.main};
`;

export const Card = styled.section`
  width: 100%;
  padding: 28px 22px;
  border-radius: 20px;
  background: ${COLORS.white};
  box-shadow: 0 8px 24px rgb(33 33 33 / 10%);
`;

export const Title = styled.h1`
  color: ${COLORS.black700};
  font-size: ${FONT_SIZE.titleLarge};
  font-weight: 700;
`;

export const Description = styled.p`
  margin-top: 10px;
  color: ${COLORS.black500};
  font-size: ${FONT_SIZE.body};
  line-height: 1.5;
`;

export const TokenInput = styled.input`
  width: 100%;
  margin-top: 22px;
  padding: 14px;
  border: 1px solid ${COLORS.black200};
  border-radius: 12px;
  color: ${COLORS.black700};
  font-size: ${FONT_SIZE.body};
`;

export const ActivateButton = styled(Button)`
  width: 100%;
  margin-top: 14px;
`;

export const Result = styled.p<{ $isError: boolean }>`
  margin-top: 16px;
  color: ${({ $isError }) => ($isError ? COLORS.statusWarning : COLORS.statusPost)};
  font-size: ${FONT_SIZE.body};
  line-height: 1.5;
`;
