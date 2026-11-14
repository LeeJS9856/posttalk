import { useNavigate } from 'react-router-dom';

import AppHeader from '@/components/layout/AppHeader';
import BrandLogo from '@/components/layout/BrandLogo';
import SettingsButton from '@/components/layout/SettingsButton';
import BottomNavigation from '@/components/layout/BottomNavigation';
import { AD_FORMAT_LABEL, HOME_AD_PREVIEW_COUNT, SAMPLE_ADS } from '@/constants/home';
import type { SuggestionThemeId } from '@/constants/themes';
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
  Page,
  SectionAction,
  SectionHeader,
  SectionTitle,
} from '@/pages/Home/Home.styles';

const Home = (): React.JSX.Element => {
  const navigate = useNavigate();


  const ads = SAMPLE_ADS.slice(0, HOME_AD_PREVIEW_COUNT);

  const startWithTheme = (themeId: SuggestionThemeId): void => {
    navigate(`/create?theme=${themeId}`);
  };

  return (
    <Page aria-label="홈">
      <AppHeader logo={<BrandLogo size={24} />} title="PostTalk" action={<SettingsButton />} />

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
    </Page>
  );
};

export default Home;
