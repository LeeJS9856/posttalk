import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import AppHeader from '@/components/layout/AppHeader';
import BottomNavigation from '@/components/layout/BottomNavigation';
import SettingsButton from '@/components/layout/SettingsButton';
import { useAds } from '@/hooks/useAds';
import { useShop } from '@/hooks/useShop';
import {
  Avatar,
  Content,
  CountBox,
  CountLabel,
  CountValue,
  Counts,
  EditButton,
  EmptyRow,
  Page,
  Row,
  RowBody,
  RowIcon,
  RowNote,
  RowTitle,
  SectionTitle,
  ShopCard,
  ShopDescription,
  ShopName,
  ShopRow,
  ShopText,
} from '@/pages/My/My.styles';

const StoreIcon = (): React.JSX.Element => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M4 9.5 5.5 5h13L20 9.5M4 9.5h16M4 9.5v9.5h16V9.5M4 9.5a2.5 2.5 0 0 0 5 0 2.5 2.5 0 0 0 5 0 2.5 2.5 0 0 0 5 0"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinejoin="round"
    />
  </svg>
);

const My = (): React.JSX.Element => {
  const navigate = useNavigate();
  const { profile, templates } = useShop();

  const { ads } = useAds();
  const counts = useMemo(() => {
    const published = ads.filter((ad) => ad.status === 'published').length;
    return { made: ads.length, published, waiting: ads.length - published };
  }, [ads]);

  return (
    <Page aria-label="마이">
      <AppHeader title="마이" action={<SettingsButton />} />

      <Content>
        <ShopCard>
          <ShopRow>
            <Avatar aria-hidden="true">{profile.name.slice(0, 1) || '가'}</Avatar>
            <ShopText>
              <ShopName>{profile.name || '가게 이름을 적어주세요'}</ShopName>
              <ShopDescription>{profile.description || '수정을 눌러 가게를 소개해 주세요'}</ShopDescription>
            </ShopText>
            <EditButton type="button" onClick={() => navigate('/my/edit')}>
              수정
            </EditButton>
          </ShopRow>

          <Counts>
            <CountBox>
              <CountValue>{counts.made}</CountValue>
              <CountLabel>만든 광고</CountLabel>
            </CountBox>
            <CountBox>
              <CountValue>{counts.published}</CountValue>
              <CountLabel>올린 광고</CountLabel>
            </CountBox>
            <CountBox>
              <CountValue>{counts.waiting}</CountValue>
              <CountLabel>보관 중</CountLabel>
            </CountBox>
          </Counts>
        </ShopCard>

        {/* 인스타그램 연결 정보는 백엔드가 아직 주지 않는다. 게시 기능을 켤 때 다시 둔다. */}
        <SectionTitle>저장된 메뉴 {templates.length}개</SectionTitle>
        {templates.length === 0 ? (
          <EmptyRow>메뉴를 입력할 때 저장해두면 여기 쌓여요</EmptyRow>
        ) : (
          templates.map((template) => (
            <Row key={template.templateId}>
              <RowIcon aria-hidden="true">
                <StoreIcon />
              </RowIcon>
              <RowBody>
                <RowTitle>{template.name}</RowTitle>
                <RowNote>{template.description || '설명 없음'}</RowNote>
              </RowBody>
            </Row>
          ))
        )}
      </Content>

      <BottomNavigation />
    </Page>
  );
};

export default My;
