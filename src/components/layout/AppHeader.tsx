import type { ReactNode } from 'react';
import styled from 'styled-components';

import { COLORS } from '@/constants/colors';
import { FONT_SIZE, FONT_WEIGHT } from '@/constants/typography';

type AppHeaderProps = {
  title: string;
  /** 있으면 제목 위에 뒤로 버튼 줄을 둔다. */
  onBack?: () => void;
  /** 제목 오른쪽에 둘 버튼이나 표시. */
  action?: ReactNode;
  /** 글자 제목 대신 세울 로고. title 은 읽어주기용으로 남는다. */
  logo?: ReactNode;
  /** 아래 내용이 스크롤되어 머리 밑으로 들어갔을 때 true. 경계선을 보인다. */
  raised?: boolean;
};

/**
 * 모든 화면의 머리.
 * 뒤로 버튼은 제목과 같은 줄에 두지 않는다. 같은 줄에 두면 화살표만큼
 * 제목이 밀려 화면마다 제목의 왼쪽 끝이 어긋난다.
 */
const AppHeader = ({
  title,
  onBack,
  action,
  logo,
  raised = false,
}: AppHeaderProps): React.JSX.Element => (
  <Header $raised={raised}>
    {onBack && (
      <BackRow>
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
      </BackRow>
    )}

    <TitleRow>
      {logo ? <Title as="h1" aria-label={title}>{logo}</Title> : <Title>{title}</Title>}
      {action}
    </TitleRow>
  </Header>
);

export default AppHeader;

/* 내용이 머리 밑으로 들어가면 아래 경계선을 보인다. 앱의 상단 바가 스크롤에 반응하는 방식이다. */
const Header = styled.header<{ $raised: boolean }>`
  display: flex;
  flex-shrink: 0;
  flex-direction: column;
  /* 상태 표시줄 아래부터 잰다. 아래쪽에만 여백을 두면 내용이 위로 쏠려 보인다. */
  padding-top: env(safe-area-inset-top);
  border-bottom: 0.5px solid
    ${({ $raised }) => ($raised ? COLORS.border.strong : 'transparent')};
  transition: border-color 0.2s ease;
`;

const BackRow = styled.div`
  display: flex;
  align-items: center;
  height: 44px;
  padding-left: 6px;
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

/** 제목의 왼쪽 끝은 어느 화면에서든 16px 에 선다. */
/*
 * 높이를 고정하고 세로 가운데에 세운다. 오른쪽 버튼이 있고 없고에 따라 머리 높이가 달라지면 안 된다.
 * 56px 은 iOS 내비게이션 바(44pt)와 Material 상단 바(64dp) 사이로, 국내 앱들이 주로 쓰는 높이다.
 */
const TitleRow = styled.div`
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  height: 56px;
  padding: 0 16px;
`;

const Title = styled.h1`
  overflow: hidden;
  color: ${COLORS.text.main};
  font-size: ${FONT_SIZE.titleLarge};
  font-weight: ${FONT_WEIGHT.bold};
  line-height: 1.2;
  letter-spacing: -0.02em;
  white-space: nowrap;
  text-overflow: ellipsis;
`;
