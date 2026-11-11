import type { ReactNode } from 'react';
import styled from 'styled-components';

import { COLORS } from '@/constants/colors';
import { FONT_SIZE, FONT_WEIGHT } from '@/constants/typography';

type AppHeaderProps = {
  title: string;
  /** 있으면 왼쪽에 뒤로 버튼을 둔다. 제목도 한 단계 작아진다. */
  onBack?: () => void;
  /** 뒤로 버튼 대신 왼쪽에 둘 것. 광고 상세의 `다 만들었어요` 같은 표시에 쓴다. */
  leading?: ReactNode;
  /** 오른쪽에 둘 버튼. */
  action?: ReactNode;
};

/**
 * 모든 화면의 머리. 탭으로 바로 가는 화면은 큰 제목만,
 * 흐름 안쪽 화면은 뒤로 버튼과 작은 제목을 쓴다. 높이와 여백은 같다.
 */
const AppHeader = ({ title, onBack, leading, action }: AppHeaderProps): React.JSX.Element => {
  return (
    <Header>
      <Left>
        {onBack && (
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
        )}
        {leading}
        <Title>{title}</Title>
      </Left>
      {action}
    </Header>
  );
};

export default AppHeader;

/* 어느 화면이든 같은 높이와 같은 여백을 쓴다. 제목 글자의 왼쪽 끝은 늘 16px 에 선다. */
const Header = styled.header`
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  min-height: 56px;
  padding: calc(8px + env(safe-area-inset-top)) 16px 8px;
`;

const Left = styled.div`
  display: flex;
  min-width: 0;
  align-items: center;
  gap: 2px;
`;

const BackButton = styled.button`
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: flex-start;
  width: 34px;
  height: 44px;
  /* 44px 터치 영역은 지키되, 아이콘이 왼쪽 여백선에 맞게 당긴다. */
  margin-left: -5px;
  color: ${COLORS.text.main};
`;

const Chevron = styled.svg`
  width: 22px;
  height: 22px;
`;

const Title = styled.h1`
  overflow: hidden;
  color: ${COLORS.text.main};
  font-size: ${FONT_SIZE.titleLarge};
  font-weight: ${FONT_WEIGHT.medium};
  white-space: nowrap;
  text-overflow: ellipsis;
`;
