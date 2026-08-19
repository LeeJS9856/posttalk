import styled from 'styled-components';

import Button from '@/components/common/Button';
import PageFrame from '@/components/layout/PageFrame';
import { COLORS } from '@/constants/colors';
import { FONT_SIZE } from '@/constants/typography';

export const Page = styled(PageFrame)`
  display: flex;
  min-height: 100svh;
  flex-direction: column;
  padding: 80px 24px 44px;
  background: ${COLORS.background.main};
`;

export const Welcome = styled.header`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

export const Logo = styled.img`
  width: 68px;
  height: 68px;
  margin-bottom: 22px;
`;

export const Title = styled.h1`
  color: ${COLORS.black700};
  font-size: ${FONT_SIZE.titleEmphasis};
  font-weight: 700;
  letter-spacing: -0.6px;
`;

export const Subtitle = styled.p`
  margin-top: 8px;
  color: ${COLORS.black500};
  font-size: ${FONT_SIZE.body};
`;

export const Form = styled.form`
  display: grid;
  gap: 18px;
  margin-top: 58px;
`;

export const InputField = styled.div`
  display: grid;
  gap: 8px;
`;

export const InputLabel = styled.label`
  color: ${COLORS.black700};
  font-size: ${FONT_SIZE.body};
  font-weight: 700;
`;

const Input = styled.input`
  width: 100%;
  height: 54px;
  border: 1px solid ${COLORS.black200};
  border-radius: 12px;
  padding: 0 16px;
  color: ${COLORS.black700};
  background: ${COLORS.white};
  font-size: ${FONT_SIZE.bodyLarge};
  outline: none;

  &::placeholder {
    color: ${COLORS.black400};
  }

  &:focus {
    border-color: ${COLORS.primary};
    box-shadow: 0 0 0 3px ${COLORS.primary200};
  }
`;

export const IdInput = styled(Input)``;

export const PasswordInput = styled(Input)``;

export const SubmitButton = styled(Button)`
  width: 100%;
  margin-top: 14px;
  border-radius: 12px;
  padding: 16px 20px;
  background: ${COLORS.primary700};
  font-size: ${FONT_SIZE.bodyLarge};

  &:disabled {
    cursor: not-allowed;
    color: ${COLORS.black400};
    background: ${COLORS.black200};
    transform: none;
  }
`;

export const HelperText = styled.p`
  margin-top: auto;
  color: ${COLORS.black500};
  font-size: ${FONT_SIZE.label};
  text-align: center;
`;
