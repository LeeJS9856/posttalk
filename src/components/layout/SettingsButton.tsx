import { Settings } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import ActionSheet, { type ActionSheetItem } from '@/components/common/ActionSheet';
import { COLORS } from '@/constants/colors';
import { FONT_SIZE, FONT_WEIGHT, RADIUS } from '@/constants/typography';
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

type SheetState = 'closed' | 'menu' | 'confirmSignOut';

/**
 * 설정. 홈과 마이의 머리에 같은 모양으로 둔다.
 * 로그아웃은 한 번 더 묻는다. 공용 기기에서 잘못 누르면 다음 사람이 앱을 쓸 수 없다.
 */
const SettingsButton = (): React.JSX.Element => {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const { resetDraft } = useAdDraft();

  const [sheet, setSheet] = useState<SheetState>('closed');

  const go = (path: string): void => {
    setSheet('closed');
    navigate(path);
  };

  /** 제작 중이던 내용을 남기지 않고 로그인 화면으로 돌아간다. */
  const handleSignOut = (): void => {
    setSheet('closed');
    resetDraft();
    signOut();
    navigate('/login', { replace: true });
  };

  const items: ActionSheetItem[] = [
    {
      key: 'profile',
      icon: <PersonIcon />,
      label: '프로필 수정',
      onSelect: () => go('/my/edit'),
    },
    {
      key: 'templates',
      icon: <FolderIcon />,
      label: '저장된 메뉴',
      onSelect: () => go('/my/templates'),
    },
    {
      key: 'signOut',
      icon: <LogoutIcon />,
      label: '로그아웃',
      danger: true,
      onSelect: () => setSheet('confirmSignOut'),
    },
  ];

  const close = (): void => setSheet('closed');

  return (
    <>
      <IconButton
        type="button"
        aria-label="설정"
        aria-haspopup="dialog"
        onClick={() => setSheet('menu')}
      >
        <Settings aria-hidden="true" strokeWidth={1.8} />
      </IconButton>

      <ActionSheet open={sheet === 'menu'} title="설정" items={items} onClose={close} />

      {/* 확인창은 버튼 둘만 둔다. 위험한 쪽을 채운 버튼으로, 물러서는 쪽을 글자로 둔다. */}
      <ActionSheet
        open={sheet === 'confirmSignOut'}
        title="로그아웃할까요?"
        description="만들던 광고는 지워져요"
        onClose={close}
      >
        <ConfirmActions>
          <DangerButton type="button" onClick={handleSignOut}>
            로그아웃
          </DangerButton>
          <CancelButton type="button" onClick={close}>
            취소
          </CancelButton>
        </ConfirmActions>
      </ActionSheet>
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

const ConfirmActions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-top: 20px;
`;

const DangerButton = styled.button`
  min-height: 52px;
  border-radius: ${RADIUS.card};
  background-color: ${COLORS.status.failed};
  color: ${COLORS.text.inverse};
  font-size: ${FONT_SIZE.bodyLarge};
  font-weight: ${FONT_WEIGHT.semibold};
  transition: transform 0.16s cubic-bezier(0.2, 0.85, 0.25, 1);

  &:active {
    transform: scale(0.98);
  }
`;

const CancelButton = styled.button`
  min-height: 48px;
  color: ${COLORS.text.grey};
  font-size: ${FONT_SIZE.bodyLarge};
  font-weight: ${FONT_WEIGHT.medium};
`;
