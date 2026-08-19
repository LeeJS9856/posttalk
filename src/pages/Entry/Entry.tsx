import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';

import { activateMerchantQr, getMerchantQr, type MerchantQrActivationInput } from '@/apis/merchantQr';
import { Card, Description, Field, Form, Input, Message, Page, SubmitButton, Textarea, Title } from '@/pages/Entry/Entry.styles';

type EntryStatus = 'checking' | 'registering' | 'unregistered' | 'error';

const getQrToken = (): string | null => new URLSearchParams(window.location.search).get('qrToken');

const Entry = (): React.JSX.Element => {
  const qrToken = getQrToken();
  const [status, setStatus] = useState<EntryStatus>(qrToken ? 'checking' : 'error');
  const [message, setMessage] = useState(qrToken ? 'QR 상태를 확인하고 있어요.' : 'QR 토큰이 없어요. QR 링크로 다시 접속해주세요.');
  const [form, setForm] = useState<MerchantQrActivationInput>({
    marketName: '',
    storeName: '',
    ownerName: '',
    category: '',
    description: '',
  });

  useEffect(() => {
    if (!qrToken) return;

    const controller = new AbortController();

    const checkQr = async (): Promise<void> => {
      try {
        const response = await getMerchantQr({ qrToken, signal: controller.signal });
        if (response.data.qr.isAssigned && response.data.qr.store) {
          window.location.replace(`/?qrToken=${encodeURIComponent(qrToken)}`);
          return;
        }

        setStatus('unregistered');
        setMessage('처음 사용하는 QR이에요. 가게 정보를 등록해주세요.');
      } catch (error) {
        if (!(error instanceof DOMException && error.name === 'AbortError')) {
          setStatus('error');
          setMessage(error instanceof Error ? error.message : 'QR 상태를 확인하지 못했어요.');
        }
      }
    };

    void checkQr();
    return () => controller.abort();
  }, [qrToken]);

  const updateField = (field: keyof MerchantQrActivationInput, value: string): void => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    if (!qrToken) return;

    setStatus('registering');
    setMessage('가게 정보를 연결하고 있어요.');

    try {
      await activateMerchantQr({ qrToken, ...form });
      const response = await getMerchantQr({ qrToken });
      if (!response.data.qr.isAssigned || !response.data.qr.store) {
        throw new Error('가게 연결을 확인하지 못했어요. 잠시 후 다시 시도해주세요.');
      }

      window.location.replace(`/?qrToken=${encodeURIComponent(qrToken)}`);
    } catch (error) {
      setStatus('unregistered');
      setMessage(error instanceof Error ? error.message : '가게 정보 등록에 실패했어요.');
    }
  };

  const isFormVisible = status === 'unregistered' || status === 'registering';

  return (
    <Page aria-label="QR 진입 페이지">
      <Card>
        <Title>포스톡 시작하기</Title>
        <Description>{message}</Description>
        {isFormVisible && (
          <Form onSubmit={(event) => void handleSubmit(event)}>
            <Field>시장 이름<Input required value={form.marketName} onChange={(event) => updateField('marketName', event.target.value)} /></Field>
            <Field>가게 이름<Input required value={form.storeName} onChange={(event) => updateField('storeName', event.target.value)} /></Field>
            <Field>사장님 이름<Input required value={form.ownerName} onChange={(event) => updateField('ownerName', event.target.value)} /></Field>
            <Field>업종<Input required value={form.category} onChange={(event) => updateField('category', event.target.value)} /></Field>
            <Field>가게 소개<Textarea required value={form.description} onChange={(event) => updateField('description', event.target.value)} /></Field>
            <SubmitButton type="submit" disabled={status === 'registering'}>
              {status === 'registering' ? '연결 중...' : '가게 정보 등록하기'}
            </SubmitButton>
          </Form>
        )}
        {status === 'error' && <Message $isError>{message}</Message>}
      </Card>
    </Page>
  );
};

export default Entry;
