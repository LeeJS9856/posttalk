import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import AppHeader from '@/components/layout/AppHeader';
import { posterSrc } from '@/constants/media';
import { buildScenes } from '@/constants/scenes';
import { MAX_SUBTITLE_LENGTH, buildDraftScript } from '@/constants/script';
import { useAdDraft } from '@/hooks/useAdDraft';
import {
  Body,
  Content,
  Count,
  Footer,
  Guide,
  LineButton,
  LineField,
  LineInput,
  Lines,
  Meta,
  NextButton,
  Page,
  Row,
  SceneLabel,
  Thumb,
  ThumbImage,
  ThumbVideo,
  UndoButton,
} from '@/pages/CreateScript/CreateScript.styles';

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

const UndoIcon = (): React.JSX.Element => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M9 7L5 11l4 4M5 11h8.5a5 5 0 0 1 0 10H11"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const CreateScript = (): React.JSX.Element => {
  const navigate = useNavigate();
  const { draft, setScript, setScriptLine } = useAdDraft();

  const scenes = useMemo(
    () => buildScenes(draft.menus, draft.format),
    [draft.menus, draft.format],
  );

  /** 지금 고치고 있는 줄의 장면 번호. 고치는 동안 나머지는 흐려진다. */
  const [editing, setEditing] = useState<number | null>(null);

  // 실제로는 재료를 찍는 동안 AI 가 만들어 둔다. 붙기 전까지는 여기서 표본을 채운다.
  useEffect(() => {
    if (draft.script.length > 0 || scenes.length === 0) return;
    setScript(buildDraftScript(scenes, draft.storeDescription, draft.menus));
  }, [draft.script.length, draft.storeDescription, draft.menus, scenes, setScript]);

  const goNext = (): void => {
    if (editing !== null) {
      setEditing(null);
      return;
    }
    navigate('/create/generating');
  };

  return (
    <Page aria-label="자막 확인">
      <AppHeader title="문구를 확인해주세요" onBack={() => navigate(-1)} />

      <Content>
        <Guide>바꾸고 싶은 줄을 누르면 고칠 수 있어요</Guide>

        <Lines>
          {scenes.map((scene) => {
            const line = draft.script.find((item) => item.sceneIndex === scene.index);
            if (!line) return null;

            const captured = draft.captures[scene.index];
            const isEditing = editing === scene.index;

            return (
              <Row key={scene.index} $editing={isEditing} $dim={editing !== null && !isEditing}>
                <Thumb>
                  {captured ? (
                    captured.kind === 'video' ? (
                      <ThumbVideo
                          src={posterSrc(captured.previewUrl)}
                          muted
                          playsInline
                          preload="metadata"
                        />
                    ) : (
                      <ThumbImage src={captured.previewUrl} alt="" />
                    )
                  ) : (
                    <PhotoIcon />
                  )}
                </Thumb>

                <Body>
                  <SceneLabel>{scene.label}</SceneLabel>

                  {isEditing ? (
                    <>
                      <LineField>
                        <LineInput
                          // oxlint-disable-next-line jsx-a11y/no-autofocus -- 줄을 눌러 들어온 자리라 바로 고칠 수 있어야 한다
                          autoFocus
                          rows={2}
                          value={line.text}
                          maxLength={MAX_SUBTITLE_LENGTH}
                          aria-label={`${scene.label} 자막`}
                          onChange={(event) => setScriptLine(scene.index, event.target.value)}
                        />
                      </LineField>
                      <Meta>
                        <Count $full={line.text.length >= MAX_SUBTITLE_LENGTH}>
                          {line.text.length} / {MAX_SUBTITLE_LENGTH}자
                        </Count>
                        {line.text !== line.original && (
                          <UndoButton
                            type="button"
                            onClick={() => setScriptLine(scene.index, line.original)}
                          >
                            <UndoIcon />
                            되돌리기
                          </UndoButton>
                        )}
                      </Meta>
                    </>
                  ) : (
                    <LineButton type="button" onClick={() => setEditing(scene.index)}>
                      {line.text}
                    </LineButton>
                  )}
                </Body>
              </Row>
            );
          })}
        </Lines>
      </Content>

      <Footer>
        <NextButton type="button" onClick={goNext}>
          {editing !== null ? '다 고쳤어요' : '이 문구로 만들기'}
        </NextButton>
      </Footer>
    </Page>
  );
};

export default CreateScript;
