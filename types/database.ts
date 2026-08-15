/**
 * Hand-written mirror of `supabase/migrations`. Regenerate with:
 *   npm run supabase:types
 * (see scripts/generate-types.sh) once the Supabase CLI is linked.
 */
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

/**
 * `Relationships` is required by postgrest-js: without it the schema does not
 * satisfy `GenericSchema` and every query silently degrades to `any`/`never`
 * instead of failing loudly. We declare no embedded relationships because the
 * app never uses PostgREST resource embedding.
 */
type TableShape<Row, Insert, Update> = {
  Row: Row;
  Insert: Insert;
  Update: Update;
  Relationships: [];
}

export type ProfileRow = {
  id: string;
  email: string | null;
  display_name: string;
  country: string | null;
  native_language: string;
  korean_level: number;
  level_key: string | null;
  learning_goals: string[];
  daily_goal_minutes: number;
  total_xp: number;
  sync_extras: Json;
  created_at: string;
  updated_at: string;
}

export type CourseRow = {
  id: string;
  title: string;
  description: string;
  level: number;
  order_index: number;
  is_premium: boolean;
  emoji: string;
  accent: string;
  created_at: string;
  updated_at: string;
}

export type UnitRow = {
  id: string;
  course_id: string;
  title: string;
  description: string;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export type LessonRow = {
  id: string;
  unit_id: string;
  title: string;
  description: string;
  lesson_type: string;
  estimated_minutes: number;
  order_index: number;
  is_premium: boolean;
  created_at: string;
  updated_at: string;
}

export type LessonContentRow = {
  id: string;
  lesson_id: string;
  content_type: string;
  korean_text: string | null;
  english_text: string | null;
  romanization: string | null;
  audio_url: string | null;
  metadata: Json | null;
  order_index: number;
  created_at: string;
}

export type VocabularyRow = {
  id: string;
  korean: string;
  english: string;
  romanization: string;
  example_korean: string | null;
  example_english: string | null;
  audio_url: string | null;
  category: string;
  level: number;
  created_at: string;
}

export type QuizRow = {
  id: string;
  lesson_id: string | null;
  question_type: string;
  question: string;
  prompt: string | null;
  correct_answer: string;
  options: string[];
  metadata: Json | null;
  created_at: string;
}

export type ProgressRow = {
  id: string;
  user_id: string;
  lesson_id: string;
  status: string;
  score: number | null;
  total_questions: number | null;
  study_seconds: number;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}

export type VocabularyProgressRow = {
  id: string;
  user_id: string;
  vocabulary_id: string;
  correct_count: number;
  wrong_count: number;
  mastery_level: number;
  last_reviewed_at: string | null;
  next_review_at: string;
  created_at: string;
  updated_at: string;
}

export type SavedWordRow = {
  id: string;
  user_id: string;
  vocabulary_id: string;
  created_at: string;
}

export type DailyPhraseRow = {
  id: string;
  korean: string;
  english: string;
  romanization: string;
  category: string;
  audio_url: string | null;
  publish_date: string;
  created_at: string;
}

export type UserStreakRow = {
  user_id: string;
  current_streak: number;
  longest_streak: number;
  last_activity_date: string | null;
  updated_at: string;
}

export type SubscriptionRow = {
  user_id: string;
  plan: string;
  status: string;
  started_at: string | null;
  expires_at: string | null;
  updated_at: string;
}

type Insert<T, Optional extends keyof T> = Omit<T, Optional> & Partial<Pick<T, Optional>>;

export type Database = {
  public: {
    Tables: {
      profiles: TableShape<
        ProfileRow,
        Insert<ProfileRow, 'created_at' | 'updated_at' | 'total_xp' | 'sync_extras'>,
        Partial<ProfileRow>
      >;
      courses: TableShape<CourseRow, Insert<CourseRow, 'created_at' | 'updated_at'>, Partial<CourseRow>>;
      units: TableShape<UnitRow, Insert<UnitRow, 'created_at' | 'updated_at'>, Partial<UnitRow>>;
      lessons: TableShape<LessonRow, Insert<LessonRow, 'created_at' | 'updated_at'>, Partial<LessonRow>>;
      lesson_content: TableShape<LessonContentRow, Insert<LessonContentRow, 'created_at'>, Partial<LessonContentRow>>;
      vocabulary: TableShape<VocabularyRow, Insert<VocabularyRow, 'created_at'>, Partial<VocabularyRow>>;
      quizzes: TableShape<QuizRow, Insert<QuizRow, 'created_at'>, Partial<QuizRow>>;
      progress: TableShape<ProgressRow, Insert<ProgressRow, 'id' | 'created_at' | 'updated_at'>, Partial<ProgressRow>>;
      vocabulary_progress: TableShape<
        VocabularyProgressRow,
        Insert<VocabularyProgressRow, 'id' | 'created_at' | 'updated_at'>,
        Partial<VocabularyProgressRow>
      >;
      saved_words: TableShape<SavedWordRow, Insert<SavedWordRow, 'id' | 'created_at'>, Partial<SavedWordRow>>;
      daily_phrases: TableShape<DailyPhraseRow, Insert<DailyPhraseRow, 'created_at'>, Partial<DailyPhraseRow>>;
      user_streaks: TableShape<UserStreakRow, Insert<UserStreakRow, 'updated_at'>, Partial<UserStreakRow>>;
      subscriptions: TableShape<SubscriptionRow, Insert<SubscriptionRow, 'updated_at'>, Partial<SubscriptionRow>>;
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
