import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

import { COLORS } from '@/constants/colors';
import {
  SUGGESTION_INTERVAL_MS,
  SUGGESTION_THEMES,
  type SuggestionThemeId,
} from '@/constants/themes';
import { FONT_SIZE, FONT_WEIGHT } from '@/constants/typography';

type SuggestionCarouselProps = {
  onSelect: (themeId: SuggestionThemeId) => void;
};

const prefersReducedMotion = (): boolean =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const SuggestionCarousel = ({ onSelect }: SuggestionCarouselProps): React.JSX.Element => {
  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const panelRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isPaused) return;

    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % SUGGESTION_THEMES.length);
    }, SUGGESTION_INTERVAL_MS);

    return () => window.clearInterval(timer);
  }, [isPaused]);

  // 문구가 바뀔 때 한 박자 올라오게 한다. 모션을 줄여둔 기기에서는 건너뛴다.
  useEffect(() => {
    const panel = panelRef.current;
    if (!panel || prefersReducedMotion()) return;

    panel.querySelectorAll('[data-animate]').forEach((line, order) => {
      line.animate(
        [
          { opacity: 0, transform: 'translateY(6px)' },
          { opacity: 1, transform: 'none' },
        ],
        {
          duration: 360,
          delay: order * 45,
          easing: 'cubic-bezier(0.2, 0.85, 0.25, 1)',
          fill: 'backwards',
        },
      );
    });
  }, [index]);

  const theme = SUGGESTION_THEMES[index];

  return (
    <Section>
      <Panel
        ref={panelRef}
        type="button"
        $surface={theme.tone.surface}
        aria-live="polite"
        onClick={() => onSelect(theme.id)}
        onPointerDown={() => setIsPaused(true)}
        onPointerEnter={() => setIsPaused(true)}
        onPointerUp={() => setIsPaused(false)}
        onPointerLeave={() => setIsPaused(false)}
        onPointerCancel={() => setIsPaused(false)}
      >
        <Orb $color={theme.tone.orb} $size={96} style={{ right: '-22px', top: '-30px' }} />
        <Orb $color={theme.tone.orb} $size={54} style={{ right: '46px', bottom: '-22px' }} />

        <Kicker data-animate $color={theme.tone.kicker}>
          {theme.kicker}
        </Kicker>
        <Title data-animate>{theme.title}</Title>
        <Description data-animate $color={theme.tone.description}>
          {theme.description}
        </Description>
        <ActionText data-animate>
          {theme.action}
          <Arrow aria-hidden="true">→</Arrow>
        </ActionText>
      </Panel>

      <Dots aria-hidden="true">
        {SUGGESTION_THEMES.map((item, order) => (
          <Dot key={item.id} $active={order === index} />
        ))}
      </Dots>
    </Section>
  );
};

const Section = styled.section`
  flex-shrink: 0;
`;

const Panel = styled.button<{ $surface: string }>`
  position: relative;
  display: block;
  overflow: hidden;
  width: 100%;
  min-height: 212px;
  padding: 28px 16px 30px;
  background: ${({ $surface }) => $surface};
  text-align: left;
  transition:
    background 0.6s cubic-bezier(0.2, 0.8, 0.2, 1),
    transform 0.18s cubic-bezier(0.2, 0.85, 0.25, 1);

  &:active {
    transform: scale(0.985);
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

const Orb = styled.span<{ $color: string; $size: number }>`
  position: absolute;
  width: ${({ $size }) => $size}px;
  height: ${({ $size }) => $size}px;
  border-radius: 50%;
  background-color: ${({ $color }) => $color};
  opacity: 0.5;
  transition: background-color 0.6s ease;
`;

const Kicker = styled.span<{ $color: string }>`
  position: relative;
  display: block;
  margin-bottom: 6px;
  color: ${({ $color }) => $color};
  font-size: ${FONT_SIZE.label};
  font-weight: ${FONT_WEIGHT.medium};
  letter-spacing: 0.04em;
`;

const Title = styled.span`
  position: relative;
  display: block;
  margin-bottom: 5px;
  color: ${COLORS.text.main};
  font-size: ${FONT_SIZE.title};
  font-weight: ${FONT_WEIGHT.medium};
  line-height: 1.35;
  white-space: pre-line;
`;

const Description = styled.span<{ $color: string }>`
  position: relative;
  display: block;
  margin-bottom: 18px;
  color: ${({ $color }) => $color};
  font-size: ${FONT_SIZE.body};
  line-height: 1.5;
`;

const ActionText = styled.span`
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  color: ${COLORS.text.main};
  font-size: ${FONT_SIZE.bodyLarge};
  font-weight: ${FONT_WEIGHT.medium};
`;

const Arrow = styled.span`
  font-size: ${FONT_SIZE.bodyLarge};
  line-height: 1;
`;

const Dots = styled.div`
  display: flex;
  justify-content: center;
  gap: 5px;
  padding-top: 11px;
`;

const Dot = styled.span<{ $active: boolean }>`
  width: ${({ $active }) => ($active ? '14px' : '5px')};
  height: 5px;
  border-radius: 3px;
  background-color: ${({ $active }) => ($active ? COLORS.brand.main : COLORS.border.strong)};
  transition:
    width 0.3s ease,
    background-color 0.3s ease;
`;

export default SuggestionCarousel;
