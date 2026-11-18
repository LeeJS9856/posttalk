import { Settings, Share, Smartphone } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import ActionSheet, { type ActionSheetItem } from '@/components/common/ActionSheet';
import { COLORS } from '@/constants/colors';
import { FONT_SIZE, FONT_WEIGHT, RADIUS } from '@/constants/typography';
import { useAdDraft } from '@/hooks/useAdDraft';
import { useAuth } from '@/hooks/useAuth';
import { isIosSafari, promptInstall, useInstallState } from '@/hooks/useInstallPrompt';

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

type SheetState = 'closed' | 'menu' | 'confirmSignOut' | 'installGuide';

/**
 * 설정. 홈과 마이의 머리에 같은 모양으로 둔다.
 * 로그아웃은 한 번 더 묻는다. 공용 기기에서 잘못 누르면 다음 사람이 앱을 쓸 수 없다.
 */
const SettingsButton = (): React.JSX.Element => {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const { resetDraft } = useAdDraft();
  const installState = useInstallState();

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

  /** 설치 창을 열 수 있으면 바로 열고, 못 열면 브라우저 메뉴 위치를 알려 준다. */
  const handleInstall = (): void => {
    if (installState === 'ready') {
      setSheet('closed');
      void promptInstall();
      return;
    }
    setSheet('installGuide');
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
    // 이미 홈 화면에서 연 앱이면 숨긴다. 전시 기기에서는 관람객이 볼 일이 없다.
    ...(installState === 'installed'
      ? []
      : [
          {
            key: 'install',
            icon: <Smartphone />,
            label: '앱으로 설치',
            description: '홈 화면에서 주소창 없이 바로 열려요',
            onSelect: handleInstall,
          },
        ]),
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

      {/* 사파리는 설치 창을 열어 주지 않는다. 안드로이드도 조건이 덜 차면 안 열린다. 이때는 길만 알려 준다. */}
      <ActionSheet
        open={sheet === 'installGuide'}
        title="앱으로 설치"
        description="브라우저 메뉴에서 홈 화면에 더하면 돼요"
        onClose={close}
      >
        <Steps>
          {isIosSafari() ? (
            <>
              <Step>
                <StepMark aria-hidden="true">
                  <Share />
                </StepMark>
                화면 아래 공유 버튼을 누르세요
              </Step>
              <Step>
                <StepMark aria-hidden="true">2</StepMark>
                목록에서 ‘홈 화면에 추가’를 고르세요
              </Step>
            </>
          ) : (
            <>
              <Step>
                <StepMark aria-hidden="true">⋮</StepMark>
                주소창 옆 메뉴를 누르세요
              </Step>
              <Step>
                <StepMark aria-hidden="true">2</StepMark>
                ‘앱 설치’ 또는 ‘홈 화면에 추가’를 고르세요
              </Step>
            </>
          )}
        </Steps>

        <ConfirmActions>
          <CancelButton type="button" onClick={close}>
            닫기
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

const Steps = styled.ol`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 16px;
  list-style: none;
`;

const Step = styled.li`
  display: flex;
  align-items: center;
  gap: 12px;
  min-height: 52px;
  padding: 0 14px;
  border-radius: ${RADIUS.card};
  background-color: ${COLORS.background.subtle};
  color: ${COLORS.text.main};
  font-size: ${FONT_SIZE.bodyLarge};
  font-weight: ${FONT_WEIGHT.medium};
  text-align: left;
`;

const StepMark = styled.span`
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background-color: ${COLORS.white};
  color: ${COLORS.brand.main};
  font-size: ${FONT_SIZE.body};
  font-weight: ${FONT_WEIGHT.semibold};

  svg {
    width: 16px;
    height: 16px;
  }
`;
