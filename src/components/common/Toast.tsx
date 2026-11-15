import { useEffect, useRef } from 'react';
import styled from 'styled-components';

import { COLORS } from '@/constants/colors';
import { MAX_APP_WIDTH } from '@/constants/layout';
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
  bottom: calc(76px + env(safe-area-inset-bottom));
  left: 50%;
  z-index: 20;
  /* fixed 는 뷰포트를 기준으로 잡힌다. 앱 틀 폭으로 되돌려 가운데에 맞춘다. */
  width: calc(100% - 32px);
  max-width: calc(${MAX_APP_WIDTH} - 32px);
  transform: translateX(-50%);
  padding: 12px 14px;
  border-radius: ${RADIUS.chip};
  background-color: ${COLORS.text.main};
  color: ${COLORS.text.inverse};
  font-size: ${FONT_SIZE.body};
  text-align: center;
`;
