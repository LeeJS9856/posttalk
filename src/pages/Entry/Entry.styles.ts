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

export const Select = styled.select`
  width: 100%;
  padding: 13px;
  border: 1px solid ${COLORS.black200};
  border-radius: 12px;
  color: ${COLORS.black700};
  font-size: ${FONT_SIZE.body};
  line-height: 1.45;
`;

export const GuideList = styled.ol`
  display: grid;
  gap: 10px;
  margin-top: 24px;
  padding: 0;
  list-style: none;
  counter-reset: photo-guide;
`;

export const GuideItem = styled.li`
  position: relative;
  padding: 14px 14px 14px 46px;
  border-radius: 12px;
  background: ${COLORS.primary100};
  color: ${COLORS.black700};
  font-size: ${FONT_SIZE.body};
  line-height: 1.45;

  &::before {
    position: absolute;
    top: 14px;
    left: 14px;
    display: grid;
    width: 22px;
    height: 22px;
    place-items: center;
    border-radius: 50%;
    color: ${COLORS.white};
    background: ${COLORS.primary700};
    content: counter(photo-guide);
    counter-increment: photo-guide;
    font-size: 12px;
    font-weight: 700;
  }
`;

export const GuideTitle = styled.strong`
  display: block;
  margin-bottom: 3px;
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
