import type { ReactNode } from 'react';
import styled from 'styled-components';

import chevronRightIcon from '@/assets/icons/chevron right.svg?raw';
import { COLORS } from '@/constants/colors';
import { FONT_SIZE } from '@/constants/typography';

type PageHeaderProps = {
  onBack?: () => void;
  rightAction?: ReactNode;
  showTitle?: boolean;
  title: string;
};

const PageHeader = ({ onBack, rightAction, showTitle = true, title }: PageHeaderProps): React.JSX.Element => (
  <Header>
    {onBack ? (
      <BackButton type="button" aria-label={`${title}으로 돌아가기`} onClick={onBack}>
        <BackIcon aria-hidden="true" dangerouslySetInnerHTML={{ __html: chevronRightIcon }} />
        {showTitle && <Title>{title}</Title>}
      </BackButton>
    ) : (
      showTitle && <Title>{title}</Title>
    )}
    {rightAction && <RightAction>{rightAction}</RightAction>}
  </Header>
);

const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 64px;
  padding: 20px 24px 18px;
`;

const BackButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  height: 26px;
  padding: 0;
  border: 0;
  color: ${COLORS.black700};
  background: transparent;
`;

const BackIcon = styled.span`
  display: block;
  width: 18px;
  height: 18px;
  transform: rotate(180deg);

  svg {
    display: block;
    width: 100%;
    height: 100%;
  }
`;

const Title = styled.h1`
  color: ${COLORS.black700};
  font-size: ${FONT_SIZE.title};
  font-weight: 700;
  line-height: 1.3;
`;

const RightAction = styled.div`
  display: flex;
  align-items: center;
  margin: -9px -8px -9px 0;
`;

export default PageHeader;
