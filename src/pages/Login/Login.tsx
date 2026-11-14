import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '@/hooks/useAuth';
import {
  BrandName,
  ErrorText,
  Field,
  FootNote,
  Form,
  Input,
  Intro,
  Label,
  Line,
  Page,
  PeekButton,
  Role,
  SubmitButton,
} from '@/pages/Login/Login.styles';

const EyeIcon = (): React.JSX.Element => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinejoin="round"
    />
    <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.7" />
  </svg>
);

const EyeOffIcon = (): React.JSX.Element => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M4 5l16 14M9.5 7A9.6 9.6 0 0 1 12 6.5c6 0 9.5 6.5 9.5 6.5a17 17 0 0 1-3 3.6M6.1 8.8A17.3 17.3 0 0 0 2.5 13S6 19.5 12 19.5c1 0 1.9-.2 2.7-.5"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const Login = (): React.JSX.Element => {
  const navigate = useNavigate();
  const { signIn } = useAuth();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isPeeking, setIsPeeking] = useState(false);
  const [isWrong, setIsWrong] = useState(false);

  const canSubmit = username.length > 0 && password.length > 0;

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    if (!canSubmit) return;

    if (!signIn(username, password)) {
      setIsWrong(true);
      return;
    }
    navigate('/', { replace: true });
  };

  return (
    <Page aria-label="로그인">
      <Form onSubmit={handleSubmit}>
        <Intro>
          <BrandName>PostTalk</BrandName>
          <Role>운영자 로그인</Role>
        </Intro>

        <Field>
          <Label htmlFor="login-username">아이디</Label>
          <Line $wrong={false}>
            <Input
              id="login-username"
              value={username}
              placeholder="아이디를 입력하세요"
              // 공용 기기라 브라우저에 계정을 남기지 않는다.
              autoComplete="off"
              onChange={(event) => {
                setUsername(event.target.value);
                setIsWrong(false);
              }}
            />
          </Line>
        </Field>

        <Field>
          <Label htmlFor="login-password">비밀번호</Label>
          <Line $wrong={isWrong}>
            <Input
              id="login-password"
              type={isPeeking ? 'text' : 'password'}
              value={password}
              placeholder="비밀번호를 입력하세요"
              autoComplete="off"
              aria-invalid={isWrong}
              aria-describedby={isWrong ? 'login-error' : undefined}
              onChange={(event) => {
                setPassword(event.target.value);
                setIsWrong(false);
              }}
            />
            <PeekButton
              type="button"
              aria-label={isPeeking ? '비밀번호 가리기' : '비밀번호 보기'}
              onClick={() => setIsPeeking((on) => !on)}
            >
              {isPeeking ? <EyeOffIcon /> : <EyeIcon />}
            </PeekButton>
          </Line>
          {isWrong && (
            <ErrorText id="login-error" role="alert">
              아이디나 비밀번호가 달라요
            </ErrorText>
          )}
        </Field>

        <SubmitButton type="submit" disabled={!canSubmit}>
          들어가기
        </SubmitButton>

        <FootNote>전시 기기에는 미리 로그인해 두세요</FootNote>
      </Form>
    </Page>
  );
};

export default Login;
