import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import settingsIcon from '@/assets/icons/settings.svg?raw';
import ActionSheet, { type ActionSheetItem } from '@/components/common/ActionSheet';
import { COLORS } from '@/constants/colors';
import { useAdDraft } from '@/hooks/useAdDraft';
import { useAuth } from '@/hooks/useAuth';

const PersonIcon = (): React.JSX.Element => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <circle cx="12" cy="8.5" r="3.5" stroke="currentColor" strokeWidth="1.7" />
    <path
      d="M5 20c0-3.3 3.1-5.5 7-5.5s7 2.2 7 5.5"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
    />
  </svg>
);

const FolderIcon = (): React.JSX.Element => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M3.5 6.5h6l2 2.5h9v9.5h-17V6.5Z"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinejoin="round"
    />
  </svg>
);

const LogoutIcon = (): React.JSX.Element => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M15 8V5.5H4.5v13H15V16M10 12h10m0 0-3-3m3 3-3 3"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/**
 * 운영자 자리. 홈과 마이의 머리에 같은 모양으로 둔다.
 * 시트를 한 번 더 열어야 해서 관람객이 흘러들어갈 일이 적다.
 */
const SettingsButton = (): React.JSX.Element => {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const { resetDraft } = useAdDraft();

  const [isOpen, setIsOpen] = useState(false);

  const go = (path: string): void => {
    setIsOpen(false);
    navigate(path);
  };

  /** 체험 기록을 남기지 않고 운영자 화면으로 돌아간다. */
  const handleSignOut = (): void => {
    setIsOpen(false);
    resetDraft();
    signOut();
    navigate('/login', { replace: true });
  };

  const items: ActionSheetItem[] = [
    {
      key: 'profile',
      icon: <PersonIcon />,
      label: '프로필 수정',
      description: '가게 이름과 소개를 바꿔요',
      onSelect: () => go('/my/edit'),
    },
    {
      key: 'templates',
      icon: <FolderIcon />,
      label: '저장된 내용 관리',
      description: '정보 입력에서 고를 가게들',
      onSelect: () => go('/my/templates'),
    },
    {
      key: 'signOut',
      icon: <LogoutIcon />,
      label: '로그아웃',
      description: '운영자만 눌러주세요',
      onSelect: handleSignOut,
    },
  ];

  return (
    <>
      <IconButton
        type="button"
        aria-label="설정"
        aria-haspopup="dialog"
        onClick={() => setIsOpen(true)}
      >
        <span aria-hidden="true" dangerouslySetInnerHTML={{ __html: settingsIcon }} />
      </IconButton>

      <ActionSheet
        open={isOpen}
        title="설정"
        description="전시 중에는 건드리지 않아도 돼요"
        items={items}
        onClose={() => setIsOpen(false)}
      />
    </>
  );
};

export default SettingsButton;

const IconButton = styled.button`
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  margin-right: -10px;
  color: ${COLORS.text.grey};

  svg {
    width: 20px;
    height: 20px;
  }
`;
