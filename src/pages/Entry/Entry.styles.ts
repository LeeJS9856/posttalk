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

export const Card = styled.main`
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

export const Form = styled.form`
  display: grid;
  gap: 14px;
  margin-top: 24px;
`;

export const Field = styled.label`
  display: grid;
  gap: 7px;
  color: ${COLORS.black700};
  font-size: ${FONT_SIZE.label};
  font-weight: 700;
`;

export const Input = styled.input`
  width: 100%;
  padding: 13px;
  border: 1px solid ${COLORS.black200};
  border-radius: 12px;
  color: ${COLORS.black700};
  font-size: ${FONT_SIZE.body};
`;

export const Textarea = styled.textarea`
  width: 100%;
  min-height: 90px;
  resize: vertical;
  padding: 13px;
  border: 1px solid ${COLORS.black200};
  border-radius: 12px;
  color: ${COLORS.black700};
  font-size: ${FONT_SIZE.body};
  line-height: 1.45;
`;

export const SubmitButton = styled(Button)`
  width: 100%;
  margin-top: 8px;
`;

export const Message = styled.p<{ $isError?: boolean }>`
  margin-top: 18px;
  color: ${({ $isError }) => ($isError ? COLORS.statusWarning : COLORS.black500)};
  font-size: ${FONT_SIZE.body};
  line-height: 1.5;
  text-align: center;
`;
