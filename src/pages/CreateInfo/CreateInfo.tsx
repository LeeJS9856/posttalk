import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import AppHeader from '@/components/layout/AppHeader';
import { MAX_MARKET_NAME, MAX_SHOP_DESCRIPTION, createTemplateId } from '@/constants/shop';
import { MAX_MENU_COUNT, type StoreTemplate } from '@/constants/templates';
import { MAX_CARD_NEWS_STYLE } from '@/constants/themes';
import { useAdDraft } from '@/hooks/useAdDraft';
import { useShop } from '@/hooks/useShop';
import {
  AddMenuButton,
  CheckBox,
  Chip,
  ChipAvatar,
  ChipCount,
  ChipRail,
  Content,
  Counter,
  HelpText,
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
  const { draft, setStoreInfo } = useAdDraft();
  // 몇 장을 찍을지는 서버가 정한다. 개수 대신 무엇을 올리는지만 알린다.
  const shotUnit = draft.format === 'reels' ? '영상' : '사진';
  // 디자인 요청은 카드뉴스에만 있다. 릴스는 서버가 콘셉트만 받는다.
  const isCardNews = draft.format === 'card_news';
  const { profile, setProfile, templates, addTemplate } = useShop();

  const [templateId, setTemplateId] = useState<string | null>(null);
  // 계정이 곧 내 가게다. 가게 정보는 마이에 저장된 값으로 채우고, 여기서 고치면 마이에도 남긴다.
  const [storeName, setStoreName] = useState(profile.name);
  const [marketName, setMarketName] = useState(profile.marketName);
  const [storeDescription, setStoreDescription] = useState(profile.description);
  const [menus, setMenus] = useState<MenuDraft[]>([]);
  const [cardNewsStyle, setCardNewsStyle] = useState(draft.cardNewsStyle);
  const [isSaving, setIsSaving] = useState(false);
  const [templateName, setTemplateName] = useState('');

  /** 불러온 내용을 고치면 템플릿 선택을 푼다. 화면과 내용이 어긋나지 않게 한다. */
  const detachTemplate = (): void => setTemplateId(null);

  const applyTemplate = (template: StoreTemplate): void => {
    setTemplateId(template.templateId);
    setStoreName(template.name);
    setMarketName(template.marketName ?? '');
    setStoreDescription(template.storeDescription);
    setMenus(template.menus.map((menu) => createMenu(menu.name, menu.description)));
  };

  const updateMenu = (key: number, patch: Partial<MenuDraft>): void => {
    setMenus((current) => current.map((menu) => (menu.key === key ? { ...menu, ...patch } : menu)));
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
  const canProceed =
    storeName.trim().length > 0 && storeDescription.trim().length > 0 && filledMenus.length > 0;

  const goNext = (): void => {
    const menus = filledMenus.map(({ name, description }) => ({
      name: name.trim(),
      description: description.trim(),
    }));

    // 저장해두면 다음 관람객이 정보 입력에서 바로 고를 수 있다.
    if (isSaving) {
      addTemplate({
        templateId: createTemplateId(),
        name: templateName.trim() || storeName.trim(),
        marketName: marketName.trim(),
        storeDescription: storeDescription.trim(),
        menus,
      });
    }

    const store = {
      storeName: storeName.trim(),
      marketName: marketName.trim(),
      storeDescription: storeDescription.trim(),
      // 비워 두면 콘셉트에 맞춰 정해 둔 문장이 대신 나간다.
      cardNewsStyle: isCardNews ? cardNewsStyle.trim() : '',
    };
    setProfile({
      ...profile,
      name: store.storeName,
      marketName: store.marketName,
      description: store.storeDescription.slice(0, MAX_SHOP_DESCRIPTION),
    });
    setStoreInfo({ ...store, menus });
    void navigate('/create/capture');
  };

  return (
    <Page aria-label="가게와 메뉴 정보 입력">
      <AppHeader title="무엇을 알릴까요?" onBack={() => navigate(-1)} />

      <Content>
        {templates.length > 0 && <Label>저장된 내용</Label>}
        {templates.length > 0 && (
          <ChipRail>
            {templates.map((template) => {
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
        )}

        <Label as="label" htmlFor="store-name">
          가게 이름
        </Label>
        <NameField>
          <TextArea
            id="store-name"
            rows={1}
            value={storeName}
            placeholder="예) 영창식당"
            onChange={(event) => {
              setStoreName(event.target.value);
              detachTemplate();
            }}
          />
        </NameField>

        <Label as="label" htmlFor="store-market">
          어디에 있나요?
        </Label>
        <NameField>
          <TextArea
            id="store-market"
            rows={1}
            value={marketName}
            maxLength={MAX_MARKET_NAME}
            placeholder="예) 양동시장, 전남대 후문"
            onChange={(event) => {
              setMarketName(event.target.value);
              detachTemplate();
            }}
          />
        </NameField>

        <Label as="label" htmlFor="store-description">
          어떤 가게인가요?
        </Label>
        <StoreField>
          <TextArea
            id="store-description"
            rows={2}
            maxLength={MAX_SHOP_DESCRIPTION}
            value={storeDescription}
            placeholder="예) 20년째 같은 자리에서 떡을 만드는 떡집이에요"
            onChange={(event) => {
              setStoreDescription(event.target.value);
              detachTemplate();
            }}
          />
        </StoreField>

        {isCardNews && (
          <>
            <LabelRow>
              <Label as="label" htmlFor="card-news-style" style={{ padding: 0 }}>
                어떤 느낌으로 만들까요?
              </Label>
              <Counter>선택</Counter>
            </LabelRow>
            <StoreField>
              <TextArea
                id="card-news-style"
                rows={2}
                maxLength={MAX_CARD_NEWS_STYLE}
                value={cardNewsStyle}
                placeholder="예) 가격을 크게 넣고, 손글씨 느낌으로"
                onChange={(event) => setCardNewsStyle(event.target.value)}
              />
            </StoreField>
            <HelpText>비워 두면 고른 콘셉트에 맞춰 만들어요</HelpText>
          </>
        )}

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
                placeholder="예) 영창식당"
                onChange={(event) => setTemplateName(event.target.value)}
              />
            </NameField>
          </>
        )}
      </Content>

      <Footer>
        <NextButton type="button" disabled={!canProceed} onClick={goNext}>
          {canProceed ? `다음 · ${shotUnit} 올리기` : '다음'}
        </NextButton>
      </Footer>
    </Page>
  );
};

export default CreateInfo;
