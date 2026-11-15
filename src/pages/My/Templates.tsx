import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import ActionSheet, { type ActionSheetItem } from '@/components/common/ActionSheet';
import Toast from '@/components/common/Toast';
import AppHeader from '@/components/layout/AppHeader';
import { useShop } from '@/hooks/useShop';
import type { StoreTemplate } from '@/constants/templates';
import {
  Content,
  EmptyText,
  EmptyWrap,
  Guide,
  Item,
  List,
  Page,
  RemoveButton,
  TemplateMenus,
  TemplateName,
} from '@/pages/My/Templates.styles';

const TrashIcon = (): React.JSX.Element => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M5 7h14M9.5 7V5h5v2M7 7l.8 12h8.4L17 7M10.5 10.5v5M13.5 10.5v5"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const Templates = (): React.JSX.Element => {
  const navigate = useNavigate();
  const { templates, removeTemplate } = useShop();

  /** 지우려는 항목. 시트가 닫히는 동안에도 이름이 남아 있어야 해서 따로 둔다. */
  const [asking, setAsking] = useState<StoreTemplate | null>(null);
  const [isAsking, setIsAsking] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const items: ActionSheetItem[] = asking
    ? [
        {
          key: 'remove',
          icon: <TrashIcon />,
          label: '지우기',
          description: '정보 입력에서 더는 고를 수 없어요',
          onSelect: () => {
            removeTemplate(asking.templateId);
            setIsAsking(false);
            setNotice(`${asking.name}을(를) 지웠어요`);
          },
        },
      ]
    : [];

  return (
    <Page aria-label="저장된 내용 관리">
      <AppHeader title="저장된 내용" onBack={() => navigate(-1)} />

      <Content>
        <Guide>정보 입력 화면에서 고를 수 있는 가게들이에요</Guide>

        {templates.length === 0 ? (
          <EmptyWrap>
            <EmptyText>
              저장해둔 가게가 없어요
              <br />
              정보를 입력할 때 저장해두면 여기 쌓여요
            </EmptyText>
          </EmptyWrap>
        ) : (
          <List>
            {templates.map((template) => (
              <Item key={template.templateId}>
                <div>
                  <TemplateName>{template.name}</TemplateName>
                  <TemplateMenus>메뉴 {template.menus.length}개</TemplateMenus>
                </div>
                <RemoveButton
                  type="button"
                  aria-label={`${template.name} 지우기`}
                  aria-haspopup="dialog"
                  onClick={() => {
                    setAsking(template);
                    setIsAsking(true);
                  }}
                >
                  <TrashIcon />
                </RemoveButton>
              </Item>
            ))}
          </List>
        )}
      </Content>

      <Toast message={notice} onDismiss={() => setNotice(null)} />

      <ActionSheet
        open={isAsking}
        title={asking?.name ?? ''}
        description="지우면 되돌릴 수 없어요"
        items={items}
        onClose={() => setIsAsking(false)}
      />
    </Page>
  );
};

export default Templates;
