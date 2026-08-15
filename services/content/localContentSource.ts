import {
  COURSES,
  CULTURE_ARTICLES,
  DAILY_PHRASES,
  LESSONS,
  LESSON_CONTENT,
  QUIZZES,
  UNITS,
  VOCABULARY,
  getDailyPhrase,
} from '@/constants/content';
import type { ContentSource } from './types';

const byOrder = <T extends { orderIndex: number }>(a: T, b: T) => a.orderIndex - b.orderIndex;

/**
 * Bundled content. Always available, works offline, and guarantees the app is
 * never empty on first launch.
 */
export const localContentSource: ContentSource = {
  async listCourses() {
    return [...COURSES].sort(byOrder);
  },

  async listUnits(courseId) {
    return UNITS.filter((unit) => unit.courseId === courseId).sort(byOrder);
  },

  async listLessons(unitId) {
    return LESSONS.filter((lesson) => lesson.unitId === unitId).sort(byOrder);
  },

  async getLesson(lessonId) {
    return LESSONS.find((lesson) => lesson.id === lessonId) ?? null;
  },

  async getLessonContent(lessonId) {
    return LESSON_CONTENT.filter((block) => block.lessonId === lessonId).sort(byOrder);
  },

  async getLessonQuizzes(lessonId) {
    return QUIZZES.filter((quiz) => quiz.lessonId === lessonId);
  },

  async listVocabulary(options) {
    let items = [...VOCABULARY];
    if (options?.category) items = items.filter((item) => item.category === options.category);
    if (options?.level) items = items.filter((item) => item.level <= (options.level as number));
    if (options?.ids) {
      const wanted = new Set(options.ids);
      items = items.filter((item) => wanted.has(item.id));
    }
    return options?.limit ? items.slice(0, options.limit) : items;
  },

  async getVocabularyById(ids) {
    const wanted = new Set(ids);
    return VOCABULARY.filter((item) => wanted.has(item.id));
  },

  async listDailyPhrases() {
    return [...DAILY_PHRASES];
  },

  async getTodaysPhrase() {
    return getDailyPhrase();
  },

  async listCultureArticles() {
    return [...CULTURE_ARTICLES];
  },

  async getCultureArticle(id) {
    return CULTURE_ARTICLES.find((article) => article.id === id) ?? null;
  },

  async listAllLessons() {
    return [...LESSONS].sort(byOrder);
  },

  async listAllUnits() {
    return [...UNITS].sort(byOrder);
  },
};
