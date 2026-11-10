import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import PageHeader from '@/components/layout/PageHeader';
import {
  MAX_MENU_COUNT,
  SAMPLE_TEMPLATES,
  countScenes,
  type StoreTemplate,
} from '@/constants/templates';
import {
  AddMenuButton,
  CheckBox,
  Chip,
  ChipAvatar,
  ChipCount,
  ChipRail,
  Content,
  Counter,
  Footer,
  Label,
  LabelRow,
  MenuDescriptionInput,
  MenuFields,
  MenuNameInput,
  MenuRow,
  NameField,
  NextButton,
  Page,
  Question,
  RemoveButton,
  SaveLabel,
  SaveRow,
  StoreField,
  TextArea,
} from '@/pages/CreateInfo/CreateInfo.styles';

type MenuDraft = {
  key: number;
  name: string;
  description: string;
};

let menuKeySeed = 0;
const createMenu = (name = '', description = ''): MenuDraft => ({
  key: (menuKeySeed += 1),
  name,
  description,
});

const PlusIcon = (): React.JSX.Element => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const CloseIcon = (): React.JSX.Element => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const CheckIcon = (): React.JSX.Element => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M5 12.5l4.5 4.5L19 7.5"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const CreateInfo = (): React.JSX.Element => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [templateId, setTemplateId] = useState<string | null>(null);
  const [storeDescription, setStoreDescription] = useState('');
  const [menus, setMenus] = useState<MenuDraft[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [templateName, setTemplateName] = useState('');

  /** 불러온 내용을 고치면 템플릿 선택을 푼다. 화면과 내용이 어긋나지 않게 한다. */
  const detachTemplate = (): void => setTemplateId(null);

  const applyTemplate = (template: StoreTemplate): void => {
    setTemplateId(template.templateId);
    setStoreDescription(template.storeDescription);
    setMenus(template.menus.map((menu) => createMenu(menu.name, menu.description)));
  };

  const updateMenu = (key: number, patch: Partial<MenuDraft>): void => {
    setMenus((current) =>
      current.map((menu) => (menu.key === key ? { ...menu, ...patch } : menu)),
    );
    detachTemplate();
  };

  const removeMenu = (key: number): void => {
    setMenus((current) => current.filter((menu) => menu.key !== key));
    detachTemplate();
  };

  const addMenu = (): void => {
    setMenus((current) => [...current, createMenu()]);
    detachTemplate();
  };

  const filledMenus = menus.filter((menu) => menu.name.trim().length > 0);
  const canProceed = storeDescription.trim().length > 0 && filledMenus.length > 0;

  const goNext = (): void => {
    const format = searchParams.get('format') ?? 'card_news';
    const theme = searchParams.get('theme') ?? 'christmas';
    navigate(`/create/capture/0?format=${format}&theme=${theme}`);
  };

  return (
    <Page aria-label="가게와 메뉴 정보 입력">
      <PageHeader title="광고 제작" onBack={() => navigate(-1)} />

      <Content>
        <Question>무엇을 알릴까요?</Question>

        <Label>저장된 내용</Label>
        <ChipRail>
          {SAMPLE_TEMPLATES.map((template) => {
            const selected = templateId === template.templateId;

            return (
              <Chip
                key={template.templateId}
                type="button"
                aria-pressed={selected}
                $selected={selected}
                onClick={() => applyTemplate(template)}
              >
                <ChipAvatar aria-hidden="true" $selected={selected}>
                  {template.name.slice(0, 1)}
                </ChipAvatar>
                {template.name}
                <ChipCount $selected={selected}>{template.menus.length}</ChipCount>
              </Chip>
            );
          })}
        </ChipRail>

        <Label as="label" htmlFor="store-description">
          어떤 가게인가요?
        </Label>
        <StoreField>
          <TextArea
            id="store-description"
            rows={2}
            value={storeDescription}
            placeholder="예) 20년째 같은 자리에서 떡을 만드는 떡집이에요"
            onChange={(event) => {
              setStoreDescription(event.target.value);
              detachTemplate();
            }}
          />
        </StoreField>

        <LabelRow>
          <Label as="span" style={{ padding: 0 }}>
            알리고 싶은 메뉴
          </Label>
          <Counter>
            {filledMenus.length} / {MAX_MENU_COUNT}
          </Counter>
        </LabelRow>

        {menus.map((menu) => (
          <MenuRow key={menu.key}>
            <MenuFields>
              <MenuNameInput
                value={menu.name}
                placeholder="메뉴 이름"
                aria-label="메뉴 이름"
                onChange={(event) => updateMenu(menu.key, { name: event.target.value })}
              />
              <MenuDescriptionInput
                value={menu.description}
                placeholder="설명을 적어주세요"
                aria-label="메뉴 설명"
                onChange={(event) => updateMenu(menu.key, { description: event.target.value })}
              />
            </MenuFields>
            <RemoveButton type="button" aria-label="메뉴 빼기" onClick={() => removeMenu(menu.key)}>
              <CloseIcon />
            </RemoveButton>
          </MenuRow>
        ))}

        {menus.length < MAX_MENU_COUNT && (
          <AddMenuButton type="button" onClick={addMenu}>
            <PlusIcon />
            메뉴 추가
          </AddMenuButton>
        )}

        <SaveRow type="button" aria-pressed={isSaving} onClick={() => setIsSaving((on) => !on)}>
          <CheckBox $checked={isSaving}>{isSaving && <CheckIcon />}</CheckBox>
          <SaveLabel $checked={isSaving}>이 내용을 저장해두기</SaveLabel>
        </SaveRow>

        {isSaving && (
          <>
            <Label as="label" htmlFor="template-name">
              저장할 이름
            </Label>
            <NameField>
              <TextArea
                id="template-name"
                rows={1}
                value={templateName}
                placeholder="예) 창억떡집"
                onChange={(event) => setTemplateName(event.target.value)}
              />
            </NameField>
          </>
        )}
      </Content>

      <Footer>
        <NextButton type="button" disabled={!canProceed} onClick={goNext}>
          {canProceed ? `다음 · 촬영 ${countScenes(filledMenus.length)}번` : '다음'}
        </NextButton>
      </Footer>
    </Page>
  );
};

export default CreateInfo;
