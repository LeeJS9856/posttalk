import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import ActionSheet, { type ActionSheetItem } from '@/components/common/ActionSheet';
import PageHeader from '@/components/layout/PageHeader';
import { buildScenes, type CaptureSource, type Scene } from '@/constants/scenes';
import { usesSubtitles } from '@/constants/script';
import { useAdDraft } from '@/hooks/useAdDraft';
import {
  Bar,
  Content,
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
  Title,
  TitleRow,
  Track,
} from '@/pages/Capture/CaptureList.styles';

const CameraIcon = (): React.JSX.Element => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M4 8h3l1.5-2h7L17 8h3v11H4V8Z"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinejoin="round"
    />
    <circle cx="12" cy="13" r="3.2" stroke="currentColor" strokeWidth="1.7" />
  </svg>
);

const VideoIcon = (): React.JSX.Element => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <rect x="3" y="6.5" width="12.5" height="11" rx="2.5" stroke="currentColor" strokeWidth="1.7" />
    <path
      d="M15.5 11.2l4-2.4v6.4l-4-2.4v-1.6Z"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinejoin="round"
    />
  </svg>
);

const PhotoIcon = (): React.JSX.Element => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <rect x="3.5" y="5" width="17" height="14" rx="2.5" stroke="currentColor" strokeWidth="1.7" />
    <path
      d="M4 16l4.5-4 4 3.5L16 12l4 4"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinejoin="round"
    />
  </svg>
);

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

const CaptureList = (): React.JSX.Element => {
  const navigate = useNavigate();
  const { draft } = useAdDraft();

  const scenes = useMemo(
    () => buildScenes(draft.menus, draft.format),
    [draft.menus, draft.format],
  );
  const doneCount = scenes.filter((scene) => draft.captures[scene.index]).length;
  const nextScene = scenes.find((scene) => !draft.captures[scene.index]);
  const remaining = scenes.length - doneCount;
  const hasVideo = scenes.some((scene) => scene.kind === 'video');

  /** 어떤 장면의 경로를 묻고 있는지. 닫는 동안에도 내용이 남아 있어야 해서 따로 둔다. */
  const [asking, setAsking] = useState<Scene | null>(null);
  const [isAsking, setIsAsking] = useState(false);

  const go = (scene: Scene, source: CaptureSource): void => {
    setIsAsking(false);
    navigate(`/create/capture/${scene.index}?source=${source}`);
  };

  const isVideo = asking?.kind === 'video';
  const items: ActionSheetItem[] = asking
    ? [
        {
          key: 'camera',
          icon: isVideo ? <VideoIcon /> : <CameraIcon />,
          label: isVideo ? '지금 녹화하기' : '지금 찍기',
          description: isVideo ? `${asking.clipSeconds}초만 찍으면 돼요` : '카메라가 열려요',
          recommended: asking.recommended === 'camera',
          onSelect: () => go(asking, 'camera'),
        },
        {
          key: 'gallery',
          icon: <PhotoIcon />,
          label: '갤러리에서 고르기',
          description: isVideo ? '기기에 있는 영상 중에서' : '기기에 있는 사진 중에서',
          recommended: asking.recommended === 'gallery',
          onSelect: () => go(asking, 'gallery'),
        },
      ]
    : [];

  return (
    <Page aria-label="촬영 목록">
      <PageHeader title="광고 제작" onBack={() => navigate(-1)} />

      <Content>
        <TitleRow>
          <Title>{hasVideo ? '사진과 영상을 올려주세요' : '사진을 올려주세요'}</Title>
          <Progress>
            {doneCount} / {scenes.length}
          </Progress>
        </TitleRow>
        <Track>
          <Bar $ratio={scenes.length === 0 ? 0 : doneCount / scenes.length} />
        </Track>

        <Grid>
          {scenes.map((scene) => {
            const captured = draft.captures[scene.index];
            const isNext = nextScene?.index === scene.index;

            return (
              <li key={scene.index}>
                <SlotButton
                  type="button"
                  aria-label={`${scene.label} ${captured ? '다시 올리기' : '올리기'}`}
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
                          <SlotVideo src={captured.previewUrl} muted playsInline preload="metadata" />
                        ) : (
                          <SlotImage src={captured.previewUrl} alt="" />
                        )}
                        <SlotBadge aria-hidden="true">
                          <CheckIcon />
                        </SlotBadge>
                      </>
                    ) : (
                      <>
                        {scene.kind === 'video' ? (
                          <VideoIcon />
                        ) : scene.recommended === 'gallery' ? (
                          <PhotoIcon />
                        ) : (
                          <CameraIcon />
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
        <NextButton
          type="button"
          disabled={remaining > 0}
          onClick={() =>
            navigate(usesSubtitles(draft.format) ? '/create/script' : '/create/generating')
          }
        >
          {remaining > 0 ? `${remaining}개 더 올려주세요` : '다음'}
        </NextButton>
      </Footer>

      <ActionSheet
        open={isAsking}
        title={asking?.label ?? ''}
        description={asking && draft.captures[asking.index] ? '다시 올릴까요?' : '어떻게 올릴까요?'}
        items={items}
        onClose={() => setIsAsking(false)}
      />
    </Page>
  );
};

export default CaptureList;
