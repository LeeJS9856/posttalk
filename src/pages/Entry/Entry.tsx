import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';

import {
  activateMerchantQr,
  getMerchantQr,
  type MerchantQrActivationInput,
  type MerchantQrOnboarding,
  type PhotoGuide,
} from '@/apis/merchantQr';
import { Card, Description, Field, Form, GuideItem, GuideList, GuideTitle, Input, Message, Page, Select, SubmitButton, Title } from '@/pages/Entry/Entry.styles';

type EntryStatus = 'checking' | 'registering' | 'unregistered' | 'photo-guide' | 'error';
type LocationStatus = 'idle' | 'loading' | 'ready' | 'error';

const DEFAULT_ONBOARDING: MerchantQrOnboarding = {
  needsCategorySelection: true,
  needsLocationCapture: true,
  selectedCategory: null,
  categoryOptions: [],
  photoGuide: null,
};

const CATEGORY_OPTIONS = [
  { code: 'restaurant_food', label: '식당·음식점' },
  { code: 'cafe_snack_dessert', label: '카페·간식·디저트' },
  { code: 'agriculture_livestock_fisheries', label: '농·축·수산물' },
  { code: 'grocery_side_dishes_dried_fish', label: '식료품·반찬·건어물' },
  { code: 'fashion_clothing_misc', label: '패션·의류·잡화' },
  { code: 'household_furniture_appliances', label: '생활용품·가구·가전' },
  { code: 'professional_services_repair', label: '전문 서비스·수리' },
];

const getQrToken = (): string | null => new URLSearchParams(window.location.search).get('qrToken');

const Entry = (): React.JSX.Element => {
  const qrToken = getQrToken();
  const [status, setStatus] = useState<EntryStatus>(qrToken ? 'checking' : 'error');
  const [message, setMessage] = useState(qrToken ? 'QR 상태를 확인하고 있어요.' : 'QR 토큰이 없어요. QR 링크로 다시 접속해주세요.');
  const [photoGuide, setPhotoGuide] = useState<PhotoGuide | null>(null);
  const [locationStatus, setLocationStatus] = useState<LocationStatus>('idle');
  const [form, setForm] = useState<MerchantQrActivationInput>({
    marketName: '',
    storeName: '',
    ownerName: '',
    category: '',
    latitude: 0,
    longitude: 0,
    locationAddress: '',
  });

  const requestLocation = (): void => {
    if (!navigator.geolocation) {
      setLocationStatus('error');
      setMessage('이 기기에서는 위치 정보를 사용할 수 없어요. 위치 권한을 허용한 뒤 다시 접속해주세요.');
      return;
    }

    setLocationStatus('loading');
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setForm((current) => ({ ...current, latitude: coords.latitude, longitude: coords.longitude }));
        setLocationStatus('ready');
      },
      () => {
        setLocationStatus('error');
        setMessage('가게 연결을 위해 위치 권한이 필요해요. 권한을 허용한 뒤 다시 시도해주세요.');
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  };

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

        const nextOnboarding = response.data.onboarding ?? DEFAULT_ONBOARDING;
        setPhotoGuide(nextOnboarding.photoGuide);
        setForm((current) => ({ ...current, category: nextOnboarding.selectedCategory ?? current.category }));
        if (nextOnboarding.needsLocationCapture) requestLocation();
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

  const updateField = (field: 'marketName' | 'storeName' | 'ownerName' | 'category' | 'locationAddress', value: string): void => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    if (!qrToken) return;

    if (locationStatus !== 'ready') {
      setMessage('가게 연결을 위해 위치 권한을 먼저 허용해주세요.');
      if (locationStatus !== 'loading') requestLocation();
      return;
    }

    setStatus('registering');
    setMessage('가게 정보를 연결하고 있어요.');

    try {
      const response = await activateMerchantQr({ qrToken, ...form });
      const onboardingResponse = response.data.onboarding ?? (await getMerchantQr({ qrToken })).data.onboarding;
      const nextPhotoGuide = onboardingResponse?.photoGuide;

      if (nextPhotoGuide) {
        setPhotoGuide(nextPhotoGuide);
        setStatus('photo-guide');
        setMessage('업종에 맞는 촬영 가이드를 확인해주세요.');
        return;
      }

      window.location.replace(`/?qrToken=${encodeURIComponent(qrToken)}`);
    } catch (error) {
      setStatus('unregistered');
      setMessage(error instanceof Error ? error.message : '가게 정보 등록에 실패했어요.');
    }
  };

  const isFormVisible = status === 'unregistered' || status === 'registering';
  const guideShots = photoGuide ? [...photoGuide.commonShots, ...photoGuide.categoryShots] : [];

  return (
    <Page aria-label="QR 진입 페이지">
      <Card>
        <Title>포스트톡 시작하기</Title>
        <Description>{message}</Description>
        {status === 'photo-guide' && photoGuide ? (
          <>
            <Description>{message} 권장 촬영 수는 총 {photoGuide.totalRecommendedShots}장입니다.</Description>
            <GuideList>
              {guideShots.map((shot) => (
                <GuideItem key={`${shot.order}-${shot.title}`}>
                  <GuideTitle>{shot.title}</GuideTitle>
                  {shot.description}
                </GuideItem>
              ))}
            </GuideList>
            <SubmitButton type="button" onClick={() => window.location.replace(`/?qrToken=${encodeURIComponent(qrToken ?? '')}`)}>
              광고 만들기 시작
            </SubmitButton>
          </>
        ) : isFormVisible && (
          <Form onSubmit={(event) => void handleSubmit(event)}>
            <Field>시장 이름<Input required value={form.marketName} onChange={(event) => updateField('marketName', event.target.value)} /></Field>
            <Field>가게 이름<Input required value={form.storeName} onChange={(event) => updateField('storeName', event.target.value)} /></Field>
            <Field>사장님 이름<Input required value={form.ownerName} onChange={(event) => updateField('ownerName', event.target.value)} /></Field>
            <Field>업종
              <Select required value={form.category} onChange={(event) => updateField('category', event.target.value)}>
                <option value="" disabled>업종을 선택해주세요</option>
                {CATEGORY_OPTIONS.map((option) => <option key={option.code} value={option.code}>{option.label}</option>)}
              </Select>
            </Field>
            <Field>가게 주소<Input required value={form.locationAddress} onChange={(event) => updateField('locationAddress', event.target.value)} placeholder="예: 광주 북구 용봉로 77" /></Field>
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
