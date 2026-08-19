import { useState } from 'react';
import styled from 'styled-components';

import Button from '@/components/common/Button';
import { COLORS } from '@/constants/colors';
import { FONT_SIZE } from '@/constants/typography';

type RejectReason = 'length' | 'harmful' | 'misleading' | 'custom';

type AdminRejectReasonModalProps = {
  isSubmitting: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

const REJECT_REASONS: ReadonlyArray<{ label: string; value: RejectReason }> = [
  { value: 'length', label: '광고가 너무 짧거나 너무 긺' },
  { value: 'harmful', label: '유해하거나 선정적인 내용 포함' },
  { value: 'misleading', label: '거짓되거나, 너무 과장된 광고' },
  { value: 'custom', label: '직접 입력' },
];

const AdminRejectReasonModal = ({ isSubmitting, onClose, onConfirm }: AdminRejectReasonModalProps): React.JSX.Element => {
  const [selectedReason, setSelectedReason] = useState<RejectReason | null>(null);
  const [customReason, setCustomReason] = useState('');
  const canConfirm = selectedReason !== null && (selectedReason !== 'custom' || customReason.trim().length > 0);

  return (
    <Backdrop role="presentation" onClick={onClose}>
      <Dialog role="dialog" aria-modal="true" aria-labelledby="reject-modal-title" onClick={(event) => event.stopPropagation()}>
        <Title id="reject-modal-title">반려 하시겠습니까?</Title>
        <Description>반려 이유를 선택해주세요</Description>
        <ReasonList>
          {REJECT_REASONS.map(({ label, value }) => (
            <ReasonButton key={value} type="button" $selected={selectedReason === value} onClick={() => setSelectedReason(value)}>
              {label}
            </ReasonButton>
          ))}
        </ReasonList>
        {selectedReason === 'custom' && (
          <CustomReasonInput value={customReason} onChange={(event) => setCustomReason(event.target.value)} placeholder="반려 이유를 입력해주세요" aria-label="직접 입력한 반려 이유" />
        )}
        <ActionArea>
          <CancelButton type="button" disabled={isSubmitting} onClick={onClose}>취소</CancelButton>
          <ConfirmButton type="button" disabled={!canConfirm || isSubmitting} onClick={onConfirm}>
            {isSubmitting ? '처리 중...' : '반려하기'}
          </ConfirmButton>
        </ActionArea>
      </Dialog>
    </Backdrop>
  );
};

const Backdrop = styled.div`
  position: fixed;
  z-index: 50;
  inset: 0;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding: 24px;
  background: rgba(0, 0, 0, 0.45);
`;

const Dialog = styled.section`
  width: min(100%, 440px);
  border-radius: 20px;
  padding: 26px 20px 20px;
  background: ${COLORS.white};
`;

const Title = styled.h2`
  color: ${COLORS.black700};
  font-size: ${FONT_SIZE.title};
  font-weight: 700;
`;

const Description = styled.p`
  margin-top: 8px;
  color: ${COLORS.black500};
  font-size: ${FONT_SIZE.body};
`;

const ReasonList = styled.div`
  display: grid;
  gap: 8px;
  margin-top: 22px;
`;

const ReasonButton = styled.button<{ $selected: boolean }>`
  width: 100%;
  border: 1px solid ${({ $selected }) => ($selected ? COLORS.primary : COLORS.black200)};
  border-radius: 10px;
  padding: 13px 14px;
  color: ${({ $selected }) => ($selected ? COLORS.primary700 : COLORS.black700)};
  background: ${({ $selected }) => ($selected ? COLORS.primary100 : COLORS.white)};
  font-size: ${FONT_SIZE.body};
  font-weight: ${({ $selected }) => ($selected ? 700 : 500)};
  text-align: left;
`;

const CustomReasonInput = styled.textarea`
  width: 100%;
  min-height: 84px;
  margin-top: 10px;
  resize: vertical;
  border: 1px solid ${COLORS.black200};
  border-radius: 10px;
  padding: 12px;
  color: ${COLORS.black700};
  font-size: ${FONT_SIZE.body};
  line-height: 1.4;
`;

const ActionArea = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  margin-top: 20px;
`;

const CancelButton = styled(Button)`
  border: 1px solid ${COLORS.black400};
  border-radius: 10px;
  color: ${COLORS.black500};
  background: ${COLORS.white};
`;

const ConfirmButton = styled(Button)`
  border-radius: 10px;
  color: ${COLORS.white};
  background: ${COLORS.statusWarning};
`;

export default AdminRejectReasonModal;
