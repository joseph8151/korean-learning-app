import type { AIProvider, ChatMessage, ChatTurnRequest, ChatTurnResponse } from './types';

interface ScriptedTurn {
  korean: string;
  english: string;
  romanization: string;
  hint: { korean: string; english: string };
  /** Suggested natural phrasing shown when the learner's Korean is very short. */
  suggestion: { korean: string; english: string };
}

const SCRIPTS: Record<string, ScriptedTurn[]> = {
  cafe: [
    {
      korean: '네, 아이스로 드릴까요, 따뜻하게 드릴까요?',
      english: 'Sure — iced or hot?',
      romanization: 'ne, aiseuro deurilkkayo, ttatteutage deurilkkayo?',
      hint: { korean: '아이스로 주세요.', english: 'Iced, please.' },
      suggestion: { korean: '아메리카노 한 잔 주세요.', english: 'One americano, please.' },
    },
    {
      korean: '드시고 가세요, 아니면 테이크아웃이세요?',
      english: 'For here or to go?',
      romanization: 'deusigo gaseyo, animyeon teikeuautiseyo?',
      hint: { korean: '테이크아웃 할게요.', english: "I'll take it to go." },
      suggestion: { korean: '테이크아웃 할게요.', english: "I'll take it to go." },
    },
    {
      korean: '사천오백 원입니다. 결제 도와드릴게요.',
      english: "That's 4,500 won. Let me take your payment.",
      romanization: 'sacheonobaek wonimnida. gyeolje dowadeurilgeyo.',
      hint: { korean: '카드로 할게요.', english: "I'll pay by card." },
      suggestion: { korean: '카드로 할게요.', english: "I'll pay by card." },
    },
    {
      korean: '주문 도와드렸습니다. 좋은 하루 보내세요!',
      english: 'All done. Have a great day!',
      romanization: 'jumun dowadeuryeotseumnida. joeun haru bonaeseyo!',
      hint: { korean: '감사합니다!', english: 'Thank you!' },
      suggestion: { korean: '감사합니다!', english: 'Thank you!' },
    },
  ],
  restaurant: [
    {
      korean: '이쪽으로 앉으세요. 메뉴판 여기 있습니다.',
      english: 'Please sit here. Here is the menu.',
      romanization: 'ijjogeuro anjeuseyo. menyupan yeogi itseumnida.',
      hint: { korean: '두 명이에요.', english: 'Two people.' },
      suggestion: { korean: '두 명이에요.', english: 'Two people.' },
    },
    {
      korean: '주문하시겠어요?',
      english: 'Would you like to order?',
      romanization: 'jumunhasigesseoyo?',
      hint: { korean: '이거 두 개 주세요.', english: 'Two of these, please.' },
      suggestion: { korean: '이거 두 개 주세요.', english: 'Two of these, please.' },
    },
    {
      korean: '맵기는 어떻게 해드릴까요?',
      english: 'How spicy would you like it?',
      romanization: 'maepgineun eotteoke haedeurilkkayo?',
      hint: { korean: '안 맵게 해 주세요.', english: 'Not spicy, please.' },
      suggestion: { korean: '안 맵게 해 주세요.', english: 'Not spicy, please.' },
    },
  ],
  convenience: [
    {
      korean: '네, 데워 드릴까요?',
      english: 'Sure — shall I heat it up?',
      romanization: 'ne, dewo deurilkkayo?',
      hint: { korean: '네, 데워 주세요.', english: 'Yes, please heat it up.' },
      suggestion: { korean: '이거 데워 주세요.', english: 'Please heat this up.' },
    },
    {
      korean: '봉투는 오십 원입니다. 필요하세요?',
      english: 'A bag is 50 won. Do you need one?',
      romanization: 'bongtuneun osip wonimnida. piryohaseyo?',
      hint: { korean: '아니요, 괜찮아요.', english: "No, I'm fine." },
      suggestion: { korean: '아니요, 괜찮아요.', english: "No, I'm fine." },
    },
  ],
};

const DEFAULT_SCRIPT: ScriptedTurn[] = [
  {
    korean: '네, 좋아요. 조금 더 말해 주세요.',
    english: 'Sounds good. Tell me a bit more.',
    romanization: 'ne, joayo. jogeum deo malhae juseyo.',
    hint: { korean: '천천히 말해 주세요.', english: 'Please speak slowly.' },
    suggestion: { korean: '천천히 말해 주세요.', english: 'Please speak slowly.' },
  },
  {
    korean: '아, 그렇군요! 한국어 정말 잘하시네요.',
    english: 'Ah, I see! Your Korean is really good.',
    romanization: 'a, geureotgunyo! hangugeo jeongmal jalhasineyo.',
    hint: { korean: '감사합니다. 아직 배우고 있어요.', english: "Thank you. I'm still learning." },
    suggestion: { korean: '감사합니다!', english: 'Thank you!' },
  },
  {
    korean: '오늘 연습 아주 좋았어요. 또 해요!',
    english: 'Great practice today. Let’s do it again!',
    romanization: 'oneul yeonseup aju joasseoyo. tto haeyo!',
    hint: { korean: '네, 또 만나요!', english: 'Yes, see you again!' },
    suggestion: { korean: '또 만나요!', english: 'See you again!' },
  },
];

let messageCounter = 0;

function nextId(): string {
  messageCounter += 1;
  return `ai-${Date.now()}-${messageCounter}`;
}

/**
 * Deterministic scripted partner so the AI Korean Partner is fully usable in
 * the MVP with no API key and no network.
 */
export const mockAIProvider: AIProvider = {
  id: 'mock',
  isMock: true,

  async sendTurn(request: ChatTurnRequest): Promise<ChatTurnResponse> {
    const script = SCRIPTS[request.situationId] ?? DEFAULT_SCRIPT;
    const assistantTurnsSoFar = request.history.filter((message) => message.role === 'assistant').length;
    const turn = script[Math.min(Math.max(assistantTurnsSoFar - 1, 0), script.length - 1)];

    const looksShort = request.userText.trim().length > 0 && request.userText.trim().length < 6;

    const reply: ChatMessage = {
      id: nextId(),
      role: 'assistant',
      korean: turn.korean,
      english: turn.english,
      romanization: turn.romanization,
      suggestion: looksShort ? turn.suggestion : null,
    };

    await new Promise((resolve) => setTimeout(resolve, 450));

    return { reply, hint: turn.hint };
  },
};
