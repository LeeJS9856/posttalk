import { Camera, Check, Image } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { isAbortError } from '@/apis/api';
import { needsRetake, retakeMessage, startSession } from '@/apis/creation';
import { getAdSession, submitShot, type ShotRequest } from '@/apis/posttalk';
import ActionSheet, { type ActionSheetItem } from '@/components/common/ActionSheet';
import AppHeader from '@/components/layout/AppHeader';
import { CARD_NEWS_SCENES, type CaptureSource, type Scene } from '@/constants/scenes';
import { useAdDraft } from '@/hooks/useAdDraft';
import { useWorkspace } from '@/hooks/useWorkspace';
import {
  Bar,
  Content,
  ErrorText,
  Footer,
  Grid,
  NextButton,
  Page,
  Progress,
  SlotAction,
  SlotBadge,
  SlotButton,
  SlotFrame,
  SlotImage,
  SlotLabel,
  SlotStatus,
  Track,
} from '@/pages/Capture/CaptureList.styles';

const ORDER_MISMATCH_MESSAGE = '사진 순서가 서버와 맞지 않아요. 처음부터 다시 해주세요.';

type FooterAction = 'info' | 'generating' | 'workspace' | 'retryUploads' | 'submit';
type FooterState = { label: string; action?: FooterAction };
type SlotState = { tone: 'muted' | 'danger'; text: string } | null;

/**
 * 카드뉴스 촬영 목록. 찍을 장면 6개를 처음부터 보여 주고, 어느 칸이든 먼저 찍을 수 있다.
 * 찍은 사진은 바로 뒤에서 올려 두고(관람객은 기다리지 않는다), 다 찍으면 "광고 만들기"에서
 * 세션을 열어 서버 순서대로 몰아서 제출한다.
 * 서버가 어느 장을 다시 찍으라고 하면 그 칸에 표시하고, 다시 찍으면 그 장부터 이어서 제출한다.
 * 이미 서버가 받아 준 칸은 다시 찍을 수 없다.
 */
const CardNewsCaptureList = (): React.JSX.Element => {
  const navigate = useNavigate();
  const { draft, setSession, markSubmitted, rejectCapture, setGeneration, retryUploads } =
    useAdDraft();
  const {
    storeId,
    status: workspaceStatus,
    error: workspaceError,
    retry: retryWorkspace,
  } = useWorkspace();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const submitRef = useRef<AbortController | null>(null);
  useEffect(() => () => submitRef.current?.abort(), []);

  /** 어떤 장면의 경로를 묻고 있는지. 닫는 동안에도 내용이 남아 있어야 해서 따로 둔다. */
  const [asking, setAsking] = useState<Scene | null>(null);
  const [isAsking, setIsAsking] = useState(false);

  const scenes = CARD_NEWS_SCENES;
  const session = draft.session;
  const submitted = session?.submittedCount ?? 0;
  const assets = scenes.map((scene) => draft.captures[scene.index]);
  const takenCount = assets.filter(Boolean).length;
  const uploadingCount = assets.filter((asset) => asset?.upload?.status === 'uploading').length;
  const failedCount = assets.filter((asset) => asset?.upload?.status === 'error').length;
  const rejectedIndex = assets.findIndex((asset) => Boolean(asset?.rejection));

  const hasInfo = draft.storeDescription.length > 0 && draft.menus.length > 0;
  const workspaceFailed = hasInfo && !storeId && workspaceStatus === 'error';

  const go = (scene: Scene, source: CaptureSource): void => {
    setIsAsking(false);
    void navigate(`/create/capture/${scene.index}?source=${source}`);
  };

  const items: ActionSheetItem[] = asking
    ? [
        {
          key: 'camera',
          icon: <Camera />,
          label: '지금 찍기',
          description: '카메라가 열려요',
          recommended: asking.recommended === 'camera',
          onSelect: () => go(asking, 'camera'),
        },
        {
          key: 'gallery',
          icon: <Image />,
          label: '갤러리에서 고르기',
          description: '기기에 있는 사진 중에서',
          recommended: asking.recommended === 'gallery',
          onSelect: () => go(asking, 'gallery'),
        },
      ]
    : [];

  /**
   * 세션을 열고(없으면) 아직 받지 않은 장부터 서버 순서대로 제출한다.
   * 서버가 요구한 장면이 우리 순서와 다르면 멈춘다.
   */
  const submitAll = async (): Promise<void> => {
    if (isSubmitting || !storeId) return;
    const controller = new AbortController();
    submitRef.current = controller;
    const { signal } = controller;
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      let sessionId = session?.sessionId;
      let next: ShotRequest | null = session?.nextShot ?? null;
      if (!sessionId) {
        const started = await startSession(draft, storeId, draft.storeName, signal);
        sessionId = started.sessionId;
        next = started.currentRequest ?? null;
        setSession({ sessionId, nextShot: next });
      }

      for (let index = submitted; index < scenes.length; index += 1) {
        const scene = scenes[index];
        const upload = draft.captures[index]?.upload;
        if (upload?.status !== 'done') throw new Error('아직 올라가지 않은 사진이 있어요.');
        if (next && next.shotKey !== scene.shotKey) throw new Error(ORDER_MISMATCH_MESSAGE);

        const result = await submitShot(sessionId, 'photo', upload.uploaded, signal);

        if (needsRetake(result)) {
          rejectCapture(index, retakeMessage(result));
          markSubmitted(index, next);
          return;
        }

        next = result.request ?? null;
        markSubmitted(index + 1, next);

        if (result.generationJobId) {
          setGeneration({ jobId: result.generationJobId, submissionId: result.submissionId });
          void navigate('/create/generating', { replace: true });
          return;
        }
      }

      // 다 보냈는데 생성 번호를 못 받았다(응답이 끊긴 경우). 서버에서 지금 상태를 다시 받는다.
      const latest = await getAdSession(sessionId, signal);
      if (latest.generation?.jobId) {
        setGeneration({
          jobId: latest.generation.jobId,
          submissionId: latest.submission?.submissionId,
        });
        void navigate('/create/generating', { replace: true });
        return;
      }
      throw new Error('광고 만들기를 시작하지 못했어요. 다시 시도해 주세요.');
    } catch (cause) {
      if (isAbortError(cause)) return;
      setSubmitError(cause instanceof Error ? cause.message : '광고 만들기를 시작하지 못했어요.');
    } finally {
      if (submitRef.current === controller) {
        submitRef.current = null;
        setIsSubmitting(false);
      }
    }
  };

  const rejected = rejectedIndex >= 0 ? scenes[rejectedIndex] : undefined;

  const errorMessage = workspaceFailed
    ? (workspaceError ?? '서버에 연결하지 못했어요.')
    : rejected
      ? `${rejected.label}: ${assets[rejected.index]?.rejection ?? '다시 찍어주세요.'}`
      : failedCount > 0
        ? `사진 ${failedCount}장을 올리지 못했어요. 다시 올려주세요.`
        : submitError;

  const footerState = (): FooterState => {
    if (!hasInfo) return { label: '정보 입력으로', action: 'info' };
    if (session?.jobId) return { label: '광고 만들기', action: 'generating' };
    if (workspaceFailed) return { label: '다시 시도하기', action: 'workspace' };
    if (takenCount < scenes.length) return { label: `${scenes.length - takenCount}장 더 올려주세요` };
    if (rejected) return { label: `${rejected.label} 다시 올려주세요` };
    if (failedCount > 0) return { label: '다시 올리기', action: 'retryUploads' };
    if (uploadingCount > 0) return { label: '사진을 올리고 있어요' };
    if (isSubmitting) return { label: '광고 만들기를 시작하고 있어요' };
    return { label: '광고 만들기', action: storeId ? 'submit' : undefined };
  };
  const footer = footerState();

  const runFooter = (action: FooterAction): void => {
    if (action === 'info') void navigate('/create/info', { replace: true });
    else if (action === 'generating') void navigate('/create/generating', { replace: true });
    else if (action === 'workspace') retryWorkspace();
    else if (action === 'retryUploads') retryUploads();
    else void submitAll();
  };

  return (
    <Page aria-label="촬영 목록">
      <AppHeader
        title="사진을 올려주세요"
        onBack={() => void navigate(-1)}
        action={
          <Progress>
            {takenCount} / {scenes.length}
          </Progress>
        }
      />
      <Track aria-hidden="true">
        <Bar $ratio={takenCount / scenes.length} />
      </Track>

      <Content>
        <Grid>
          {scenes.map((scene) => {
            const asset = assets[scene.index];
            const locked = scene.index < submitted;
            const status: SlotState = asset?.rejection
              ? { tone: 'danger', text: '다시 올려주세요' }
              : asset?.upload?.status === 'uploading'
                ? { tone: 'muted', text: '올리는 중' }
                : asset?.upload?.status === 'error'
                  ? { tone: 'danger', text: '올리지 못했어요' }
                  : null;

            return (
              <li key={scene.shotKey}>
                <SlotButton
                  type="button"
                  disabled={locked || isSubmitting}
                  aria-label={asset ? `${scene.label} 다시 올리기` : `${scene.label} 올리기`}
                  aria-haspopup="dialog"
                  onClick={() => {
                    setAsking(scene);
                    setIsAsking(true);
                  }}
                >
                  <SlotFrame $next={!asset} $filled={Boolean(asset)}>
                    {asset ? (
                      <>
                        <SlotImage src={asset.previewUrl} alt="" />
                        {asset.upload?.status === 'done' && !asset.rejection && (
                          <SlotBadge aria-hidden="true">
                            <Check strokeWidth={3} />
                          </SlotBadge>
                        )}
                        {status && <SlotStatus $tone={status.tone}>{status.text}</SlotStatus>}
                      </>
                    ) : (
                      <>
                        {scene.recommended === 'gallery' ? (
                          <Image aria-hidden="true" />
                        ) : (
                          <Camera aria-hidden="true" />
                        )}
                        <SlotAction>올리기</SlotAction>
                      </>
                    )}
                  </SlotFrame>
                  <SlotLabel $done={Boolean(asset)}>{scene.label}</SlotLabel>
                </SlotButton>
              </li>
            );
          })}
        </Grid>
      </Content>

      <Footer>
        {errorMessage && <ErrorText role="alert">{errorMessage}</ErrorText>}
        <NextButton
          type="button"
          disabled={!footer.action}
          onClick={() => footer.action && runFooter(footer.action)}
        >
          {footer.label}
        </NextButton>
      </Footer>

      <ActionSheet
        open={isAsking}
        title={asking?.label ?? ''}
        description="어떻게 올릴까요?"
        items={items}
        onClose={() => setIsAsking(false)}
      />
    </Page>
  );
};

export default CardNewsCaptureList;
