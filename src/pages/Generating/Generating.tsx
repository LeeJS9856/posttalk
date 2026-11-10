import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  ESTIMATED_SECONDS,
  SAMPLE_GENERATED_AD_ID,
  SLIDE_INTERVAL_MS,
  buildSteps,
} from '@/constants/generating';
import { useAdDraft } from '@/hooks/useAdDraft';
import {
  BackButton,
  Dot,
  Dots,
  EmptyText,
  EmptyWrap,
  Frame,
  Heading,
  Note,
  Page,
  Slide,
  SlideImage,
  SlideVideo,
  Spinner,
  Step,
  StepMark,
  Steps,
} from '@/pages/Generating/Generating.styles';

const CheckIcon = (): React.JSX.Element => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M5 12.5l4.5 4.5L19 7.5"
      stroke="currentColor"
      strokeWidth="2.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const Generating = (): React.JSX.Element => {
  const navigate = useNavigate();
  const { draft } = useAdDraft();

  const steps = useMemo(() => buildSteps(draft.format), [draft.format]);
  const assets = useMemo(
    () =>
      Object.keys(draft.captures)
        .map(Number)
        .sort((a, b) => a - b)
        .map((index) => draft.captures[index]),
    [draft.captures],
  );

  const [slide, setSlide] = useState(0);
  const [stepIndex, setStepIndex] = useState(0);

  const hasAssets = assets.length > 0;

  // 생성 중 이탈하면 결과물을 놓친다. 안드로이드 하드웨어 뒤로 버튼까지 붙잡는다.
  useEffect(() => {
    if (!hasAssets) return;

    const hold = (): void => window.history.pushState(null, '', window.location.href);
    hold();
    window.addEventListener('popstate', hold);

    return () => window.removeEventListener('popstate', hold);
  }, [hasAssets]);

  useEffect(() => {
    if (assets.length < 2) return;

    const timer = window.setInterval(() => {
      setSlide((current) => (current + 1) % assets.length);
    }, SLIDE_INTERVAL_MS);

    return () => window.clearInterval(timer);
  }, [assets.length]);

  /**
   * 단계 진행. 지금은 시간으로 넘긴다.
   * 생성 API 가 붙으면 진행률 응답의 단계로 이 값을 채운다.
   * 퍼센트만 온다면 단계 수로 구간을 나눠 같은 자리에 넣는다.
   */
  useEffect(() => {
    if (!hasAssets) return;

    const perStep = (ESTIMATED_SECONDS * 1000) / steps.length;
    const timer = window.setInterval(() => {
      setStepIndex((current) => current + 1);
    }, perStep);

    return () => window.clearInterval(timer);
  }, [hasAssets, steps.length]);

  useEffect(() => {
    if (stepIndex < steps.length) return;
    navigate(`/ads/${SAMPLE_GENERATED_AD_ID}`, { replace: true });
  }, [stepIndex, steps.length, navigate]);

  if (!hasAssets) {
    return (
      <Page aria-label="생성 대기">
        <EmptyWrap>
          <EmptyText>
            만들 재료가 없어요.
            <br />
            사진부터 올려주세요.
          </EmptyText>
          <BackButton type="button" onClick={() => navigate('/create')}>
            처음부터 하기
          </BackButton>
        </EmptyWrap>
      </Page>
    );
  }

  return (
    <Page aria-label="생성 대기">
      <Frame>
        {assets.map((asset, order) => (
          <Slide key={asset.previewUrl} $shown={order === slide}>
            {asset.kind === 'video' ? (
              <SlideVideo src={asset.previewUrl} autoPlay loop muted playsInline />
            ) : (
              <SlideImage src={asset.previewUrl} alt="" />
            )}
          </Slide>
        ))}
        <Dots aria-hidden="true">
          {assets.map((asset, order) => (
            <Dot key={asset.previewUrl} $on={order === slide} />
          ))}
        </Dots>
      </Frame>

      <Heading>
        올려주신 재료로
        <br />
        광고를 만들고 있어요
      </Heading>
      <Note>{ESTIMATED_SECONDS}초쯤 걸려요. 화면을 끄지 말아주세요</Note>

      <Steps aria-live="polite">
        {steps.map((step, order) => {
          const done = order < stepIndex;
          const active = order === stepIndex;

          return (
            <Step key={step.key} $done={done} $active={active}>
              <StepMark>
                {done ? <CheckIcon /> : active ? <Spinner aria-hidden="true" /> : null}
              </StepMark>
              {step.label}
            </Step>
          );
        })}
      </Steps>
    </Page>
  );
};

export default Generating;
