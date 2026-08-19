import { useState, type FormEvent } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import popo from '@/assets/popo.svg';
import { useAuth } from '@/hooks/useAuth';
import { Form, HelperText, IdInput, InputField, InputLabel, Logo, Page, PasswordInput, SubmitButton, Subtitle, Title, Welcome } from '@/pages/Login/Login.styles';

const Login = (): React.JSX.Element => {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    if (!id || !password) return;

    login(id);
    navigate((location.state as { from?: string } | null)?.from ?? '/', { replace: true });
  };

  return (
    <Page aria-label="로그인 페이지">
      <Welcome>
        <Logo src={popo} alt="PostTalk" />
        <Title>다시 만나서 반가워요</Title>
        <Subtitle>아이디와 비밀번호를 입력해주세요.</Subtitle>
      </Welcome>

      <Form onSubmit={handleSubmit}>
        <InputField>
          <InputLabel htmlFor="login-id">아이디</InputLabel>
          <IdInput
            id="login-id"
            value={id}
            onChange={(event) => setId(event.target.value)}
            placeholder="아이디를 입력해주세요"
            autoComplete="username"
          />
        </InputField>

        <InputField>
          <InputLabel htmlFor="login-password">비밀번호</InputLabel>
          <PasswordInput
            id="login-password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="비밀번호를 입력해주세요"
            autoComplete="current-password"
          />
        </InputField>

        <SubmitButton type="submit" disabled={!id || !password}>로그인</SubmitButton>
      </Form>

      <HelperText>계정이 없으신가요? 관리자에게 문의해주세요.</HelperText>
    </Page>
  );
};

export default Login;
