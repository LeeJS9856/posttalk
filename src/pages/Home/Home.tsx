import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import settingsIcon from '@/assets/icons/settings.svg?raw';
import ActionSheet, { type ActionSheetItem } from '@/components/common/ActionSheet';
import AppHeader from '@/components/layout/AppHeader';
import BottomNavigation from '@/components/layout/BottomNavigation';
import { AD_FORMAT_LABEL, HOME_AD_PREVIEW_COUNT, SAMPLE_ADS } from '@/constants/home';
import type { SuggestionThemeId } from '@/constants/themes';
import { useAdDraft } from '@/hooks/useAdDraft';
import { useAuth } from '@/hooks/useAuth';
import SuggestionCarousel from '@/pages/Home/SuggestionCarousel';
import {
  AdButton,
  AdFormatLabel,
  AdItem,
  AdRail,
  AdThumbnail,
  AdTitle,
  Content,
  EmptyNotice,
  IconButton,
  Page,
  SectionAction,
  SectionHeader,
  SectionTitle,
} from '@/pages/Home/Home.styles';

const PersonIcon = (): React.JSX.Element => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <circle cx="12" cy="8.5" r="3.5" stroke="currentColor" strokeWidth="1.7" />
    <path d="M5 20c0-3.3 3.1-5.5 7-5.5s7 2.2 7 5.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
  </svg>
);

const FolderIcon = (): React.JSX.Element => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M3.5 6.5h6l2 2.5h9v9.5h-17V6.5Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
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

const Home = (): React.JSX.Element => {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const { resetDraft } = useAdDraft();

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const ads = SAMPLE_ADS.slice(0, HOME_AD_PREVIEW_COUNT);

  /** 체험 기록을 남기지 않고 운영자 화면으로 돌아간다. */
  const handleSignOut = (): void => {
    setIsSettingsOpen(false);
    resetDraft();
    signOut();
    navigate('/login', { replace: true });
  };

  const go = (path: string): void => {
    setIsSettingsOpen(false);
    navigate(path);
  };

  const settingsItems: ActionSheetItem[] = [
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

  const startWithTheme = (themeId: SuggestionThemeId): void => {
    navigate(`/create?theme=${themeId}`);
  };

  return (
    <Page aria-label="홈">
      <AppHeader
        title="PostTalk"
        action={
          <IconButton
            type="button"
            aria-label="설정"
            aria-haspopup="dialog"
            onClick={() => setIsSettingsOpen(true)}
          >
            <span aria-hidden="true" dangerouslySetInnerHTML={{ __html: settingsIcon }} />
          </IconButton>
        }
      />

      <Content>
        <SuggestionCarousel onSelect={startWithTheme} />

        <SectionHeader>
          <SectionTitle>만든 광고</SectionTitle>
          {ads.length > 0 && (
            <SectionAction type="button" onClick={() => navigate('/archive')}>
              전체 보기
            </SectionAction>
          )}
        </SectionHeader>

        {ads.length > 0 ? (
          <AdRail>
            {ads.map((ad) => (
              <AdItem key={ad.adId}>
                <AdButton
                  type="button"
                  aria-label={`${ad.title} 광고 열기`}
                  onClick={() => navigate(`/ads/${ad.adId}`)}
                >
                  <AdThumbnail src={ad.thumbnailUrl} alt="" />
                  <AdTitle>{ad.title}</AdTitle>
                  <AdFormatLabel>{AD_FORMAT_LABEL[ad.format]}</AdFormatLabel>
                </AdButton>
              </AdItem>
            ))}
          </AdRail>
        ) : (
          <EmptyNotice>아직 만든 광고가 없어요. 위에서 하나 만들어보세요.</EmptyNotice>
        )}
      </Content>

      <BottomNavigation />

      <ActionSheet
        open={isSettingsOpen}
        title="설정"
        description="전시 중에는 건드리지 않아도 돼요"
        items={settingsItems}
        onClose={() => setIsSettingsOpen(false)}
      />
    </Page>
  );
};

export default Home;
