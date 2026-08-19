import { useEffect, useRef, useState } from 'react';
import { MdMic, MdStop } from 'react-icons/md';
import { useNavigate, useParams } from 'react-router-dom';

import popo from '@/assets/popo.svg';
import { FlowSubtitle, FlowTitle } from '@/components/common/FlowTitle';
import PrimaryActionButton from '@/components/common/PrimaryActionButton';
import PageHeader from '@/components/layout/PageHeader';
import { getVoiceQuestions } from '@/constants/questions';
import { useAdDraft } from '@/hooks/useAdDraft';
import { ActionArea, AnswerField, AnswerHint, Content, MicButton, Page, Popo, RecordStatus, TitleArea } from '@/pages/VoiceQuestion/VoiceQuestion.styles';

const VoiceQuestion = (): React.JSX.Element => {
  const navigate = useNavigate();
  const { questionIndex: questionIndexParam } = useParams();
  const { draft, setAnswer } = useAdDraft();
  const questions = getVoiceQuestions(draft.format);
  const questionIndex = Math.min(Math.max(Number(questionIndexParam) || 0, 0), questions.length - 1);
  const question = questions[questionIndex];
  const isLastQuestion = questionIndex === questions.length - 1;
  const isOptional = 'optional' in question && question.optional;
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const initialAnswerRef = useRef('');
  const recognizedTextRef = useRef('');
  const [answer, setAnswerText] = useState(draft.answers[question.key] ?? '');
  const [isRecording, setIsRecording] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    setAnswerText(draft.answers[question.key] ?? '');
    setErrorMessage(null);
  }, [draft.answers, question.key]);

  const finishRecording = (): void => {
    setAnswerText(`${initialAnswerRef.current} ${recognizedTextRef.current}`.trim());
    recognitionRef.current = null;
    setIsRecording(false);
  };

  useEffect(() => () => {
    recognitionRef.current?.stop();
    finishRecording();
  }, []);

  const stopRecording = (): void => {
    recognitionRef.current?.stop();
  };

  const startRecording = async (): Promise<void> => {
    const SpeechRecognitionApi = window.SpeechRecognition ?? window.webkitSpeechRecognition;

    if (!SpeechRecognitionApi) {
      setErrorMessage('이 브라우저에서는 음성 인식을 지원하지 않아요. 아래에 직접 입력해주세요.');
      return;
    }

    if (!navigator.mediaDevices?.getUserMedia) {
      setErrorMessage('보안 연결에서만 마이크를 사용할 수 있어요. HTTPS 주소로 다시 접속해주세요.');
      return;
    }

    try {
      const permission = await navigator.permissions?.query({ name: 'microphone' });

      if (permission?.state === 'denied') {
        const message = '마이크 권한이 차단되어 있어요. 브라우저 주소창의 사이트 설정에서 마이크를 허용한 뒤 다시 시도해주세요.';
        setErrorMessage(message);
        window.alert(message);
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach((track) => track.stop());
      const recognition = new SpeechRecognitionApi();

      recognition.lang = 'ko-KR';
      recognition.continuous = true;
      recognition.interimResults = false;
      recognition.onresult = (event) => {
        recognizedTextRef.current = Array.from(
          { length: event.results.length },
          (_, index) => event.results[index]?.[0]?.transcript.trim() ?? '',
        ).filter(Boolean).join(' ');
      };
      recognition.onerror = (event) => {
        if (event.error !== 'aborted') {
          setErrorMessage('음성을 인식하지 못했어요. 다시 말씀하시거나 직접 입력해주세요.');
        }
        finishRecording();
      };
      recognition.onend = finishRecording;

      recognitionRef.current = recognition;
      initialAnswerRef.current = answer.trim();
      recognizedTextRef.current = '';
      setErrorMessage(null);
      setIsRecording(true);
      recognition.start();
    } catch (error) {
      finishRecording();
      const message = error instanceof DOMException && error.name === 'NotAllowedError'
        ? '마이크 권한이 필요해요. 브라우저에서 표시되는 권한 요청을 허용하거나 사이트 설정에서 마이크를 허용해주세요.'
        : '마이크를 시작하지 못했어요. 다른 앱이 마이크를 사용 중인지 확인한 뒤 다시 시도해주세요.';
      setErrorMessage(message);
      if (error instanceof DOMException && error.name === 'NotAllowedError') window.alert(message);
    }
  };

  const handleNext = (): void => {
    const trimmedAnswer = answer.trim();

    if (!isOptional && !trimmedAnswer) {
      setErrorMessage('답변을 말씀하시거나 직접 입력해주세요.');
      return;
    }

    setAnswer(question.key, trimmedAnswer);
    if (isLastQuestion) {
      navigate(draft.format === 'photo' ? '/create/capture' : '/create/generating');
      return;
    }

    navigate(`/create/questions/${questionIndex + 1}`);
  };

  return (
    <Page aria-label={`광고 제작 질문 ${questionIndex + 1}`}>
      <PageHeader title="광고 제작" onBack={() => navigate(questionIndex === 0 ? (draft.format === 'photo' ? '/create' : '/create/capture/result?asset=food_photo') : `/create/questions/${questionIndex - 1}`)} />
      <Content>
        <Popo src={popo} alt="" />
        <TitleArea>
          <FlowTitle>{question.question}</FlowTitle>
          <FlowSubtitle>마이크 버튼을 누르고 편하게 말씀해 주세요.</FlowSubtitle>
        </TitleArea>

        <MicButton type="button" $recording={isRecording} onClick={isRecording ? stopRecording : () => void startRecording()} aria-label={isRecording ? '녹음 멈추기' : '음성으로 답변하기'}>
          {isRecording ? <MdStop /> : <MdMic />}
        </MicButton>
        <RecordStatus aria-live="polite">{isRecording ? '듣고 있어요. 말씀을 마친 뒤 정지 버튼을 눌러주세요.' : '말한 내용은 녹음이 끝난 뒤 글자로 바뀌어요.'}</RecordStatus>

        <AnswerField value={answer} onChange={(event) => setAnswerText(event.target.value)} placeholder={question.hint} aria-label={`${question.question} 답변`} />
        <AnswerHint>{errorMessage ?? (isOptional ? '답변하지 않고 다음으로 넘어갈 수 있어요.' : '잘못 인식된 내용은 직접 수정할 수 있어요.')}</AnswerHint>
      </Content>
      <ActionArea>
        <PrimaryActionButton type="button" onClick={handleNext}>{isLastQuestion ? '광고 만들기' : '다음'}</PrimaryActionButton>
      </ActionArea>
    </Page>
  );
};

export default VoiceQuestion;
