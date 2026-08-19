import type { AdFormat } from '@/constants/create';

export const SESSION_VOICE_QUESTIONS = [
  {
    key: 'menuIntro',
    question: '가게의 대표 메뉴와\n메뉴의 매력을 알려주세요.',
    hint: '예: 대표 메뉴는 제육볶음이고 직화 숯불향이 일품이에요.',
  },
  {
    key: 'storeSpecialty',
    question: '우리 가게만의\n특별함을 알려주세요.',
    hint: '예: 60년 전통이고 혼밥하기 좋아요.',
  },
] as const;

export const LEGACY_VOICE_QUESTIONS = [
  { key: 'storeType', question: '어떤 가게인가요?', hint: '예: 한식 식당이에요.' },
  { key: 'targetMenuName', question: '홍보하고 싶은 음식 이름은 무엇인가요?', hint: '예: 매콤한 제육볶음이에요.' },
  { key: 'appealPoint', question: '이 음식의 매력은 무엇인가요?', hint: '예: 갓 만든 반찬이라 따뜻하고 감칠맛이 좋아요.' },
  { key: 'targetCustomer', question: '주로 어떤 손님들이 많이 찾아오나요?', hint: '예: 인근 주민과 직장인이 많이 찾아와요.' },
  { key: 'peakSalesTime', question: '이 음식은 언제 가장 잘 팔리나요?', hint: '예: 점심시간과 퇴근 시간이에요.' },
  { key: 'popularMenuNotes', question: '요즘 손님들이 많이 찾는 음식은 무엇인가요?', hint: '예: 제육볶음과 김치찌개를 많이 찾아요.' },
  { key: 'extraMessage', question: '추가로 하고 싶은 말이 있나요?', hint: '없으면 건너뛰어도 괜찮아요.', optional: true },
] as const;

export const getVoiceQuestions = (format: AdFormat) =>
  format === 'photo' ? SESSION_VOICE_QUESTIONS : LEGACY_VOICE_QUESTIONS;

export type VoiceQuestionKey =
  | (typeof SESSION_VOICE_QUESTIONS)[number]['key']
  | (typeof LEGACY_VOICE_QUESTIONS)[number]['key'];
