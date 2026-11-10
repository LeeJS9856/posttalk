import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import PageHeader from '@/components/layout/PageHeader';
import { buildScenes } from '@/constants/scenes';
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

  const scenes = useMemo(() => buildScenes(draft.menus), [draft.menus]);
  const doneCount = scenes.filter((scene) => draft.captures[scene.index]).length;
  const nextScene = scenes.find((scene) => !draft.captures[scene.index]);
  const remaining = scenes.length - doneCount;

  return (
    <Page aria-label="촬영 목록">
      <PageHeader title="광고 제작" onBack={() => navigate(-1)} />

      <Content>
        <TitleRow>
          <Title>사진을 찍어주세요</Title>
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
                  aria-label={`${scene.label} ${captured ? '다시 찍기' : '찍기'}`}
                  onClick={() => navigate(`/create/capture/${scene.index}`)}
                >
                  <SlotFrame $next={isNext} $filled={Boolean(captured)}>
                    {captured ? (
                      <>
                        <SlotImage src={captured.previewUrl} alt="" />
                        <SlotBadge aria-hidden="true">
                          <CheckIcon />
                        </SlotBadge>
                      </>
                    ) : (
                      <>
                        <CameraIcon />
                        {isNext && <SlotAction>지금 찍기</SlotAction>}
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
          onClick={() => navigate('/create/generating')}
        >
          {remaining > 0 ? `${remaining}장 더 찍어주세요` : '다음'}
        </NextButton>
      </Footer>
    </Page>
  );
};

export default CaptureList;
