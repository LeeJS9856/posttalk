import { Camera, Check, Image, Video } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { isAbortError } from '@/apis/api';
import { startSession } from '@/apis/creation';
import { getAdSession } from '@/apis/posttalk';
import ActionSheet, { type ActionSheetItem } from '@/components/common/ActionSheet';
import AppHeader from '@/components/layout/AppHeader';
import { posterSrc } from '@/constants/media';
import { isBatchFormat, sceneFromRequest, type CaptureSource, type Scene } from '@/constants/scenes';
import { useAdDraft } from '@/hooks/useAdDraft';
import { useWorkspace } from '@/hooks/useWorkspace';
import {
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
  SlotVideo,
} from '@/pages/Capture/CaptureList.styles';
import CardNewsCaptureList from '@/pages/Capture/CardNewsCaptureList';

type LoadState = { status: 'idle' | 'loading' } | { status: 'error'; message: string };

/**
 * 릴스 촬영 목록. 들어오면 서버에 제작 세션을 연다.
 * 몇 장을 어떤 순서로 찍을지는 서버가 정한다. 한 장을 받을 때마다 다음 장면을 알려 주고,
 * 다 받으면 생성 작업 번호를 준다. 그래서 목록은 "찍은 칸들 + 서버가 요구한 다음 칸 하나"로 그린다.
 * 받아 준 장면은 서버에 이미 들어가 다시 올릴 수 없다.
 */
const ShotByShotList = (): React.JSX.Element => {
  const navigate = useNavigate();
  const { draft, setSession, setNextShot, setGeneration } = useAdDraft();
  const { storeId, status: workspaceStatus, error: workspaceError, retry: retryWorkspace } = useWorkspace();
  const [load, setLoad] = useState<LoadState>({ status: 'idle' });
  const [attempt, setAttempt] = useState(0);

  const isVideo = draft.format === 'reels';
  const session = draft.session;
  const captured = Object.entries(draft.captures)
    .map(([index, asset]) => ({ index: Number(index), asset }))
    .sort((a, b) => a.index - b.index);
  const doneCount = captured.length;
  const nextScene =
    session?.nextShot && !session.jobId
      ? sceneFromRequest(session.nextShot, doneCount, draft.format)
      : null;

  // 정보 입력을 건너뛰고 들어오면 보낼 소개가 없다. 앞 화면으로 돌려보낸다.
  const hasInfo = draft.storeDescription.length > 0 && draft.menus.length > 0;
  // 세션은 있는데 다음 장면도, 생성 작업도 모르면 서버에서 지금 상태를 다시 받는다.
  const needsRefresh = Boolean(session && !session.nextShot && !session.jobId);

  useEffect(() => {
    if (!hasInfo || !storeId) return;
    if (session && !needsRefresh) return;

    const controller = new AbortController();
    setLoad({ status: 'loading' });

    const run = async (): Promise<void> => {
      if (!session) {
        const started = await startSession(draft, storeId, draft.storeName, controller.signal);
        setSession({ sessionId: started.sessionId, nextShot: started.currentRequest ?? null });
        return;
      }
      const latest = await getAdSession(session.sessionId, controller.signal);
      if (latest.generation?.jobId) {
        setGeneration({
          jobId: latest.generation.jobId,
          submissionId: latest.submission?.submissionId,
        });
      } else {
        setNextShot(latest.currentRequest ?? null);
      }
    };

    run()
      .then(() => setLoad({ status: 'idle' }))
      .catch((cause: unknown) => {
        if (isAbortError(cause)) return;
        setLoad({
          status: 'error',
          message: cause instanceof Error ? cause.message : '촬영을 준비하지 못했어요.',
        });
      });

    return () => controller.abort();
    // 세션은 한 번만 연다. 초안의 다른 값이 바뀌어도 다시 열지 않는다.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasInfo, storeId, session?.sessionId, needsRefresh, attempt]);

  /** 어떤 장면의 경로를 묻고 있는지. 닫는 동안에도 내용이 남아 있어야 해서 따로 둔다. */
  const [asking, setAsking] = useState<Scene | null>(null);
  const [isAsking, setIsAsking] = useState(false);

  const go = (scene: Scene, source: CaptureSource): void => {
    setIsAsking(false);
    void navigate(`/create/capture/${scene.index}?source=${source}`);
  };

  const askingVideo = asking?.kind === 'video';
  const items: ActionSheetItem[] = asking
    ? [
        {
          key: 'camera',
          icon: askingVideo ? <Video /> : <Camera />,
          label: askingVideo ? '지금 녹화하기' : '지금 찍기',
          description: askingVideo ? `${asking.clipSeconds}초만 찍으면 돼요` : '카메라가 열려요',
          recommended: asking.recommended === 'camera',
          onSelect: () => go(asking, 'camera'),
        },
        {
          key: 'gallery',
          icon: <Image />,
          label: '갤러리에서 고르기',
          description: askingVideo ? '기기에 있는 영상 중에서' : '기기에 있는 사진 중에서',
          recommended: asking.recommended === 'gallery',
          onSelect: () => go(asking, 'gallery'),
        },
      ]
    : [];

  const isBusy = load.status === 'loading';
  // 작업 공간을 열지 못하면 세션도 열 수 없다. 서버가 돌아왔을 때 새로고침 없이 다시 열 수 있게 한다.
  const workspaceFailed = hasInfo && !storeId && workspaceStatus === 'error';
  const errorMessage = workspaceFailed
    ? (workspaceError ?? '서버에 연결하지 못했어요.')
    : load.status === 'error'
      ? load.message
      : null;

  const footerLabel = !hasInfo
    ? '정보 입력으로'
    : errorMessage
      ? '다시 시도하기'
      : session?.jobId
        ? '광고 만들기'
        : isBusy || !nextScene
          ? '촬영을 준비하고 있어요'
          : `${nextScene.label} 올리기`;

  const onFooter = (): void => {
    if (!hasInfo) void navigate('/create/info', { replace: true });
    else if (workspaceFailed) retryWorkspace();
    else if (load.status === 'error') setAttempt((count) => count + 1);
    else if (session?.jobId) void navigate('/create/generating', { replace: true });
    else if (nextScene) {
      setAsking(nextScene);
      setIsAsking(true);
    }
  };

  const footerEnabled =
    !hasInfo || Boolean(errorMessage) || Boolean(session?.jobId) || (!isBusy && Boolean(nextScene));

  return (
    <Page aria-label="촬영 목록">
      <AppHeader
        title={isVideo ? '영상을 올려주세요' : '사진을 올려주세요'}
        onBack={() => void navigate(-1)}
        action={<Progress>{doneCount}개 올렸어요</Progress>}
      />

      <Content>
        <Grid>
          {captured.map(({ index, asset }) => (
            <li key={index}>
              <SlotButton type="button" disabled aria-label={`${asset.label} 올렸어요`}>
                <SlotFrame $next={false} $filled>
                  {asset.kind === 'video' ? (
                    <SlotVideo src={posterSrc(asset.previewUrl)} muted playsInline preload="metadata" />
                  ) : (
                    <SlotImage src={asset.previewUrl} alt="" />
                  )}
                  <SlotBadge aria-hidden="true">
                    <Check strokeWidth={3} />
                  </SlotBadge>
                </SlotFrame>
                <SlotLabel $done>{asset.label}</SlotLabel>
              </SlotButton>
            </li>
          ))}

          {nextScene && !isBusy && (
            <li>
              <SlotButton
                type="button"
                aria-label={`${nextScene.label} 올리기`}
                aria-haspopup="dialog"
                onClick={() => {
                  setAsking(nextScene);
                  setIsAsking(true);
                }}
              >
                <SlotFrame $next $filled={false}>
                  {nextScene.kind === 'video' ? (
                    <Video aria-hidden="true" />
                  ) : nextScene.recommended === 'gallery' ? (
                    <Image aria-hidden="true" />
                  ) : (
                    <Camera aria-hidden="true" />
                  )}
                  <SlotAction>지금 올리기</SlotAction>
                </SlotFrame>
                <SlotLabel $done>{nextScene.label}</SlotLabel>
              </SlotButton>
            </li>
          )}
        </Grid>
      </Content>

      <Footer>
        {errorMessage && <ErrorText role="alert">{errorMessage}</ErrorText>}
        <NextButton type="button" disabled={!footerEnabled} onClick={onFooter}>
          {footerLabel}
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

/**
 * 촬영 목록. 카드뉴스는 장면을 미리 알아 다 찍고 한 번에 제출하고,
 * 릴스는 서버가 한 장씩 다음 장면을 알려 준다.
 */
const CaptureList = (): React.JSX.Element => {
  const { draft } = useAdDraft();
  return isBatchFormat(draft.format) ? <CardNewsCaptureList /> : <ShotByShotList />;
};

export default CaptureList;
