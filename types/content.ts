export type KoreanLevel = 1 | 2 | 3 | 4 | 5;

export type LevelKey =
  | 'complete_beginner'
  | 'knows_hangul'
  | 'beginner'
  | 'elementary'
  | 'intermediate'
  | 'advanced';

export type LearningGoal =
  | 'kpop_kdrama'
  | 'travel'
  | 'living'
  | 'friends_dating'
  | 'work'
  | 'topik'
  | 'fun';

export type LessonType =
  | 'hangul'
  | 'vocabulary'
  | 'conversation'
  | 'grammar'
  | 'culture'
  | 'review';

export type ContentBlockType =
  | 'introduction'
  | 'vocabulary'
  | 'expression'
  | 'listening'
  | 'speaking'
  | 'summary';

export interface Course {
  id: string;
  title: string;
  description: string;
  level: KoreanLevel;
  orderIndex: number;
  isPremium: boolean;
  emoji: string;
  accent: string;
}

export interface Unit {
  id: string;
  courseId: string;
  title: string;
  description: string;
  orderIndex: number;
}

export interface Lesson {
  id: string;
  unitId: string;
  title: string;
  description: string;
  lessonType: LessonType;
  estimatedMinutes: number;
  orderIndex: number;
  isPremium: boolean;
}

export interface LessonContent {
  id: string;
  lessonId: string;
  contentType: ContentBlockType;
  koreanText: string | null;
  englishText: string | null;
  romanization: string | null;
  audioUrl: string | null;
  metadata: Record<string, unknown> | null;
  orderIndex: number;
}

export interface Vocabulary {
  id: string;
  korean: string;
  english: string;
  romanization: string;
  exampleKorean: string | null;
  exampleEnglish: string | null;
  audioUrl: string | null;
  category: string;
  level: KoreanLevel;
}

export type QuizQuestionType =
  | 'multiple_choice_ko_en'
  | 'multiple_choice_en_ko'
  | 'word_matching'
  | 'sentence_ordering'
  | 'fill_in_the_blank'
  | 'listening'
  | 'true_false';

export interface Quiz {
  id: string;
  lessonId: string | null;
  questionType: QuizQuestionType;
  question: string;
  prompt: string | null;
  correctAnswer: string;
  options: string[];
  metadata: Record<string, unknown> | null;
}

export interface DailyPhrase {
  id: string;
  korean: string;
  english: string;
  romanization: string;
  category: DailyPhraseCategory;
  audioUrl: string | null;
  publishDate: string;
}

export type DailyPhraseCategory =
  | 'dating'
  | 'friends'
  | 'travel'
  | 'food'
  | 'work'
  | 'slang'
  | 'culture';

export interface CultureArticle {
  id: string;
  title: string;
  subtitle: string;
  emoji: string;
  readMinutes: number;
  isPremium: boolean;
  sections: { heading: string; body: string }[];
}

export interface HangulCharacter {
  id: string;
  character: string;
  romanization: string;
  type: 'consonant' | 'vowel' | 'batchim';
  exampleSyllable: string;
  exampleRomanization: string;
  tip: string;
}

export interface PlacementQuestion {
  id: string;
  level: KoreanLevel;
  question: string;
  prompt: string | null;
  options: string[];
  correctAnswer: string;
}

export interface ChatSituation {
  id: string;
  title: string;
  emoji: string;
  description: string;
  openingLine: { korean: string; english: string; romanization: string };
  isPremium: boolean;
}
