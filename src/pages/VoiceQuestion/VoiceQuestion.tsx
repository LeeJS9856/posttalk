import { useEffect, useRef, useState } from 'react';
import { MdMic, MdStop } from 'react-icons/md';
import { useNavigate, useParams } from 'react-router-dom';

import popo from '@/assets/popo.svg';
import { FlowSubtitle, FlowTitle } from '@/components/common/FlowTitle';
import PrimaryActionButton from '@/components/common/PrimaryActionButton';
import PageHeader from '@/components/layout/PageHeader';
import { VOICE_QUESTIONS } from '@/constants/questions';
import { useAdDraft } from '@/hooks/useAdDraft';
import { ActionArea, AnswerField, AnswerHint, Content, MicButton, Page, Popo, QuestionCount, RecordStatus, TitleArea } from '@/pages/VoiceQuestion/VoiceQuestion.styles';

const VoiceQuestion = (): React.JSX.Element => {
  const navigate = useNavigate();
  const { questionIndex: questionIndexParam } = useParams();
  const questionIndex = Math.min(Math.max(Number(questionIndexParam) || 0, 0), VOICE_QUESTIONS.length - 1);
  const question = VOICE_QUESTIONS[questionIndex];
  const isLastQuestion = questionIndex === VOICE_QUESTIONS.length - 1;
  const isOptional = 'optional' in question && question.optional;
  const { draft, setAnswer } = useAdDraft();
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [answer, setAnswerText] = useState(draft.answers[question.key] ?? '');
  const [isRecording, setIsRecording] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    setAnswerText(draft.answers[question.key] ?? '');
    setErrorMessage(null);
  }, [draft.answers, question.key]);

  const finishRecording = (): void => {
    const recorder = mediaRecorderRef.current;
    if (recorder?.state === 'recording') recorder.stop();
    streamRef.current?.getTracks().forEach((track) => track.stop());
    mediaRecorderRef.current = null;
    streamRef.current = null;
    setIsRecording(false);
  };

  useEffect(() => () => {
    recognitionRef.current?.stop();
    finishRecording();
  }, []);

  const stopRecording = (): void => {
    recognitionRef.current?.stop();
    finishRecording();
  };

  const startRecording = async (): Promise<void> => {
    const SpeechRecognitionApi = window.SpeechRecognition ?? window.webkitSpeechRecognition;

    if (!SpeechRecognitionApi) {
      setErrorMessage('이 브라우저에서는 음성 인식을 지원하지 않아요. 아래에 직접 입력해주세요.');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const recognition = new SpeechRecognitionApi();

      streamRef.current = stream;
      mediaRecorderRef.current = recorder;
      recognition.lang = 'ko-KR';
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.onresult = (event) => {
        const transcript = Array.from({ length: event.results.length - event.resultIndex }, (_, index) => (
          event.results[event.resultIndex + index]?.[0]?.transcript ?? ''
        )).join('');

        setAnswerText(transcript.trim());
      };
      recognition.onerror = (event) => {
        if (event.error !== 'aborted') {
          setErrorMessage('음성을 인식하지 못했어요. 다시 말씀하시거나 직접 입력해주세요.');
        }
        finishRecording();
      };
      recognition.onend = finishRecording;

      recorder.start();
      recognitionRef.current = recognition;
      setErrorMessage(null);
      setIsRecording(true);
      recognition.start();
    } catch {
      finishRecording();
      setErrorMessage('마이크를 사용할 수 없어요. 마이크 권한을 허용한 뒤 다시 시도해주세요.');
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
      navigate('/create/generating');
      return;
    }

    navigate(`/create/questions/${questionIndex + 1}`);
  };

  return (
    <Page aria-label={`광고 제작 질문 ${questionIndex + 1}`}>
      <PageHeader title="광고 제작" onBack={() => navigate(questionIndex === 0 ? '/create/capture/result?asset=food_photo' : `/create/questions/${questionIndex - 1}`)} />
      <Content>
        <Popo src={popo} alt="" />
        <TitleArea>
          <QuestionCount>{questionIndex + 1} / {VOICE_QUESTIONS.length}</QuestionCount>
          <FlowTitle>{question.question}</FlowTitle>
          <FlowSubtitle>마이크 버튼을 누르고 편하게 말씀해 주세요.</FlowSubtitle>
        </TitleArea>

        <MicButton type="button" $recording={isRecording} onClick={isRecording ? stopRecording : () => void startRecording()} aria-label={isRecording ? '녹음 멈추기' : '음성으로 답변하기'}>
          {isRecording ? <MdStop /> : <MdMic />}
        </MicButton>
        <RecordStatus aria-live="polite">{isRecording ? '듣고 있어요. 말씀을 멈추면 자동으로 완료돼요.' : '말한 내용은 글자로 바뀌어요.'}</RecordStatus>

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
