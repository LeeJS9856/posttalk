import styled from 'styled-components';

import { COLORS } from '@/constants/colors';
import { FONT_SIZE, FONT_WEIGHT } from '@/constants/typography';

type PageHeaderProps = {
  title: string;
  onBack: () => void;
};

const PageHeader = ({ title, onBack }: PageHeaderProps): React.JSX.Element => (
  <Header>
    <BackButton type="button" aria-label="뒤로" onClick={onBack}>
      <Chevron aria-hidden="true" viewBox="0 0 24 24">
        <path
          d="M15 5L8 12L15 19"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Chevron>
    </BackButton>
    <Title>{title}</Title>
  </Header>
);

const Header = styled.header`
  display: flex;
  flex-shrink: 0;
  align-items: center;
  gap: 2px;
  padding: calc(10px + env(safe-area-inset-top)) 16px 10px 6px;
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  color: ${COLORS.text.main};
`;

const Chevron = styled.svg`
  width: 22px;
  height: 22px;
`;

const Title = styled.h1`
  color: ${COLORS.text.main};
  font-size: ${FONT_SIZE.bodyLarge};
  font-weight: ${FONT_WEIGHT.medium};
`;

export default PageHeader;
