import { useRef, useState } from 'react';
import type { ReactNode, TouchEvent } from 'react';
import styled from 'styled-components';

import { COLORS } from '@/constants/colors';

type DraggableBottomSheetProps = { children: ReactNode };

const DraggableBottomSheet = ({ children }: DraggableBottomSheetProps): React.JSX.Element => {
  const [isExpanded, setIsExpanded] = useState(false);
  const touchStartY = useRef<number | null>(null);

  const handleTouchStart = (event: TouchEvent<HTMLDivElement>): void => {
    touchStartY.current = event.touches[0]?.clientY ?? null;
  };

  const handleTouchMove = (event: TouchEvent<HTMLDivElement>): void => {
    const startY = touchStartY.current;
    const currentY = event.touches[0]?.clientY;
    if (startY === null || currentY === undefined) return;

    const distance = currentY - startY;
    if (!isExpanded && distance < -12) {
      event.preventDefault();
      setIsExpanded(true);
      return;
    }

    if (isExpanded && distance > 12) {
      event.preventDefault();
      setIsExpanded(false);
    }
  };

  return (
    <Sheet $expanded={isExpanded}>
      <SheetHandle aria-hidden="true">
        <HandleBar />
      </SheetHandle>
      <SheetContent
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={() => {
          touchStartY.current = null;
        }}
      >
        {children}
      </SheetContent>
    </Sheet>
  );
};

const Sheet = styled.section<{ $expanded: boolean }>`
  position: absolute;
  right: 0;
  bottom: 88px;
  left: 0;
  z-index: 10;
  top: ${({ $expanded }) => ($expanded ? '88px' : 'min(clamp(248px, 45svh, 430px), calc(100svh - 320px))')};
  min-height: 232px;
  overflow: hidden;
  border-radius: 30px 30px 0 0;
  background: ${COLORS.background.main};
  transition: top 0.28s ease;
`;

const SheetHandle = styled.div`
  display: grid;
  place-items: center;
  width: 100%;
  height: 34px;
`;

const HandleBar = styled.span`
  width: 54px;
  height: 5px;
  border-radius: 999px;
  background: ${COLORS.primary200};
`;

const SheetContent = styled.div`
  height: calc(100% - 34px);
  overflow: hidden;
  padding: 10px 24px 132px;
  touch-action: none;
`;

export default DraggableBottomSheet;
