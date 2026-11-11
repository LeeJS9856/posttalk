import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import settingsIcon from '@/assets/icons/settings.svg?raw';
import ActionSheet, { type ActionSheetItem } from '@/components/common/ActionSheet';
import Toast from '@/components/common/Toast';
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
  BrandName,
  Content,
  EmptyNotice,
  Header,
  IconButton,
  Page,
  SectionAction,
  SectionHeader,
  SectionTitle,
} from '@/pages/Home/Home.styles';

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

  const [notice, setNotice] = useState<string | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const ads = SAMPLE_ADS.slice(0, HOME_AD_PREVIEW_COUNT);

  /** 체험 기록을 남기지 않고 운영자 화면으로 돌아간다. */
  const handleSignOut = (): void => {
    setIsSettingsOpen(false);
    resetDraft();
    signOut();
    navigate('/login', { replace: true });
  };

  const settingsItems: ActionSheetItem[] = [
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
      <Header>
        <BrandName>PostTalk</BrandName>
        <IconButton
          type="button"
          aria-label="설정"
          aria-haspopup="dialog"
          onClick={() => setIsSettingsOpen(true)}
        >
          <span aria-hidden="true" dangerouslySetInnerHTML={{ __html: settingsIcon }} />
        </IconButton>
      </Header>

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

      <Toast message={notice} onDismiss={() => setNotice(null)} />

      <BottomNavigation onUnbuilt={setNotice} />

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
