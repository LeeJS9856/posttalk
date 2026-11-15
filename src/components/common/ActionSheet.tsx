import { useEffect, useRef, useState } from 'react';
import styled, { keyframes } from 'styled-components';

import { COLORS } from '@/constants/colors';
import { MAX_APP_WIDTH } from '@/constants/layout';
import { FONT_SIZE, FONT_WEIGHT, RADIUS } from '@/constants/typography';

export type ActionSheetItem = {
  key: string;
  icon: React.ReactNode;
  label: string;
  /** 항목 아래 한 줄. 이름만으로 뜻이 분명하면 비운다. */
  description?: string;
  /** 권하는 쪽. 하나만 두고, 작은 표시로만 알린다. */
  recommended?: boolean;
  /** 되돌리기 어려운 동작(로그아웃, 삭제). 글자와 아이콘을 경고색으로 둔다. */
  danger?: boolean;
  onSelect: () => void;
};

type ActionSheetProps = {
  open: boolean;
  title: string;
  description?: string;
  /** 고를 항목들. 확인창처럼 버튼만 둘 때는 비우고 children 을 쓴다. */
  items?: readonly ActionSheetItem[];
  /** 항목 목록 대신 놓을 내용(확인 버튼 등). */
  children?: React.ReactNode;
  onClose: () => void;
};

const ActionSheet = ({
  open,
  title,
  description,
  items = [],
  children,
  onClose,
}: ActionSheetProps): React.JSX.Element | null => {
  // 닫힐 때도 애니메이션을 보여주려면 사라지는 동안 한 번 더 그려야 한다.
  const [leaving, setLeaving] = useState(false);
  const [mounted, setMounted] = useState(open);
  const [wasOpen, setWasOpen] = useState(open);
  const panelRef = useRef<HTMLDivElement>(null);

  // open 이 바뀐 순간을 렌더 중에 처리한다. 이펙트로 미루면 한 프레임 어긋난다.
  if (wasOpen !== open) {
    setWasOpen(open);
    if (open) {
      setMounted(true);
      setLeaving(false);
    } else if (mounted) {
      setLeaving(true);
    }
  }

  // 열리면 시트 안으로 포커스를 옮긴다. 키보드와 화면 읽기 사용자가 뒤 화면에 남지 않게 한다.
  useEffect(() => {
    if (open && mounted) panelRef.current?.focus({ preventScroll: true });
  }, [open, mounted]);

  useEffect(() => {
    if (!mounted) return;

    const onKeyDown = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', onKeyDown);
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previous;
    };
  }, [mounted, onClose]);

  if (!mounted) return null;

  return (
    <Layer
      $leaving={leaving}
      onAnimationEnd={() => {
        if (leaving) setMounted(false);
      }}
    >
      <Backdrop type="button" aria-label="닫기" onClick={onClose} />
      <Panel
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
        $leaving={leaving}
      >
        <Handle aria-hidden="true" />
        <Title>{title}</Title>
        {description && <Description>{description}</Description>}
        {children}
        {items.length > 0 && (
        <List>
          {items.map((item) => (
            <li key={item.key}>
              <Option type="button" onClick={item.onSelect}>
                <OptionIcon
                  $accent={Boolean(item.recommended)}
                  $danger={Boolean(item.danger)}
                  aria-hidden="true"
                >
                  {item.icon}
                </OptionIcon>
                <OptionText>
                  <OptionLabel $danger={Boolean(item.danger)}>
                    {item.label}
                    {item.recommended && <Badge>추천</Badge>}
                  </OptionLabel>
                  {item.description && <OptionDescription>{item.description}</OptionDescription>}
                </OptionText>
              </Option>
            </li>
          ))}
        </List>
        )}
      </Panel>
    </Layer>
  );
};

export default ActionSheet;

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const fadeOut = keyframes`
  from { opacity: 1; }
  to { opacity: 0; }
`;

const slideUp = keyframes`
  from { transform: translateY(100%); }
  to { transform: translateY(0); }
`;

const slideDown = keyframes`
  from { transform: translateY(0); }
  to { transform: translateY(100%); }
`;

const Layer = styled.div<{ $leaving: boolean }>`
  position: fixed;
  z-index: 20;
  top: 0;
  bottom: 0;
  left: 50%;
  /* fixed 는 뷰포트를 기준으로 잡힌다. 앱 틀 폭으로 되돌려 가운데에 맞춘다. */
  width: 100%;
  max-width: ${MAX_APP_WIDTH};
  transform: translateX(-50%);
  animation: ${({ $leaving }) => ($leaving ? fadeOut : fadeIn)} 0.2s ease forwards;
`;

const Backdrop = styled.button`
  position: absolute;
  inset: 0;
  width: 100%;
  background-color: ${COLORS.scrim};
`;

const Panel = styled.div<{ $leaving: boolean }>`
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  padding: 10px 16px calc(18px + env(safe-area-inset-bottom));
  border-radius: ${RADIUS.panel} ${RADIUS.panel} 0 0;
  background-color: ${COLORS.background.main};
  animation: ${({ $leaving }) => ($leaving ? slideDown : slideUp)} 0.26s
    cubic-bezier(0.2, 0.85, 0.25, 1) forwards;

  /* 포커스는 시트 자체로 받는다. 테두리는 그리지 않고 안의 버튼부터 테두리를 보인다. */
  &:focus {
    outline: none;
  }
`;

const Handle = styled.div`
  width: 34px;
  height: 4px;
  margin: 0 auto 14px;
  border-radius: 2px;
  background-color: ${COLORS.border.strong};
`;

const Title = styled.h2`
  color: ${COLORS.text.main};
  font-size: ${FONT_SIZE.titleSmall};
  font-weight: ${FONT_WEIGHT.bold};
`;

const Description = styled.p`
  margin-top: 3px;
  color: ${COLORS.text.muted};
  font-size: ${FONT_SIZE.body};
`;

const List = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 14px;
  list-style: none;
`;

const Option = styled.button`
  display: flex;
  align-items: center;
  gap: 11px;
  width: 100%;
  padding: 13px 12px;
  border-radius: ${RADIUS.card};
  background-color: ${COLORS.background.subtle};
  text-align: left;
  transition: transform 0.16s cubic-bezier(0.2, 0.85, 0.25, 1);

  &:active {
    transform: scale(0.98);
  }
`;

const iconBackground = ({ $accent, $danger }: { $accent: boolean; $danger: boolean }): string => {
  if ($danger) return COLORS.statusSoft.failed;
  return $accent ? COLORS.brand.main : COLORS.brand.soft;
};

const iconColor = ({ $accent, $danger }: { $accent: boolean; $danger: boolean }): string => {
  if ($danger) return COLORS.status.failed;
  return $accent ? COLORS.text.inverse : COLORS.brand.main;
};

const OptionIcon = styled.span<{ $accent: boolean; $danger: boolean }>`
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background-color: ${iconBackground};
  color: ${iconColor};

  svg {
    width: 18px;
    height: 18px;
  }
`;

const OptionText = styled.span`
  display: block;
  flex: 1;
  min-width: 0;
`;

const OptionLabel = styled.span<{ $danger: boolean }>`
  display: flex;
  align-items: center;
  gap: 6px;
  color: ${({ $danger }) => ($danger ? COLORS.status.failed : COLORS.text.main)};
  font-size: ${FONT_SIZE.bodyLarge};
  font-weight: ${FONT_WEIGHT.semibold};
`;

const Badge = styled.span`
  padding: 1px 6px;
  border-radius: 999px;
  background-color: ${COLORS.brand.soft};
  color: ${COLORS.brand.main};
  font-size: ${FONT_SIZE.caption};
  font-weight: ${FONT_WEIGHT.semibold};
`;

const OptionDescription = styled.span`
  display: block;
  margin-top: 1px;
  color: ${COLORS.text.muted};
  font-size: ${FONT_SIZE.label};
`;
