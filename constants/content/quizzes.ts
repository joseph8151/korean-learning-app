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

  { id: 'q-opinions-1', lessonId: 'lesson-conversation-opinions', questionType: 'multiple_choice_ko_en', question: 'What does 글쎄요 signal?', prompt: '글쎄요', correctAnswer: 'Hesitation or soft disagreement', options: ['Hesitation or soft disagreement', 'Strong agreement', 'A firm no', 'Gratitude'], metadata: null },
  { id: 'q-opinions-2', lessonId: 'lesson-conversation-opinions', questionType: 'fill_in_the_blank', question: 'Complete: 좋은 것 ___. ("It seems good.")', prompt: '좋은 것 ___.', correctAnswer: '같아요', options: ['같아요', '주세요', '있어요', '했어요'], metadata: null },
  { id: 'q-opinions-3', lessonId: 'lesson-conversation-opinions', questionType: 'true_false', question: '~것 같아요 makes a statement softer, not stronger.', prompt: null, correctAnswer: 'True', options: ['True', 'False'], metadata: null },

  { id: 'q-feelings-1', lessonId: 'lesson-conversation-feelings', questionType: 'multiple_choice_ko_en', question: 'What does 피곤해요 mean?', prompt: '피곤해요', correctAnswer: 'I am tired', options: ['I am tired', 'I am excited', 'I am hungry', 'I am busy'], metadata: null },
  { id: 'q-feelings-2', lessonId: 'lesson-conversation-feelings', questionType: 'fill_in_the_blank', question: 'Complete: 스트레스 ___. ("I got stressed.")', prompt: '스트레스 ___.', correctAnswer: '받았어요', options: ['받았어요', '갔어요', '먹었어요', '했어요'], metadata: null },

  { id: 'q-plans-1', lessonId: 'lesson-conversation-plans', questionType: 'multiple_choice_en_ko', question: 'How do you ask "when are you free?"', prompt: null, correctAnswer: '언제 시간 괜찮아요?', options: ['언제 시간 괜찮아요?', '어디에 있어요?', '얼마예요?', '뭐 했어요?'], metadata: null },
  { id: 'q-plans-2', lessonId: 'lesson-conversation-plans', questionType: 'sentence_ordering', question: 'Build: "How about Saturday?"', prompt: 'How about Saturday?', correctAnswer: '토요일 어때요', options: ['토요일', '어때요'], metadata: null },

  { id: 'q-declining-1', lessonId: 'lesson-conversation-declining', questionType: 'multiple_choice_ko_en', question: 'What does 미안하지만 introduce?', prompt: '미안하지만', correctAnswer: 'A polite refusal', options: ['A polite refusal', 'An apology for being late', 'A thank you', 'A greeting'], metadata: null },
  { id: 'q-declining-2', lessonId: 'lesson-conversation-declining', questionType: 'true_false', question: 'Adding 다음에 keeps a declined invitation friendly.', prompt: null, correctAnswer: 'True', options: ['True', 'False'], metadata: null },

  { id: 'q-pharmacy-1', lessonId: 'lesson-living-pharmacy', questionType: 'multiple_choice_ko_en', question: 'What does 머리가 아파요 mean?', prompt: '머리가 아파요.', correctAnswer: 'My head hurts', options: ['My head hurts', 'My stomach hurts', 'I am dizzy', 'I have a fever'], metadata: null },
  { id: 'q-pharmacy-2', lessonId: 'lesson-living-pharmacy', questionType: 'multiple_choice_en_ko', question: 'How do you ask for cold medicine?', prompt: null, correctAnswer: '감기약 주세요', options: ['감기약 주세요', '병원 가요', '물 주세요', '얼마예요?'], metadata: null },
  { id: 'q-pharmacy-3', lessonId: 'lesson-living-pharmacy', questionType: 'listening', question: 'What did you hear?', prompt: '식후 삼십 분에 드세요.', correctAnswer: 'Take it 30 minutes after meals', options: ['Take it 30 minutes after meals', 'Take it before bed', 'Take three a day', 'Take it with water'], metadata: null },

  { id: 'q-emergency-1', lessonId: 'lesson-living-emergency', questionType: 'multiple_choice_ko_en', question: 'Which number is the ambulance in Korea?', prompt: null, correctAnswer: '119', options: ['119', '112', '911', '999'], metadata: null },
  { id: 'q-emergency-2', lessonId: 'lesson-living-emergency', questionType: 'multiple_choice_en_ko', question: 'How do you shout "please help me"?', prompt: null, correctAnswer: '도와주세요', options: ['도와주세요', '감사합니다', '괜찮아요', '실례합니다'], metadata: null },

  { id: 'q-apartment-1', lessonId: 'lesson-living-apartment', questionType: 'multiple_choice_ko_en', question: 'What does 고장났어요 mean?', prompt: '고장났어요', correctAnswer: 'It is broken', options: ['It is broken', 'It is expensive', 'It is closed', 'It is ready'], metadata: null },
  { id: 'q-apartment-2', lessonId: 'lesson-living-apartment', questionType: 'fill_in_the_blank', question: 'Complete: 뜨거운 물이 ___ 나와요. ("No hot water.")', prompt: '뜨거운 물이 ___ 나와요.', correctAnswer: '안', options: ['안', '더', '잘', '또'], metadata: null },

  { id: 'q-hotel-1', lessonId: 'lesson-travel-hotel', questionType: 'multiple_choice_en_ko', question: 'How do you say you would like to check in?', prompt: null, correctAnswer: '체크인 하려고 하는데요', options: ['체크인 하려고 하는데요', '예약 취소할게요', '짐 주세요', '얼마예요?'], metadata: null },
  { id: 'q-hotel-2', lessonId: 'lesson-travel-hotel', questionType: 'multiple_choice_ko_en', question: 'What does 짐 좀 맡길 수 있어요? ask?', prompt: '짐 좀 맡길 수 있어요?', correctAnswer: 'Can I leave my luggage?', options: ['Can I leave my luggage?', 'Can I check out late?', 'Can I get a receipt?', 'Can I change rooms?'], metadata: null },

  { id: 'q-sightseeing-1', lessonId: 'lesson-travel-sightseeing', questionType: 'multiple_choice_ko_en', question: 'What does 입장료 mean?', prompt: '입장료', correctAnswer: 'Entry fee', options: ['Entry fee', 'Opening time', 'Exit', 'Ticket office'], metadata: null },
  { id: 'q-sightseeing-2', lessonId: 'lesson-travel-sightseeing', questionType: 'sentence_ordering', question: 'Build: "Two adult tickets, please."', prompt: 'Two adult tickets, please.', correctAnswer: '어른 두 장 주세요', options: ['어른', '두 장', '주세요'], metadata: null },

  { id: 'q-email-1', lessonId: 'lesson-work-email', questionType: 'multiple_choice_ko_en', question: 'What does 확인 부탁드립니다 mean?', prompt: '확인 부탁드립니다.', correctAnswer: 'Please kindly confirm', options: ['Please kindly confirm', 'Thank you for your work', 'I will send it later', 'Please call me'], metadata: null },
  { id: 'q-email-2', lessonId: 'lesson-work-email', questionType: 'word_matching', question: 'Match the Korean to its meaning.', prompt: null, correctAnswer: '일정', options: ['일정', '확인', '자료', '회의'], metadata: { matchTarget: 'Schedule' } },
  { id: 'q-email-3', lessonId: 'lesson-work-email', questionType: 'true_false', question: '~드립니다 is a humble ending that makes writing sound polite.', prompt: null, correctAnswer: 'True', options: ['True', 'False'], metadata: null },
];
