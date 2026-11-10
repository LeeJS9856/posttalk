import { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';

import { COLORS } from '@/constants/colors';
import { FONT_SIZE, FONT_WEIGHT, RADIUS } from '@/constants/typography';

export type ActionSheetItem = {
  key: string;
  icon: React.ReactNode;
  label: string;
  description: string;
  /** 권하는 쪽. 하나만 두고, 작은 표시로만 알린다. */
  recommended?: boolean;
  onSelect: () => void;
};

type ActionSheetProps = {
  open: boolean;
  title: string;
  description: string;
  items: readonly ActionSheetItem[];
  onClose: () => void;
};

const ActionSheet = ({
  open,
  title,
  description,
  items,
  onClose,
}: ActionSheetProps): React.JSX.Element | null => {
  // 닫힐 때도 애니메이션을 보여주려면 사라지는 동안 한 번 더 그려야 한다.
  const [leaving, setLeaving] = useState(false);
  const [mounted, setMounted] = useState(open);
  const [wasOpen, setWasOpen] = useState(open);

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
      <Panel role="dialog" aria-modal="true" aria-label={title} $leaving={leaving}>
        <Handle aria-hidden="true" />
        <Title>{title}</Title>
        <Description>{description}</Description>
        <List>
          {items.map((item) => (
            <li key={item.key}>
              <Option type="button" onClick={item.onSelect}>
                <OptionIcon $accent={Boolean(item.recommended)} aria-hidden="true">
                  {item.icon}
                </OptionIcon>
                <OptionText>
                  <OptionLabel>
                    {item.label}
                    {item.recommended && <Badge>추천</Badge>}
                  </OptionLabel>
                  <OptionDescription>{item.description}</OptionDescription>
                </OptionText>
              </Option>
            </li>
          ))}
        </List>
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
  inset: 0;
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
`;

const Handle = styled.div`
  width: 34px;
  height: 4px;
  margin: 0 auto 14px;
  border-radius: 2px;
  background-color: ${COLORS.border.strong};
`;

const Title = styled.p`
  color: ${COLORS.text.main};
  font-size: ${FONT_SIZE.titleSmall};
  font-weight: ${FONT_WEIGHT.medium};
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

const OptionIcon = styled.span<{ $accent: boolean }>`
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background-color: ${({ $accent }) => ($accent ? COLORS.brand.main : COLORS.brand.soft)};
  color: ${({ $accent }) => ($accent ? COLORS.text.inverse : COLORS.brand.main)};

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

const OptionLabel = styled.span`
  display: flex;
  align-items: center;
  gap: 6px;
  color: ${COLORS.text.main};
  font-size: ${FONT_SIZE.bodyLarge};
  font-weight: ${FONT_WEIGHT.medium};
`;

const Badge = styled.span`
  padding: 1px 6px;
  border-radius: 999px;
  background-color: ${COLORS.brand.soft};
  color: ${COLORS.brand.main};
  font-size: ${FONT_SIZE.caption};
  font-weight: ${FONT_WEIGHT.medium};
`;

const OptionDescription = styled.span`
  display: block;
  margin-top: 1px;
  color: ${COLORS.text.muted};
  font-size: ${FONT_SIZE.label};
`;
