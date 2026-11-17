import { useLayoutEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import AppHeader from '@/components/layout/AppHeader';
import BottomNavigation from '@/components/layout/BottomNavigation';
import { AD_FORMAT_OPTIONS, DEFAULT_AD_FORMAT } from '@/constants/create';
import { AD_FORMAT_LABEL, type AdFormat } from '@/constants/home';
import { SUGGESTION_THEMES, type SuggestionThemeId } from '@/constants/themes';
import { useAdDraft } from '@/hooks/useAdDraft';
import {
  Card,
  CARD_GAP_PX,
  CardStage,
  Content,
  Footer,
  FormatLabel,
  FormatOption,
  MoodLabel,
  MoodOption,
  MoodText,
  MoodThumb,
  NextButton,
  OptionDescription,
  OptionGrid,
  Page,
  PageDot,
  PageDots,
  Phone,
  PhoneTime,
  Preview,
  PreviewLabel,
  ReelsStage,
  ReelsTag,
  ReelsTags,
  SectionLabel,
} from '@/pages/Create/Create.styles';

/** 릴스 미리보기 옆에 붙이는 이름표. 카드뉴스에는 없는, 릴스에만 들어가는 것들이다. */
const REELS_EXTRAS = ['자막', '배경음악', '장면 전환'] as const;

/**
 * 광고 만들기의 첫 화면. 형식과 분위기를 한 화면에서 고른다.
 * 무엇을 고르든 위의 미리보기가 그 조합의 결과물 모양으로 바뀐다.
 * 형식 버튼에는 찍을 것 → 받을 것을 적어, 카드뉴스와 릴스의 차이를 이름만으로 짐작하지 않게 한다.
 */
const Create = (): React.JSX.Element => {
  const navigate = useNavigate();
  const { setConcept } = useAdDraft();

  // 형식과 콘셉트는 이 화면에서 한 번만 고른다. 홈에서 미리 고르게 하지 않는다.
  const [format, setFormat] = useState<AdFormat>(DEFAULT_AD_FORMAT);
  const [themeId, setThemeId] = useState<SuggestionThemeId>(SUGGESTION_THEMES[0].id);

  const theme = SUGGESTION_THEMES.find((item) => item.id === themeId) ?? SUGGESTION_THEMES[0];
  const [mainCard, leftCard, rightCard] = theme.preview.cards;
  // 넘겨 보는 순서. 가운데(대표) 카드에서 시작해 양옆으로 넘긴다.
  const cards = [leftCard, mainCard, rightCard];
  const combo = `${theme.label} ${AD_FORMAT_LABEL[format]}`;

  const stageRef = useRef<HTMLDivElement>(null);
  const [cardIndex, setCardIndex] = useState(1);

  // 형식이나 분위기를 바꾸면 대표 카드가 가운데 오도록 되돌린다.
  useLayoutEffect(() => {
    const stage = stageRef.current;
    const first = stage?.firstElementChild as HTMLElement | null;
    if (!stage || !first) return;
    stage.scrollLeft = first.offsetWidth + CARD_GAP_PX;
    setCardIndex(1);
  }, [format, themeId]);

  const onCardScroll = (): void => {
    const stage = stageRef.current;
    const first = stage?.firstElementChild as HTMLElement | null;
    if (!stage || !first) return;
    const next = Math.round(stage.scrollLeft / (first.offsetWidth + CARD_GAP_PX));
    setCardIndex(Math.min(Math.max(next, 0), cards.length - 1));
  };

  const goNext = (): void => {
    setConcept({ format, theme: theme.id });
    navigate('/create/info');
  };

  return (
    <Page aria-label="광고 형식과 분위기 선택">
      {/* 하단 메뉴의 한 탭이라 뒤로 버튼을 두지 않는다. 다른 탭(보관함·마이)과 머리를 맞춘다. */}
      <AppHeader title="새 광고" />

      <Content>
        <Preview aria-label={`${combo} 미리보기`}>
          <PreviewLabel>{combo} 예시</PreviewLabel>

          {format === 'card_news' ? (
            <>
              <CardStage ref={stageRef} onScroll={onCardScroll} aria-hidden="true">
                {cards.map((src, index) => (
                  <Card key={src} src={src} alt="" draggable={false} $active={index === cardIndex} />
                ))}
              </CardStage>
              <PageDots aria-hidden="true">
                {cards.map((src, index) => (
                  <PageDot key={src} $active={index === cardIndex} />
                ))}
              </PageDots>
            </>
          ) : (
            <ReelsStage aria-hidden="true">
              <Phone>
                <video
                  key={theme.id}
                  src={theme.preview.reels.video}
                  poster={theme.preview.reels.poster}
                  muted
                  loop
                  playsInline
                  autoPlay
                />
                <PhoneTime>0:13</PhoneTime>
              </Phone>
              <ReelsTags>
                {REELS_EXTRAS.map((extra) => (
                  <ReelsTag key={extra}>{extra}</ReelsTag>
                ))}
              </ReelsTags>
            </ReelsStage>
          )}
        </Preview>

        <SectionLabel id="format-label">형식</SectionLabel>
        <OptionGrid role="radiogroup" aria-labelledby="format-label">
          {AD_FORMAT_OPTIONS.map((option) => (
            <FormatOption
              key={option.id}
              type="button"
              role="radio"
              aria-checked={format === option.id}
              $selected={format === option.id}
              onClick={() => setFormat(option.id)}
            >
              <FormatLabel>{option.label}</FormatLabel>
              <OptionDescription>{option.description}</OptionDescription>
            </FormatOption>
          ))}
        </OptionGrid>

        <SectionLabel id="mood-label">분위기</SectionLabel>
        <OptionGrid role="radiogroup" aria-labelledby="mood-label">
          {SUGGESTION_THEMES.map((item) => (
            <MoodOption
              key={item.id}
              type="button"
              role="radio"
              aria-checked={themeId === item.id}
              $selected={themeId === item.id}
              onClick={() => setThemeId(item.id)}
            >
              <MoodThumb src={item.thumb} alt="" />
              <MoodText>
                <MoodLabel>{item.label}</MoodLabel>
                <OptionDescription>{item.description}</OptionDescription>
              </MoodText>
            </MoodOption>
          ))}
        </OptionGrid>
      </Content>

      <Footer>
        <NextButton type="button" onClick={goNext}>
          {combo} 만들기
        </NextButton>
      </Footer>

      {/* 제작 흐름의 입구까지만 하단 메뉴를 둔다. 다음 화면부터는 이탈을 막으려 감춘다. */}
      <BottomNavigation />
    </Page>
  );
};

export default Create;
