import type {
  Course,
  CultureArticle,
  DailyPhrase,
  Lesson,
  LessonContent,
  Quiz,
  Unit,
  Vocabulary,
} from '@/types/content';

export interface VocabularyQuery {
  category?: string;
  level?: number;
  ids?: string[];
  limit?: number;
}

/**
 * The single boundary every screen goes through to read learning content.
 * Screens never call Supabase directly, which keeps caching and offline
 * support in one place.
 */
export interface ContentSource {
  listCourses(): Promise<Course[]>;
  listUnits(courseId: string): Promise<Unit[]>;
  listLessons(unitId: string): Promise<Lesson[]>;
  getLesson(lessonId: string): Promise<Lesson | null>;
  getLessonContent(lessonId: string): Promise<LessonContent[]>;
  getLessonQuizzes(lessonId: string): Promise<Quiz[]>;
  listVocabulary(options?: VocabularyQuery): Promise<Vocabulary[]>;
  getVocabularyById(ids: string[]): Promise<Vocabulary[]>;
  listDailyPhrases(): Promise<DailyPhrase[]>;
  getTodaysPhrase(): Promise<DailyPhrase>;
  listCultureArticles(): Promise<CultureArticle[]>;
  getCultureArticle(id: string): Promise<CultureArticle | null>;
  listAllLessons(): Promise<Lesson[]>;
  listAllUnits(): Promise<Unit[]>;
}
