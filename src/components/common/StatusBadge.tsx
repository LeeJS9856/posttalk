import styled from 'styled-components';

import { COLORS } from '@/constants/colors';
import { STATUS_COPY, type AdStatus } from '@/constants/status';

type StatusBadgeProps = { status: AdStatus };

const StatusBadge = ({ status }: StatusBadgeProps): React.JSX.Element => (
  <Badge $status={status}>{STATUS_COPY[status]}</Badge>
);

const Badge = styled.span<{ $status: AdStatus }>`
  display: inline-flex;
  align-items: center;
  width: fit-content;
  border-radius: 999px;
  padding: 2px 14px;
  color: ${({ $status }) => {
    if ($status === 'posted') return COLORS.statusPost;
    return $status === 'pending' ? COLORS.primary : COLORS.statusCheck;
  }};
  background: ${({ $status }) => {
    if ($status === 'posted') return COLORS.statusPostBackground;
    return $status === 'pending' ? COLORS.primary200 : COLORS.statusCheckBackground;
  }};
  font-size: 13px;
  font-weight: 700;
`;

export default StatusBadge;
