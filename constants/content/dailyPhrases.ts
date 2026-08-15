import type { DailyPhrase } from '@/types/content';

export const DAILY_PHRASES: DailyPhrase[] = [
  { id: 'dp-01', korean: '오늘 뭐 해요?', english: 'What are you doing today?', romanization: 'oneul mwo haeyo?', category: 'friends', audioUrl: null, publishDate: '2025-01-01' },
  { id: 'dp-02', korean: '아메리카노 한 잔 주세요.', english: 'One americano, please.', romanization: 'amerikano han jan juseyo.', category: 'food', audioUrl: null, publishDate: '2025-01-02' },
  { id: 'dp-03', korean: '진짜 대박이에요!', english: "That's awesome!", romanization: 'jinjja daebagieyo!', category: 'slang', audioUrl: null, publishDate: '2025-01-03' },
  { id: 'dp-04', korean: '밥 먹었어요?', english: 'Have you eaten?', romanization: 'bap meogeosseoyo?', category: 'culture', audioUrl: null, publishDate: '2025-01-04' },
  { id: 'dp-05', korean: '천천히 말해 주세요.', english: 'Please speak slowly.', romanization: 'cheoncheonhi malhae juseyo.', category: 'travel', audioUrl: null, publishDate: '2025-01-05' },
  { id: 'dp-06', korean: '우리 언제 만날까요?', english: 'When should we meet?', romanization: 'uri eonje mannalkkayo?', category: 'dating', audioUrl: null, publishDate: '2025-01-06' },
  { id: 'dp-07', korean: '수고하셨습니다.', english: 'Good work today.', romanization: 'sugohasyeotseumnida.', category: 'work', audioUrl: null, publishDate: '2025-01-07' },
  { id: 'dp-08', korean: '이거 진짜 맛있어요.', english: 'This is really delicious.', romanization: 'igeo jinjja masisseoyo.', category: 'food', audioUrl: null, publishDate: '2025-01-08' },
  { id: 'dp-09', korean: '화장실이 어디예요?', english: 'Where is the bathroom?', romanization: 'hwajangsiri eodiyeyo?', category: 'travel', audioUrl: null, publishDate: '2025-01-09' },
  { id: 'dp-10', korean: '오늘 시간 있어요?', english: 'Do you have time today?', romanization: 'oneul sigan isseoyo?', category: 'dating', audioUrl: null, publishDate: '2025-01-10' },
  { id: 'dp-11', korean: '완전 좋아요!', english: 'I totally love it!', romanization: 'wanjeon joayo!', category: 'slang', audioUrl: null, publishDate: '2025-01-11' },
  { id: 'dp-12', korean: '조심히 가세요.', english: 'Get home safely.', romanization: 'josimhi gaseyo.', category: 'culture', audioUrl: null, publishDate: '2025-01-12' },
  { id: 'dp-13', korean: '내일 회의 있어요.', english: 'There is a meeting tomorrow.', romanization: 'naeil hoeui isseoyo.', category: 'work', audioUrl: null, publishDate: '2025-01-13' },
  { id: 'dp-14', korean: '같이 갈래요?', english: 'Do you want to go together?', romanization: 'gachi gallaeyo?', category: 'friends', audioUrl: null, publishDate: '2025-01-14' },
  { id: 'dp-15', korean: '여기서 세워 주세요.', english: 'Please stop here.', romanization: 'yeogiseo sewo juseyo.', category: 'travel', audioUrl: null, publishDate: '2025-01-15' },
  { id: 'dp-16', korean: '커피 한잔할래요?', english: 'Want to grab a coffee?', romanization: 'keopi hanjanhallaeyo?', category: 'dating', audioUrl: null, publishDate: '2025-01-16' },
  { id: 'dp-17', korean: '진짜요?', english: 'Really?', romanization: 'jinjjayo?', category: 'friends', audioUrl: null, publishDate: '2025-01-17' },
  { id: 'dp-18', korean: '배고파 죽겠어요.', english: "I'm starving.", romanization: 'baegopa jukgesseoyo.', category: 'slang', audioUrl: null, publishDate: '2025-01-18' },
];

/** Rotates through the phrase list so every day shows a different phrase. */
export function getDailyPhrase(date: Date = new Date()): DailyPhrase {
  const daysSinceEpoch = Math.floor(date.getTime() / 86_400_000);
  return DAILY_PHRASES[Math.abs(daysSinceEpoch) % DAILY_PHRASES.length];
}
