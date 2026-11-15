import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { isAbortError } from '@/apis/api';
import { getGenerationProgress, type GenerationProgress } from '@/apis/posttalk';
import {
  ESTIMATED_SECONDS,
  GENERATION_FAILED_NOTICE,
  POLL_INTERVAL_MS,
  SLIDE_INTERVAL_MS,
  buildSteps,
  stepIndexOf,
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
  const { draft, resetDraft } = useAdDraft();

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
  const [progress, setProgress] = useState<GenerationProgress | null>(null);
  /** 조회가 잠시 끊겼는지. 생성은 서버에서 계속되므로 안내만 하고 계속 묻는다. */
  const [isOffline, setIsOffline] = useState(false);

  const session = draft.session;
  const jobId = session?.jobId;
  // 새로고침하면 찍은 재료(메모리)는 사라지지만 생성 작업 번호는 탭에 남아 있다. 작업 번호만 있으면 이어서 기다린다.
  const hasJob = Boolean(jobId);
  const stepIndex = stepIndexOf(progress, steps.length);

  // 생성 중 이탈하면 결과물을 놓친다. 안드로이드 하드웨어 뒤로 버튼까지 붙잡는다.
  useEffect(() => {
    if (!hasJob) return;

    const hold = (): void => window.history.pushState(null, '', window.location.href);
    hold();
    window.addEventListener('popstate', hold);

    return () => window.removeEventListener('popstate', hold);
  }, [hasJob]);

  useEffect(() => {
    if (assets.length < 2) return;

    const timer = window.setInterval(() => {
      setSlide((current) => (current + 1) % assets.length);
    }, SLIDE_INTERVAL_MS);

    return () => window.clearInterval(timer);
  }, [assets.length]);

  /**
   * 진행률 조회. 끝날 때까지 정해진 간격으로 묻는다.
   * 생성은 서버에서 돌아가므로 조회가 실패해도 다시 요청을 보내지 않고 다음 조회만 기다린다.
   */
  useEffect(() => {
    if (!jobId) return;

    const controller = new AbortController();
    let timer: number | undefined;

    const poll = async (): Promise<void> => {
      try {
        const next = await getGenerationProgress(jobId, controller.signal);
        setProgress(next);
        setIsOffline(false);

        if (next.status === 'completed') {
          const target = session?.submissionId ?? session?.sessionId;
          void navigate(`/ads/${target}?from=create&session=${session?.sessionId}`, {
            replace: true,
          });
          return;
        }
        if (next.status === 'failed') {
          // 같은 재료로 다시 돌리는 API 가 없다. 재료를 비우고 홈에서 실패를 알린다.
          resetDraft();
          void navigate('/', { replace: true, state: { notice: GENERATION_FAILED_NOTICE } });
          return;
        }
      } catch (cause) {
        if (isAbortError(cause)) return;
        setIsOffline(true);
      }
      timer = window.setTimeout(() => void poll(), POLL_INTERVAL_MS);
    };

    void poll();

    return () => {
      controller.abort();
      window.clearTimeout(timer);
    };
    // 세션 값은 생성이 시작된 뒤 바뀌지 않는다.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jobId]);

  if (!hasJob) {
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
      <Note role="status">
        {isOffline
          ? '연결이 잠시 끊겼어요. 다시 확인하고 있어요'
          : (progress?.message ?? `${ESTIMATED_SECONDS}초쯤 걸려요. 화면을 끄지 말아주세요`)}
      </Note>

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
