import { Camera, Check, Image, Video } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { isAbortError } from '@/apis/api';
import { startSession } from '@/apis/creation';
import ActionSheet, { type ActionSheetItem } from '@/components/common/ActionSheet';
import AppHeader from '@/components/layout/AppHeader';
import { posterSrc } from '@/constants/media';
import { buildScenes, type CaptureSource, type Scene } from '@/constants/scenes';
import { useAdDraft } from '@/hooks/useAdDraft';
import { useShop } from '@/hooks/useShop';
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
  SlotVideo,
  Track,
} from '@/pages/Capture/CaptureList.styles';

type StartState = { status: 'idle' | 'starting' } | { status: 'error'; message: string };

/**
 * 촬영 목록. 들어오면 서버에 제작 세션을 연다.
 * 서버는 정해진 순서대로만 장면을 받으므로, 다음 장면 하나만 누를 수 있다.
 * 받아 준 장면은 서버에 이미 들어가 다시 올릴 수 없다.
 */
const CaptureList = (): React.JSX.Element => {
  const navigate = useNavigate();
  const { draft, setSession } = useAdDraft();
  const { storeId } = useWorkspace();
  const { profile } = useShop();
  const [start, setStart] = useState<StartState>({ status: 'idle' });
  const [attempt, setAttempt] = useState(0);

  const scenes = useMemo(() => buildScenes(draft.format), [draft.format]);
  const doneCount = scenes.filter((scene) => draft.captures[scene.index]).length;
  const nextScene = scenes.find((scene) => !draft.captures[scene.index]);
  const isVideo = draft.format === 'reels';
  const session = draft.session;

  // 정보 입력을 건너뛰고 들어오면 보낼 소개가 없다. 앞 화면으로 돌려보낸다.
  const hasInfo = draft.storeDescription.length > 0 && draft.menus.length > 0;

  useEffect(() => {
    if (!hasInfo || session || !storeId) return;

    const controller = new AbortController();
    setStart({ status: 'starting' });

    startSession(draft, storeId, profile.name, controller.signal)
      .then((started) => {
        setSession({ sessionId: started.sessionId, nextShot: started.currentRequest ?? null });
        setStart({ status: 'idle' });
      })
      .catch((cause: unknown) => {
        if (isAbortError(cause)) return;
        setStart({
          status: 'error',
          message: cause instanceof Error ? cause.message : '촬영을 시작하지 못했어요.',
        });
      });

    return () => controller.abort();
    // 세션은 한 번만 연다. 초안의 다른 값이 바뀌어도 다시 열지 않는다.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasInfo, session, storeId, attempt]);

  /** 어떤 장면의 경로를 묻고 있는지. 닫는 동안에도 내용이 남아 있어야 해서 따로 둔다. */
  const [asking, setAsking] = useState<Scene | null>(null);
  const [isAsking, setIsAsking] = useState(false);

  const go = (scene: Scene, source: CaptureSource): void => {
    setIsAsking(false);
    void navigate(`/create/capture/${scene.index}?source=${source}`);
  };

  const items: ActionSheetItem[] = asking
    ? [
        {
          key: 'camera',
          icon: isVideo ? <Video /> : <Camera />,
          label: isVideo ? '지금 녹화하기' : '지금 찍기',
          description: isVideo ? `${asking.clipSeconds}초만 찍으면 돼요` : '카메라가 열려요',
          recommended: asking.recommended === 'camera',
          onSelect: () => go(asking, 'camera'),
        },
        {
          key: 'gallery',
          icon: <Image />,
          label: '갤러리에서 고르기',
          description: isVideo ? '기기에 있는 영상 중에서' : '기기에 있는 사진 중에서',
          recommended: asking.recommended === 'gallery',
          onSelect: () => go(asking, 'gallery'),
        },
      ]
    : [];

  const isReady = Boolean(session) && start.status !== 'starting';

  const footerLabel = !hasInfo
    ? '정보 입력으로'
    : start.status === 'error'
      ? '다시 시도하기'
      : !isReady
        ? '촬영을 준비하고 있어요'
        : session?.jobId
          ? '광고 만들기'
          : `${scenes.length - doneCount}개 더 올려주세요`;

  const onFooter = (): void => {
    if (!hasInfo) void navigate('/create/info', { replace: true });
    else if (start.status === 'error') setAttempt((count) => count + 1);
    else if (session?.jobId) void navigate('/create/generating', { replace: true });
  };

  const footerEnabled = !hasInfo || start.status === 'error' || Boolean(session?.jobId);

  return (
    <Page aria-label="촬영 목록">
      <AppHeader
        title={isVideo ? '영상을 올려주세요' : '사진을 올려주세요'}
        onBack={() => void navigate(-1)}
        action={
          <Progress>
            {doneCount} / {scenes.length}
          </Progress>
        }
      />

      <Content>
        <Track>
          <Bar $ratio={doneCount / scenes.length} />
        </Track>

        <Grid>
          {scenes.map((scene) => {
            const captured = draft.captures[scene.index];
            const isNext = isReady && nextScene?.index === scene.index;

            return (
              <li key={scene.index}>
                <SlotButton
                  type="button"
                  disabled={!isNext}
                  aria-label={captured ? `${scene.label} 올렸어요` : `${scene.label} 올리기`}
                  aria-haspopup="dialog"
                  onClick={() => {
                    setAsking(scene);
                    setIsAsking(true);
                  }}
                >
                  <SlotFrame $next={isNext} $filled={Boolean(captured)}>
                    {captured ? (
                      <>
                        {captured.kind === 'video' ? (
                          <SlotVideo
                            src={posterSrc(captured.previewUrl)}
                            muted
                            playsInline
                            preload="metadata"
                          />
                        ) : (
                          <SlotImage src={captured.previewUrl} alt="" />
                        )}
                        <SlotBadge aria-hidden="true">
                          <Check strokeWidth={3} />
                        </SlotBadge>
                      </>
                    ) : (
                      <>
                        {scene.kind === 'video' ? (
                          <Video aria-hidden="true" />
                        ) : scene.recommended === 'gallery' ? (
                          <Image aria-hidden="true" />
                        ) : (
                          <Camera aria-hidden="true" />
                        )}
                        {isNext && <SlotAction>지금 올리기</SlotAction>}
                      </>
                    )}
                  </SlotFrame>
                  <SlotLabel $done={Boolean(captured) || isNext}>{scene.label}</SlotLabel>
                </SlotButton>
              </li>
            );
          })}
        </Grid>
      </Content>

      <Footer>
        {start.status === 'error' && <ErrorText role="alert">{start.message}</ErrorText>}
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

export default CaptureList;
