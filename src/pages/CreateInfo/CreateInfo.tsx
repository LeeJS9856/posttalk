import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import AppHeader from '@/components/layout/AppHeader';
import { MAX_MARKET_NAME, MAX_SHOP_DESCRIPTION } from '@/constants/shop';
import { MAX_MENU_COUNT, type StoreTemplate } from '@/constants/templates';
import { MAX_CARD_NEWS_STYLE } from '@/constants/themes';
import { useAdDraft } from '@/hooks/useAdDraft';
import { useShop } from '@/hooks/useShop';
import {
  AddMenuButton,
  CheckBox,
  Chip,
  ChipAvatar,
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
  const { profile, templates, saveMenus } = useShop();

  // 가게 정보의 기준은 내 프로필이다. 여기서는 프로필 값을 기본으로 채우고, 고쳐도 이번 광고에만 쓴다.
  // 이 화면에서 프로필을 바꾸지 않는다. 프로필은 마이 > 수정에서만 고친다.
  const [storeName, setStoreName] = useState(profile.name);
  const [marketName, setMarketName] = useState(profile.marketName);
  const [storeDescription, setStoreDescription] = useState(profile.description);
  const [menus, setMenus] = useState<MenuDraft[]>([]);
  const [cardNewsStyle, setCardNewsStyle] = useState(draft.cardNewsStyle);
  const [isSaving, setIsSaving] = useState(false);

  /** 저장된 메뉴가 지금 목록에 들어 있는지. 이름으로 본다. */
  const isPicked = (template: StoreTemplate): boolean =>
    menus.some((menu) => menu.name.trim() === template.name);

  /** 저장된 메뉴를 누르면 목록에 넣고, 이미 들어 있으면 뺀다. 빈 줄이 있으면 그 자리에 넣는다. */
  const toggleTemplate = (template: StoreTemplate): void => {
    setMenus((current) => {
      if (current.some((menu) => menu.name.trim() === template.name)) {
        return current.filter((menu) => menu.name.trim() !== template.name);
      }
      const picked = createMenu(template.name, template.description);
      const empty = current.findIndex((menu) => !menu.name.trim() && !menu.description.trim());
      if (empty >= 0) return current.map((menu, index) => (index === empty ? picked : menu));
      return current.length < MAX_MENU_COUNT ? [...current, picked] : current;
    });
  };

  const updateMenu = (key: number, patch: Partial<MenuDraft>): void => {
    setMenus((current) => current.map((menu) => (menu.key === key ? { ...menu, ...patch } : menu)));
  };

  const removeMenu = (key: number): void => {
    setMenus((current) => current.filter((menu) => menu.key !== key));
  };

  const addMenu = (): void => {
    setMenus((current) => [...current, createMenu()]);
  };

  const filledMenus = menus.filter((menu) => menu.name.trim().length > 0);
  const canProceed =
    storeName.trim().length > 0 && storeDescription.trim().length > 0 && filledMenus.length > 0;

  const goNext = (): void => {
    const menus = filledMenus.map(({ name, description }) => ({
      name: name.trim(),
      description: description.trim(),
    }));

    // 메뉴마다 하나씩 저장한다. 이름이 곧 템플릿 이름이고, 같은 이름은 설명만 새로 바뀐다.
    if (isSaving) saveMenus(menus);

    const store = {
      storeName: storeName.trim(),
      marketName: marketName.trim(),
      storeDescription: storeDescription.trim(),
      // 비워 두면 콘셉트에 맞춰 정해 둔 문장이 대신 나간다.
      cardNewsStyle: isCardNews ? cardNewsStyle.trim() : '',
    };
    setStoreInfo({ ...store, menus });
    void navigate('/create/capture');
  };

  return (
    <Page aria-label="가게와 메뉴 정보 입력">
      <AppHeader title="무엇을 알릴까요?" onBack={() => navigate(-1)} />

      <Content>
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
            }}
          />
        </NameField>

        <Label as="label" htmlFor="store-market">
          가게 주소
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

        {/* 저장해 둔 메뉴. 누르면 아래 목록에 들어가고, 다시 누르면 빠진다. */}
        {templates.length > 0 && (
          <ChipRail>
            {templates.map((template) => {
              const selected = isPicked(template);
              const full = !selected && filledMenus.length >= MAX_MENU_COUNT;

              return (
                <Chip
                  key={template.templateId}
                  type="button"
                  aria-pressed={selected}
                  disabled={full}
                  $selected={selected}
                  onClick={() => toggleTemplate(template)}
                >
                  <ChipAvatar aria-hidden="true" $selected={selected}>
                    {template.name.slice(0, 1)}
                  </ChipAvatar>
                  {template.name}
                </Chip>
              );
            })}
          </ChipRail>
        )}

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
          <SaveLabel $checked={isSaving}>이 메뉴들을 저장해두기</SaveLabel>
        </SaveRow>
        {isSaving && <HelpText>메뉴마다 따로 저장돼요. 다음에 저장된 메뉴에서 골라 쓸 수 있어요</HelpText>}
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
