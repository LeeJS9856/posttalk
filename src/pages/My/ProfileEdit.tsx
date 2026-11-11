import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';

import AppHeader from '@/components/layout/AppHeader';
import { MAX_SHOP_DESCRIPTION } from '@/constants/shop';
import { useShop } from '@/hooks/useShop';
import {
  Avatar,
  Count,
  Field,
  Footer,
  Form,
  Label,
  Line,
  LockedNote,
  LockedValue,
  Page,
  SaveButton,
  TextArea,
  TextInput,
} from '@/pages/My/ProfileEdit.styles';

const LockIcon = (): React.JSX.Element => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <rect x="4.5" y="10.5" width="15" height="9.5" rx="2.5" stroke="currentColor" strokeWidth="1.7" />
    <path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" stroke="currentColor" strokeWidth="1.7" />
  </svg>
);

const ProfileEdit = (): React.JSX.Element => {
  const navigate = useNavigate();
  const { profile, setProfile } = useShop();

  const [name, setName] = useState(profile.name);
  const [description, setDescription] = useState(profile.description);

  const canSave = name.trim().length > 0;

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    if (!canSave) return;

    setProfile({ ...profile, name: name.trim(), description: description.trim() });
    navigate('/my', { replace: true });
  };

  return (
    <Page aria-label="프로필 수정">
      <AppHeader title="프로필 수정" onBack={() => navigate(-1)} />

      <Form onSubmit={handleSubmit}>
        <Avatar aria-hidden="true">{(name.trim() || profile.name).slice(0, 1)}</Avatar>

        <Field>
          <Label htmlFor="shop-name">가게 이름</Label>
          <Line>
            <TextInput
              id="shop-name"
              value={name}
              placeholder="가게 이름을 적어주세요"
              onChange={(event) => setName(event.target.value)}
            />
          </Line>
        </Field>

        <Field>
          <Label htmlFor="shop-description">가게 소개</Label>
          <Line>
            <TextArea
              id="shop-description"
              rows={2}
              value={description}
              maxLength={MAX_SHOP_DESCRIPTION}
              placeholder="어떤 가게인지 한 줄로 적어주세요"
              onChange={(event) => setDescription(event.target.value)}
            />
          </Line>
          <Count $full={description.length >= MAX_SHOP_DESCRIPTION}>
            {description.length} / {MAX_SHOP_DESCRIPTION}자
          </Count>
        </Field>

        <Field>
          <Label as="p">인스타그램</Label>
          <Line>
            <LockedValue>{profile.instagram}</LockedValue>
            <LockIcon />
          </Line>
          <LockedNote>운영자가 미리 연결해 둔 계정이에요</LockedNote>
        </Field>

        <Footer>
          <SaveButton type="submit" disabled={!canSave}>
            저장
          </SaveButton>
        </Footer>
      </Form>
    </Page>
  );
};

export default ProfileEdit;
