import type { Quiz } from '@/types/content';

export const QUIZZES: Quiz[] = [
  { id: 'q-hello-1', lessonId: 'lesson-greetings-hello', questionType: 'multiple_choice_ko_en', question: 'What does 안녕하세요 mean?', prompt: '안녕하세요', correctAnswer: 'Hello', options: ['Hello', 'Thank you', 'Goodbye', 'Sorry'], metadata: null },
  { id: 'q-hello-2', lessonId: 'lesson-greetings-hello', questionType: 'multiple_choice_en_ko', question: 'How do you say goodbye to someone who is leaving?', prompt: null, correctAnswer: '안녕히 가세요', options: ['안녕히 가세요', '안녕히 계세요', '감사합니다', '반가워요'], metadata: null },
  { id: 'q-hello-3', lessonId: 'lesson-greetings-hello', questionType: 'true_false', question: '안녕하세요 can be used in the morning and the evening.', prompt: null, correctAnswer: 'True', options: ['True', 'False'], metadata: null },
  { id: 'q-hello-4', lessonId: 'lesson-greetings-hello', questionType: 'sentence_ordering', question: 'Put the sentence in the right order.', prompt: 'Nice to meet you.', correctAnswer: '만나서 반가워요', options: ['만나서', '반가워요'], metadata: null },

  { id: 'q-yesno-1', lessonId: 'lesson-greetings-yesno', questionType: 'multiple_choice_ko_en', question: 'What does 아니요 mean?', prompt: '아니요', correctAnswer: 'No', options: ['No', 'Yes', 'Maybe', 'Please'], metadata: null },
  { id: 'q-yesno-2', lessonId: 'lesson-greetings-yesno', questionType: 'fill_in_the_blank', question: 'Complete: ___, 괜찮아요. ("No, I\'m fine.")', prompt: '___, 괜찮아요.', correctAnswer: '아니요', options: ['아니요', '네', '주세요', '감사'], metadata: null },

  { id: 'q-thanks-1', lessonId: 'lesson-greetings-thanks', questionType: 'multiple_choice_en_ko', question: 'How do you say "thank you" formally?', prompt: null, correctAnswer: '감사합니다', options: ['감사합니다', '죄송합니다', '천만에요', '괜찮아요'], metadata: null },
  { id: 'q-thanks-2', lessonId: 'lesson-greetings-thanks', questionType: 'multiple_choice_ko_en', question: 'What does 죄송합니다 mean?', prompt: '죄송합니다', correctAnswer: 'I am sorry', options: ['I am sorry', 'Thank you', 'You are welcome', 'Excuse me'], metadata: null },
  { id: 'q-thanks-3', lessonId: 'lesson-greetings-thanks', questionType: 'word_matching', question: 'Match the Korean to its meaning.', prompt: null, correctAnswer: '천만에요', options: ['천만에요', '감사합니다', '죄송합니다', '반가워요'], metadata: { matchTarget: "You're welcome" } },

  { id: 'q-intro-1', lessonId: 'lesson-greetings-intro', questionType: 'multiple_choice_ko_en', question: 'What does 저는 미국에서 왔어요 mean?', prompt: '저는 미국에서 왔어요.', correctAnswer: 'I came from the United States', options: ['I came from the United States', 'I am going to America', 'I live in Korea', 'I like America'], metadata: null },
  { id: 'q-intro-2', lessonId: 'lesson-greetings-intro', questionType: 'fill_in_the_blank', question: 'Complete: 이름이 ___? ("What is your name?")', prompt: '이름이 ___?', correctAnswer: '뭐예요', options: ['뭐예요', '주세요', '왔어요', '괜찮아요'], metadata: null },
  { id: 'q-intro-3', lessonId: 'lesson-greetings-intro', questionType: 'sentence_ordering', question: 'Build: "I am Alex."', prompt: 'I am Alex.', correctAnswer: '저는 알렉스예요', options: ['저는', '알렉스예요'], metadata: null },

  { id: 'q-coffee-1', lessonId: 'lesson-cafe-coffee', questionType: 'multiple_choice_en_ko', question: 'How do you order one americano?', prompt: null, correctAnswer: '아메리카노 한 잔 주세요', options: ['아메리카노 한 잔 주세요', '아메리카노 얼마예요?', '물 좀 주세요', '카드로 할게요'], metadata: null },
  { id: 'q-coffee-2', lessonId: 'lesson-cafe-coffee', questionType: 'multiple_choice_ko_en', question: 'What does 주세요 mean?', prompt: '주세요', correctAnswer: 'Please give me', options: ['Please give me', 'Thank you', 'How much', 'I am sorry'], metadata: null },
  { id: 'q-coffee-3', lessonId: 'lesson-cafe-coffee', questionType: 'listening', question: 'What did you hear?', prompt: '아이스 아메리카노 주세요.', correctAnswer: 'An iced americano, please', options: ['An iced americano, please', 'A hot latte, please', 'Water, please', 'The receipt, please'], metadata: null },
  { id: 'q-coffee-4', lessonId: 'lesson-cafe-coffee', questionType: 'sentence_ordering', question: 'Build: "One americano, please."', prompt: 'One americano, please.', correctAnswer: '아메리카노 한 잔 주세요', options: ['아메리카노', '한 잔', '주세요'], metadata: null },
  { id: 'q-coffee-5', lessonId: 'lesson-cafe-coffee', questionType: 'true_false', question: '테이크아웃 means you will drink it in the cafe.', prompt: null, correctAnswer: 'False', options: ['True', 'False'], metadata: null },

  { id: 'q-water-1', lessonId: 'lesson-cafe-water', questionType: 'multiple_choice_ko_en', question: 'What does 저기요 mean?', prompt: '저기요', correctAnswer: 'Excuse me', options: ['Excuse me', 'Over there', 'Goodbye', 'Please wait'], metadata: null },
  { id: 'q-water-2', lessonId: 'lesson-cafe-water', questionType: 'fill_in_the_blank', question: 'Complete: 물 좀 ___. ("Some water, please.")', prompt: '물 좀 ___.', correctAnswer: '주세요', options: ['주세요', '왔어요', '괜찮아요', '얼마예요'], metadata: null },

  { id: 'q-paying-1', lessonId: 'lesson-cafe-paying', questionType: 'multiple_choice_ko_en', question: 'What does 얼마예요? mean?', prompt: '얼마예요?', correctAnswer: 'How much is it?', options: ['How much is it?', 'Where is it?', 'What is it?', 'Who is it?'], metadata: null },
  { id: 'q-paying-2', lessonId: 'lesson-cafe-paying', questionType: 'multiple_choice_en_ko', question: 'How do you ask for a receipt?', prompt: null, correctAnswer: '영수증 주세요', options: ['영수증 주세요', '봉투 주세요', '카드 되나요?', '얼마예요?'], metadata: null },
  { id: 'q-paying-3', lessonId: 'lesson-cafe-paying', questionType: 'word_matching', question: 'Match the Korean to its meaning.', prompt: null, correctAnswer: '현금', options: ['현금', '카드', '영수증', '봉투'], metadata: { matchTarget: 'Cash' } },

  { id: 'q-hangul-1', lessonId: 'lesson-hangul-consonants', questionType: 'multiple_choice_ko_en', question: 'How is ㄱ pronounced?', prompt: 'ㄱ', correctAnswer: 'g / k', options: ['g / k', 'n', 'm', 's'], metadata: null },
  { id: 'q-hangul-2', lessonId: 'lesson-hangul-consonants', questionType: 'multiple_choice_ko_en', question: 'How do you read 가?', prompt: '가', correctAnswer: 'ga', options: ['ga', 'na', 'ma', 'sa'], metadata: null },
  { id: 'q-hangul-3', lessonId: 'lesson-hangul-vowels', questionType: 'multiple_choice_ko_en', question: 'How is ㅗ pronounced?', prompt: 'ㅗ', correctAnswer: 'o', options: ['o', 'a', 'u', 'eo'], metadata: null },
  { id: 'q-hangul-4', lessonId: 'lesson-hangul-vowels', questionType: 'true_false', question: 'Horizontal vowels like ㅗ are written under the consonant.', prompt: null, correctAnswer: 'True', options: ['True', 'False'], metadata: null },

  { id: 'q-numbers-1', lessonId: 'lesson-numbers-sino', questionType: 'multiple_choice_ko_en', question: 'What number is 오?', prompt: '오', correctAnswer: '5', options: ['5', '3', '7', '10'], metadata: null },
  { id: 'q-numbers-2', lessonId: 'lesson-numbers-native', questionType: 'fill_in_the_blank', question: 'Complete: 커피 ___ 잔 주세요. ("Two coffees, please.")', prompt: '커피 ___ 잔 주세요.', correctAnswer: '두', options: ['두', '이', '둘', '다섯'], metadata: null },

  { id: 'q-restaurant-1', lessonId: 'lesson-food-restaurant', questionType: 'multiple_choice_ko_en', question: 'What does 주문하시겠어요? mean?', prompt: '주문하시겠어요?', correctAnswer: 'Would you like to order?', options: ['Would you like to order?', 'Is it spicy?', 'How many people?', 'Do you need a bag?'], metadata: null },
  { id: 'q-restaurant-2', lessonId: 'lesson-food-restaurant', questionType: 'multiple_choice_en_ko', question: 'How do you ask for the bill?', prompt: null, correctAnswer: '계산할게요', options: ['계산할게요', '주문할게요', '데워 주세요', '포장해 주세요'], metadata: null },

  { id: 'q-convenience-1', lessonId: 'lesson-food-convenience', questionType: 'multiple_choice_ko_en', question: 'What does 데워 주세요 mean?', prompt: '데워 주세요', correctAnswer: 'Please heat it up', options: ['Please heat it up', 'Please pack it', 'Please give me a bag', 'Please stop here'], metadata: null },
  { id: 'q-subway-1', lessonId: 'lesson-transport-subway', questionType: 'multiple_choice_ko_en', question: 'What does 환승 mean?', prompt: '환승', correctAnswer: 'Transfer', options: ['Transfer', 'Exit', 'Station', 'Ticket'], metadata: null },
  { id: 'q-subway-2', lessonId: 'lesson-transport-subway', questionType: 'sentence_ordering', question: 'Build: "How do I get to Gangnam Station?"', prompt: 'How do I get to Gangnam Station?', correctAnswer: '강남역 어떻게 가요', options: ['강남역', '어떻게', '가요'], metadata: null },
];
