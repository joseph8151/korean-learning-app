import type { PlacementQuestion } from '@/types/content';

export const PLACEMENT_QUESTIONS: PlacementQuestion[] = [
  { id: 'p-01', level: 1, question: 'What does 안녕하세요 mean?', prompt: '안녕하세요', options: ['Hello', 'Thank you', 'Goodbye', 'Sorry'], correctAnswer: 'Hello' },
  { id: 'p-02', level: 1, question: 'What does 감사합니다 mean?', prompt: '감사합니다', options: ['Thank you', 'Please', 'Excuse me', 'Yes'], correctAnswer: 'Thank you' },
  { id: 'p-03', level: 1, question: 'How do you read 가?', prompt: '가', options: ['ga', 'na', 'ma', 'da'], correctAnswer: 'ga' },
  { id: 'p-04', level: 2, question: 'What does 저는 미국에서 왔어요 mean?', prompt: '저는 미국에서 왔어요.', options: ['I came from the United States', 'I am going to America', 'I like America', 'I live in Korea'], correctAnswer: 'I came from the United States' },
  { id: 'p-05', level: 2, question: 'How do you order one americano?', prompt: null, options: ['아메리카노 한 잔 주세요', '아메리카노 얼마예요?', '아메리카노 좋아요', '아메리카노 있어요?'], correctAnswer: '아메리카노 한 잔 주세요' },
  { id: 'p-06', level: 2, question: 'Which particle marks the topic of a sentence?', prompt: '저__ 학생이에요.', options: ['는', '를', '에', '도'], correctAnswer: '는' },
  { id: 'p-07', level: 3, question: 'What does 어디서 환승해요? mean?', prompt: '어디서 환승해요?', options: ['Where do I transfer?', 'Where is the exit?', 'When does it leave?', 'How much is it?'], correctAnswer: 'Where do I transfer?' },
  { id: 'p-08', level: 3, question: 'Choose the past tense of 먹다 (to eat), polite form.', prompt: null, options: ['먹었어요', '먹어요', '먹을게요', '먹고 있어요'], correctAnswer: '먹었어요' },
  { id: 'p-09', level: 3, question: 'What does 밥 먹었어요? really mean between friends?', prompt: '밥 먹었어요?', options: ['How are you?', 'Are you hungry right now?', 'Do you want rice?', 'Can you cook?'], correctAnswer: 'How are you?' },
  { id: 'p-10', level: 4, question: 'Which sentence means "I was going to go, but it rained"?', prompt: null, options: ['가려고 했는데 비가 왔어요', '가고 싶어요 그리고 비가 와요', '가면 비가 와요', '갈 거예요 비가 와서'], correctAnswer: '가려고 했는데 비가 왔어요' },
  { id: 'p-11', level: 4, question: 'What does ~는 편이에요 express?', prompt: '조용한 편이에요.', options: ['A mild tendency ("rather quiet")', 'A strong command', 'A future plan', 'A past habit'], correctAnswer: 'A mild tendency ("rather quiet")' },
  { id: 'p-12', level: 4, question: 'Choose the most natural business closing.', prompt: null, options: ['수고하셨습니다', '잘 가', '반가워', '어서 와'], correctAnswer: '수고하셨습니다' },
  { id: 'p-13', level: 5, question: 'What does 눈치가 빠르다 describe?', prompt: '그 사람 눈치가 빨라요.', options: ['Quick at reading a room', 'Physically fast', 'Very talkative', 'Good at studying'], correctAnswer: 'Quick at reading a room' },
  { id: 'p-14', level: 5, question: 'Which ending expresses "even if"?', prompt: '비가 와__ 갈 거예요.', options: ['도', '서', '니까', '면서'], correctAnswer: '도' },
  { id: 'p-15', level: 5, question: 'What nuance does ~더라고요 carry?', prompt: '생각보다 크더라고요.', options: ['Recalling something you personally noticed', 'A polite request', 'A future intention', 'Reported speech from someone else'], correctAnswer: 'Recalling something you personally noticed' },
];
