import styled from 'styled-components';

import { COLORS } from '@/constants/colors';

export type AdStatus = 'pending' | 'supplement';

type StatusBadgeProps = { status: AdStatus };

const STATUS_COPY = {
  pending: '승인 대기중',
  supplement: '보충 필요',
} as const;

const StatusBadge = ({ status }: StatusBadgeProps): React.JSX.Element => (
  <Badge $status={status}>{STATUS_COPY[status]}</Badge>
);

const Badge = styled.span<{ $status: AdStatus }>`
  display: inline-flex;
  align-items: center;
  width: fit-content;
  border-radius: 999px;
  padding: 2px 14px;
  color: ${({ $status }) => ($status === 'pending' ? COLORS.primary : COLORS.statusCheck)};
  background: ${({ $status }) => ($status === 'pending' ? COLORS.primary200 : COLORS.statusCheckBackground)};
  font-size: 13px;
  font-weight: 700;
`;

export default StatusBadge;
