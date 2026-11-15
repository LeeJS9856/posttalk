import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';

import AppHeader from '@/components/layout/AppHeader';
import { goBackTo } from '@/constants/navigation';
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
  Page,
  SaveButton,
  TextArea,
  TextInput,
} from '@/pages/My/ProfileEdit.styles';

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
    goBackTo(navigate, '/my');
  };

  return (
    <Page aria-label="프로필 수정">
      <AppHeader title="프로필 수정" onBack={() => navigate(-1)} />

      <Form onSubmit={handleSubmit}>
        <Avatar aria-hidden="true">{(name.trim() || profile.name).slice(0, 1) || '가'}</Avatar>

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
