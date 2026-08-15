import { getSupabase } from '@/lib/supabase';
import type {
  Course,
  DailyPhrase,
  DailyPhraseCategory,
  KoreanLevel,
  Lesson,
  LessonContent,
  LessonType,
  Quiz,
  QuizQuestionType,
  Unit,
  Vocabulary,
} from '@/types/content';
import type {
  CourseRow,
  DailyPhraseRow,
  LessonContentRow,
  LessonRow,
  QuizRow,
  UnitRow,
  VocabularyRow,
} from '@/types/database';
import { localContentSource } from './localContentSource';
import type { ContentSource } from './types';

function toCourse(row: CourseRow): Course {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    level: row.level as KoreanLevel,
    orderIndex: row.order_index,
    isPremium: row.is_premium,
    emoji: row.emoji,
    accent: row.accent,
  };
}

function toUnit(row: UnitRow): Unit {
  return {
    id: row.id,
    courseId: row.course_id,
    title: row.title,
    description: row.description,
    orderIndex: row.order_index,
  };
}

function toLesson(row: LessonRow): Lesson {
  return {
    id: row.id,
    unitId: row.unit_id,
    title: row.title,
    description: row.description,
    lessonType: row.lesson_type as LessonType,
    estimatedMinutes: row.estimated_minutes,
    orderIndex: row.order_index,
    isPremium: row.is_premium,
  };
}

function toLessonContent(row: LessonContentRow): LessonContent {
  return {
    id: row.id,
    lessonId: row.lesson_id,
    contentType: row.content_type as LessonContent['contentType'],
    koreanText: row.korean_text,
    englishText: row.english_text,
    romanization: row.romanization,
    audioUrl: row.audio_url,
    metadata: (row.metadata as Record<string, unknown> | null) ?? null,
    orderIndex: row.order_index,
  };
}

function toVocabulary(row: VocabularyRow): Vocabulary {
  return {
    id: row.id,
    korean: row.korean,
    english: row.english,
    romanization: row.romanization,
    exampleKorean: row.example_korean,
    exampleEnglish: row.example_english,
    audioUrl: row.audio_url,
    category: row.category,
    level: row.level as KoreanLevel,
  };
}

function toQuiz(row: QuizRow): Quiz {
  return {
    id: row.id,
    lessonId: row.lesson_id,
    questionType: row.question_type as QuizQuestionType,
    question: row.question,
    prompt: row.prompt,
    correctAnswer: row.correct_answer,
    options: row.options ?? [],
    metadata: (row.metadata as Record<string, unknown> | null) ?? null,
  };
}

function toDailyPhrase(row: DailyPhraseRow): DailyPhrase {
  return {
    id: row.id,
    korean: row.korean,
    english: row.english,
    romanization: row.romanization,
    category: row.category as DailyPhraseCategory,
    audioUrl: row.audio_url,
    publishDate: row.publish_date,
  };
}

/**
 * Reads published content from Supabase and silently falls back to bundled
 * content on any failure, so a network blip never blanks a screen.
 */
export const supabaseContentSource: ContentSource = {
  async listCourses() {
    const supabase = getSupabase();
    if (!supabase) return localContentSource.listCourses();

    const { data, error } = await supabase.from('courses').select('*').order('order_index');
    if (error || !data?.length) return localContentSource.listCourses();
    return data.map(toCourse);
  },

  async listUnits(courseId) {
    const supabase = getSupabase();
    if (!supabase) return localContentSource.listUnits(courseId);

    const { data, error } = await supabase
      .from('units')
      .select('*')
      .eq('course_id', courseId)
      .order('order_index');
    if (error || !data?.length) return localContentSource.listUnits(courseId);
    return data.map(toUnit);
  },

  async listLessons(unitId) {
    const supabase = getSupabase();
    if (!supabase) return localContentSource.listLessons(unitId);

    const { data, error } = await supabase
      .from('lessons')
      .select('*')
      .eq('unit_id', unitId)
      .order('order_index');
    if (error || !data?.length) return localContentSource.listLessons(unitId);
    return data.map(toLesson);
  },

  async getLesson(lessonId) {
    const supabase = getSupabase();
    if (!supabase) return localContentSource.getLesson(lessonId);

    const { data, error } = await supabase.from('lessons').select('*').eq('id', lessonId).maybeSingle();
    if (error || !data) return localContentSource.getLesson(lessonId);
    return toLesson(data);
  },

  async getLessonContent(lessonId) {
    const supabase = getSupabase();
    if (!supabase) return localContentSource.getLessonContent(lessonId);

    const { data, error } = await supabase
      .from('lesson_content')
      .select('*')
      .eq('lesson_id', lessonId)
      .order('order_index');
    if (error || !data?.length) return localContentSource.getLessonContent(lessonId);
    return data.map(toLessonContent);
  },

  async getLessonQuizzes(lessonId) {
    const supabase = getSupabase();
    if (!supabase) return localContentSource.getLessonQuizzes(lessonId);

    const { data, error } = await supabase.from('quizzes').select('*').eq('lesson_id', lessonId);
    if (error || !data?.length) return localContentSource.getLessonQuizzes(lessonId);
    return data.map(toQuiz);
  },

  async listVocabulary(options) {
    const supabase = getSupabase();
    if (!supabase) return localContentSource.listVocabulary(options);

    let query = supabase.from('vocabulary').select('*');
    if (options?.category) query = query.eq('category', options.category);
    if (options?.level) query = query.lte('level', options.level);
    if (options?.ids) query = query.in('id', options.ids);
    if (options?.limit) query = query.limit(options.limit);

    const { data, error } = await query;
    if (error || !data?.length) return localContentSource.listVocabulary(options);
    return data.map(toVocabulary);
  },

  async getVocabularyById(ids) {
    if (ids.length === 0) return [];
    const supabase = getSupabase();
    if (!supabase) return localContentSource.getVocabularyById(ids);

    const { data, error } = await supabase.from('vocabulary').select('*').in('id', ids);
    if (error || !data?.length) return localContentSource.getVocabularyById(ids);
    return data.map(toVocabulary);
  },

  async listDailyPhrases() {
    const supabase = getSupabase();
    if (!supabase) return localContentSource.listDailyPhrases();

    const { data, error } = await supabase
      .from('daily_phrases')
      .select('*')
      .order('publish_date', { ascending: false });
    if (error || !data?.length) return localContentSource.listDailyPhrases();
    return data.map(toDailyPhrase);
  },

  async getTodaysPhrase() {
    const phrases = await this.listDailyPhrases();
    if (phrases.length === 0) return localContentSource.getTodaysPhrase();
    const daysSinceEpoch = Math.floor(Date.now() / 86_400_000);
    return phrases[Math.abs(daysSinceEpoch) % phrases.length];
  },

  // Culture articles ship with the app; they are editorial, not user data.
  listCultureArticles: localContentSource.listCultureArticles,
  getCultureArticle: localContentSource.getCultureArticle,

  async listAllLessons() {
    const supabase = getSupabase();
    if (!supabase) return localContentSource.listAllLessons();

    const { data, error } = await supabase.from('lessons').select('*').order('order_index');
    if (error || !data?.length) return localContentSource.listAllLessons();
    return data.map(toLesson);
  },

  async listAllUnits() {
    const supabase = getSupabase();
    if (!supabase) return localContentSource.listAllUnits();

    const { data, error } = await supabase.from('units').select('*').order('order_index');
    if (error || !data?.length) return localContentSource.listAllUnits();
    return data.map(toUnit);
  },
};
