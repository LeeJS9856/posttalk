import { useEffect, useRef } from 'react';
import styled from 'styled-components';

import { COLORS } from '@/constants/colors';
import { FONT_SIZE, RADIUS } from '@/constants/typography';

const TOAST_DURATION_MS = 1800;

type ToastProps = {
  /** 비어 있으면 그리지 않는다. */
  message: string | null;
  onDismiss: () => void;
};

const Toast = ({ message, onDismiss }: ToastProps): React.JSX.Element | null => {
  // 호출 쪽이 화살표 함수를 넘겨도 타이머가 매 렌더마다 다시 시작하지 않게 한다.
  const latest = useRef(onDismiss);

  useEffect(() => {
    latest.current = onDismiss;
  });

  useEffect(() => {
    if (!message) return;

    const timer = window.setTimeout(() => latest.current(), TOAST_DURATION_MS);
    return () => window.clearTimeout(timer);
  }, [message]);

  if (!message) return null;
  return <Box role="status">{message}</Box>;
};

export default Toast;

const Box = styled.div`
  position: fixed;
  right: 16px;
  bottom: calc(76px + env(safe-area-inset-bottom));
  left: 16px;
  z-index: 20;
  padding: 12px 14px;
  border-radius: ${RADIUS.chip};
  background-color: ${COLORS.text.main};
  color: ${COLORS.text.inverse};
  font-size: ${FONT_SIZE.body};
  text-align: center;
`;
