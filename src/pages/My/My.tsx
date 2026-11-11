import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import AppHeader from '@/components/layout/AppHeader';
import BottomNavigation from '@/components/layout/BottomNavigation';
import { SAMPLE_AD_DETAILS } from '@/constants/ads';
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
  LinkedMark,
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

const InstagramIcon = (): React.JSX.Element => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <rect x="3.5" y="3.5" width="17" height="17" rx="5" stroke="currentColor" strokeWidth="1.7" />
    <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.7" />
    <circle cx="17" cy="7" r="1.1" fill="currentColor" />
  </svg>
);

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

const CheckIcon = (): React.JSX.Element => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M5 12.5l4.5 4.5L19 7.5"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const My = (): React.JSX.Element => {
  const navigate = useNavigate();
  const { profile, templates } = useShop();

  // 광고 목록 API 가 붙으면 그 응답에서 센다.
  const counts = useMemo(() => {
    const published = SAMPLE_AD_DETAILS.filter((ad) => ad.status === 'published').length;
    return {
      made: SAMPLE_AD_DETAILS.length,
      published,
      waiting: SAMPLE_AD_DETAILS.length - published,
    };
  }, []);

  return (
    <Page aria-label="마이">
      <AppHeader title="마이" />

      <Content>
        <ShopCard>
          <ShopRow>
            <Avatar aria-hidden="true">{profile.name.slice(0, 1)}</Avatar>
            <ShopText>
              <ShopName>{profile.name}</ShopName>
              <ShopDescription>{profile.description}</ShopDescription>
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
              <CountLabel>안 올린 광고</CountLabel>
            </CountBox>
          </Counts>
        </ShopCard>

        <SectionTitle>연결된 계정</SectionTitle>
        <Row>
          <RowIcon aria-hidden="true">
            <InstagramIcon />
          </RowIcon>
          <RowBody>
            <RowTitle>인스타그램</RowTitle>
            <RowNote>{profile.instagram}</RowNote>
          </RowBody>
          <LinkedMark aria-label="연결됨">
            <CheckIcon />
          </LinkedMark>
        </Row>

        <SectionTitle>저장된 내용 {templates.length}개</SectionTitle>
        {templates.length === 0 ? (
          <EmptyRow>정보를 입력할 때 저장해두면 여기 쌓여요</EmptyRow>
        ) : (
          templates.map((template) => (
            <Row key={template.templateId}>
              <RowIcon aria-hidden="true">
                <StoreIcon />
              </RowIcon>
              <RowBody>
                <RowTitle>{template.name}</RowTitle>
                <RowNote>메뉴 {template.menus.length}개</RowNote>
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
