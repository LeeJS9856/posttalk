import { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import SegmentedToggle from '@/components/common/SegmentedToggle';
import PageHeader from '@/components/layout/PageHeader';
import { AD_FORMAT_OPTIONS, DEFAULT_AD_FORMAT } from '@/constants/create';
import type { AdFormat } from '@/constants/home';
import { SUGGESTION_THEMES } from '@/constants/themes';
import { useAdDraft } from '@/hooks/useAdDraft';
import {
  ConceptCaption,
  ConceptCard,
  ConceptDescription,
  ConceptItem,
  ConceptLabel,
  ConceptMedia,
  ConceptRail,
  ConceptScrim,
  Content,
  Dot,
  Dots,
  Footer,
  FormatBar,
  NextButton,
  Page,
  Question,
} from '@/pages/Create/Create.styles';

const FORMAT_SEGMENTS = AD_FORMAT_OPTIONS.map(({ id, label }) => ({ id, label }));

const Create = (): React.JSX.Element => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const railRef = useRef<HTMLUListElement>(null);
  const { setConcept } = useAdDraft();

  const requestedTheme = searchParams.get('theme');
  const initialIndex = Math.max(
    SUGGESTION_THEMES.findIndex((theme) => theme.id === requestedTheme),
    0,
  );

  const [format, setFormat] = useState<AdFormat>(DEFAULT_AD_FORMAT);
  const [index, setIndex] = useState(initialIndex);

  // 홈에서 고른 콘셉트가 처음부터 가운데 오도록 레일을 옮겨둔다.
  useEffect(() => {
    const rail = railRef.current;
    if (!rail || initialIndex === 0) return;

    const target = rail.children[initialIndex] as HTMLElement | undefined;
    if (target) rail.scrollLeft = target.offsetLeft - rail.offsetLeft;
  }, [initialIndex]);

  const handleScroll = (): void => {
    const rail = railRef.current;
    if (!rail) return;

    const step = rail.scrollWidth / SUGGESTION_THEMES.length;
    const next = Math.min(
      Math.round(rail.scrollLeft / step),
      SUGGESTION_THEMES.length - 1,
    );
    if (next !== index) setIndex(next);
  };

  const scrollTo = (order: number): void => {
    const rail = railRef.current;
    const target = rail?.children[order] as HTMLElement | undefined;
    if (!rail || !target) return;

    rail.scrollTo({ left: target.offsetLeft - rail.offsetLeft, behavior: 'smooth' });
  };

  const concept = SUGGESTION_THEMES[index];

  const goNext = (): void => {
    setConcept({ format, theme: concept.id });
    navigate('/create/info');
  };

  return (
    <Page aria-label="광고 형식과 콘셉트 선택">
      <PageHeader title="광고 제작" onBack={() => navigate('/')} />

      <Content>
        <Question>어떤 광고를 만들까요?</Question>

        <FormatBar>
          <SegmentedToggle
            ariaLabel="광고 형식"
            options={FORMAT_SEGMENTS}
            value={format}
            onChange={setFormat}
          />
        </FormatBar>

        <ConceptRail ref={railRef} onScroll={handleScroll} aria-label="광고 콘셉트">
          {SUGGESTION_THEMES.map((theme, order) => (
            <ConceptItem key={theme.id}>
              <ConceptCard
                type="button"
                aria-label={`${theme.label} 콘셉트 선택`}
                aria-pressed={order === index}
                $selected={order === index}
                onClick={() => scrollTo(order)}
              >
                <ConceptMedia $surface={theme.tone.surface}>
                  {format === 'reels' ? (
                    <video src={theme.sample.reels} muted loop playsInline autoPlay />
                  ) : (
                    <img src={theme.sample.card_news} alt="" />
                  )}
                </ConceptMedia>
                <ConceptScrim aria-hidden="true" />
                <ConceptCaption>
                  <ConceptLabel>{theme.label}</ConceptLabel>
                  <ConceptDescription>{theme.description}</ConceptDescription>
                </ConceptCaption>
              </ConceptCard>
            </ConceptItem>
          ))}
        </ConceptRail>

        <Dots aria-hidden="true">
          {SUGGESTION_THEMES.map((theme, order) => (
            <Dot key={theme.id} $active={order === index} />
          ))}
        </Dots>
      </Content>

      <Footer>
        <NextButton type="button" onClick={goNext}>
          {concept.label} 광고 만들기
        </NextButton>
      </Footer>
    </Page>
  );
};

export default Create;
