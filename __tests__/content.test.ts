import {
  COURSES,
  DAILY_PHRASES,
  LESSONS,
  LESSON_CONTENT,
  PLACEMENT_QUESTIONS,
  QUIZZES,
  UNITS,
  VOCABULARY,
  getDailyPhrase,
} from '@/constants/content';
import { localContentSource } from '@/services/content';
import { searchEverything } from '@/services/search';

describe('bundled seed content', () => {
  it('meets the minimum content the app needs to never look empty', () => {
    expect(COURSES.length).toBeGreaterThanOrEqual(3);
    expect(UNITS.length).toBeGreaterThanOrEqual(6);
    expect(LESSONS.length).toBeGreaterThanOrEqual(15);
    expect(VOCABULARY.length).toBeGreaterThanOrEqual(50);
    expect(QUIZZES.length).toBeGreaterThanOrEqual(20);
    expect(DAILY_PHRASES.length).toBeGreaterThanOrEqual(15);
    expect(PLACEMENT_QUESTIONS.length).toBeGreaterThanOrEqual(10);
  });

  it('has unique ids across every content collection', () => {
    const collections = [COURSES, UNITS, LESSONS, VOCABULARY, QUIZZES, DAILY_PHRASES];
    for (const collection of collections) {
      const ids = collection.map((item) => item.id);
      expect(new Set(ids).size).toBe(ids.length);
    }
  });

  it('has no orphaned units, lessons or quizzes', () => {
    const courseIds = new Set(COURSES.map((course) => course.id));
    const unitIds = new Set(UNITS.map((unit) => unit.id));
    const lessonIds = new Set(LESSONS.map((lesson) => lesson.id));

    expect(UNITS.every((unit) => courseIds.has(unit.courseId))).toBe(true);
    expect(LESSONS.every((lesson) => unitIds.has(lesson.unitId))).toBe(true);
    expect(QUIZZES.every((quiz) => !quiz.lessonId || lessonIds.has(quiz.lessonId))).toBe(true);
    expect(LESSON_CONTENT.every((block) => lessonIds.has(block.lessonId))).toBe(true);
  });

  it('only references vocabulary ids that exist', () => {
    const vocabularyIds = new Set(VOCABULARY.map((word) => word.id));
    const referenced = LESSON_CONTENT.map(
      (block) => block.metadata?.vocabularyId as string | undefined,
    ).filter((id): id is string => Boolean(id));

    expect(referenced.length).toBeGreaterThan(0);
    expect(referenced.every((id) => vocabularyIds.has(id))).toBe(true);
  });

  it('always includes the correct answer among the quiz options', () => {
    const skipped = ['sentence_ordering'];
    const checkable = QUIZZES.filter((quiz) => !skipped.includes(quiz.questionType));
    expect(checkable.every((quiz) => quiz.options.includes(quiz.correctAnswer))).toBe(true);
  });

  it('gives the first free lesson real content so a guest can finish it', async () => {
    const blocks = await localContentSource.getLessonContent('lesson-greetings-hello');
    const quizzes = await localContentSource.getLessonQuizzes('lesson-greetings-hello');
    expect(blocks.length).toBeGreaterThan(3);
    expect(quizzes.length).toBeGreaterThan(0);
  });

  it('rotates the daily phrase by calendar day', () => {
    const first = getDailyPhrase(new Date('2026-03-01T09:00:00.000Z'));
    const second = getDailyPhrase(new Date('2026-03-02T09:00:00.000Z'));
    const sameDay = getDailyPhrase(new Date('2026-03-01T23:00:00.000Z'));
    expect(first.id).not.toBe(second.id);
    expect(sameDay.id).toBe(first.id);
  });
});

describe('search', () => {
  it('returns nothing for an empty query', () => {
    expect(searchEverything('   ')).toEqual([]);
  });

  it('finds words, lessons and phrases for "coffee"', () => {
    const results = searchEverything('coffee');
    const kinds = new Set(results.map((result) => result.kind));
    expect(results.length).toBeGreaterThan(0);
    expect(kinds.has('vocabulary')).toBe(true);
    expect(results.some((result) => result.title === '커피')).toBe(true);
  });

  it('matches Korean text as well as English', () => {
    const results = searchEverything('주세요');
    expect(results.length).toBeGreaterThan(0);
  });

  it('respects the result limit', () => {
    expect(searchEverything('a', 3).length).toBeLessThanOrEqual(3);
  });
});
