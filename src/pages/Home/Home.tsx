import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import settingsIcon from '@/assets/icons/settings.svg?raw';
import BottomNavigation from '@/components/layout/BottomNavigation';
import { AD_FORMAT_LABEL, HOME_AD_PREVIEW_COUNT, SAMPLE_ADS } from '@/constants/home';
import { UNBUILT_NOTICE } from '@/constants/navigation';
import type { SuggestionThemeId } from '@/constants/themes';
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
  Toast,
} from '@/pages/Home/Home.styles';

const TOAST_DURATION_MS = 1800;

const Home = (): React.JSX.Element => {
  const navigate = useNavigate();
  const [notice, setNotice] = useState<string | null>(null);

  const ads = SAMPLE_ADS.slice(0, HOME_AD_PREVIEW_COUNT);

  useEffect(() => {
    if (!notice) return;

    const timer = window.setTimeout(() => setNotice(null), TOAST_DURATION_MS);
    return () => window.clearTimeout(timer);
  }, [notice]);

  const startWithTheme = (themeId: SuggestionThemeId): void => {
    navigate(`/create?theme=${themeId}`);
  };

  return (
    <Page aria-label="홈">
      <Header>
        <BrandName>PostTalk</BrandName>
        <IconButton type="button" aria-label="설정" onClick={() => setNotice(UNBUILT_NOTICE)}>
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

      {notice && <Toast role="status">{notice}</Toast>}

      <BottomNavigation onUnbuilt={setNotice} />
    </Page>
  );
};

export default Home;
