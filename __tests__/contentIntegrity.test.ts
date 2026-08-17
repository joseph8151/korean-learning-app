import {
  CHAT_SITUATIONS,
  COURSES,
  CULTURE_ARTICLES,
  DAILY_PHRASES,
  LESSONS,
  QUIZZES,
  UNITS,
  VOCABULARY,
  getDailyPhrase,
} from '@/constants/content';

/**
 * Guards for the bundled content. Hand-written data at this volume drifts:
 * a copy-pasted id, a Chinese character that looks like Hangul, a quiz whose
 * answer is not among its own options. None of that is a type error, and all
 * of it is visible to a learner.
 */

/** Hangul syllables and jamo, plus the punctuation Korean sentences use. */
const KOREAN_TEXT = /^[가-힣ㄱ-ㅎㅏ-ㅣ\s.,!?~%()'’…·:/0-9A-Za-z-]+$/;
/** CJK ideographs — visually close to Hangul in a list, wrong when spoken. */
const HAS_HANJA = /[㐀-䶿一-鿿]/;

const duplicates = (values: string[]): string[] => {
  const seen = new Set<string>();
  const repeated = new Set<string>();
  for (const value of values) {
    if (seen.has(value)) repeated.add(value);
    seen.add(value);
  }
  return [...repeated];
};

describe('ids are unique', () => {
  it.each([
    ['courses', COURSES],
    ['units', UNITS],
    ['lessons', LESSONS],
    ['vocabulary', VOCABULARY],
    ['quizzes', QUIZZES],
    ['daily phrases', DAILY_PHRASES],
    ['culture articles', CULTURE_ARTICLES],
    ['chat situations', CHAT_SITUATIONS],
  ])('%s', (_name, items: { id: string }[]) => {
    expect(duplicates(items.map((item) => item.id))).toEqual([]);
  });
});

describe('Korean text is actually Korean', () => {
  const koreanFields: [string, string][] = [
    ...VOCABULARY.flatMap((word): [string, string][] => [
      [`vocabulary ${word.id}.korean`, word.korean],
      ...(word.exampleKorean
        ? ([[`vocabulary ${word.id}.exampleKorean`, word.exampleKorean]] as [string, string][])
        : []),
    ]),
    ...DAILY_PHRASES.map((phrase): [string, string] => [`phrase ${phrase.id}`, phrase.korean]),
    ...CHAT_SITUATIONS.map((situation): [string, string] => [
      `situation ${situation.id}`,
      situation.openingLine.korean,
    ]),
  ];

  it('contains no Chinese characters', () => {
    const offenders = koreanFields.filter(([, value]) => HAS_HANJA.test(value));
    expect(offenders).toEqual([]);
  });

  it('contains only Hangul and ordinary punctuation', () => {
    const offenders = koreanFields.filter(([, value]) => !KOREAN_TEXT.test(value));
    expect(offenders).toEqual([]);
  });

  it('has no leading or trailing whitespace', () => {
    const offenders = koreanFields.filter(([, value]) => value !== value.trim());
    expect(offenders).toEqual([]);
  });
});

describe('vocabulary', () => {
  it('never lists the same Korean word twice', () => {
    expect(duplicates(VOCABULARY.map((word) => word.korean))).toEqual([]);
  });

  it('always has a romanization and an English meaning', () => {
    const incomplete = VOCABULARY.filter(
      (word) => !word.romanization.trim() || !word.english.trim(),
    );
    expect(incomplete.map((word) => word.id)).toEqual([]);
  });

  it('stays within the five level bands', () => {
    const outOfRange = VOCABULARY.filter((word) => word.level < 1 || word.level > 5);
    expect(outOfRange.map((word) => word.id)).toEqual([]);
  });
});

describe('quizzes', () => {
  it('always include the correct answer among the options', () => {
    const broken = QUIZZES.filter(
      (quiz) =>
        quiz.questionType !== 'sentence_ordering' && !quiz.options.includes(quiz.correctAnswer),
    );
    expect(broken.map((quiz) => quiz.id)).toEqual([]);
  });

  it('offer at least two distinct options to choose between', () => {
    const broken = QUIZZES.filter((quiz) => new Set(quiz.options).size < 2);
    expect(broken.map((quiz) => quiz.id)).toEqual([]);
  });

  it('reference a lesson that exists', () => {
    const lessonIds = new Set(LESSONS.map((lesson) => lesson.id));
    const orphans = QUIZZES.filter((quiz) => quiz.lessonId && !lessonIds.has(quiz.lessonId));
    expect(orphans.map((quiz) => quiz.id)).toEqual([]);
  });
});

describe('course structure', () => {
  it('has every unit attached to a real course', () => {
    const courseIds = new Set(COURSES.map((course) => course.id));
    const orphans = UNITS.filter((unit) => !courseIds.has(unit.courseId));
    expect(orphans.map((unit) => unit.id)).toEqual([]);
  });

  it('has every lesson attached to a real unit', () => {
    const unitIds = new Set(UNITS.map((unit) => unit.id));
    const orphans = LESSONS.filter((lesson) => !unitIds.has(lesson.unitId));
    expect(orphans.map((lesson) => lesson.id)).toEqual([]);
  });

  it('leaves no unit without lessons, which would render an empty screen', () => {
    const withLessons = new Set(LESSONS.map((lesson) => lesson.unitId));
    const empty = UNITS.filter((unit) => !withLessons.has(unit.id));
    expect(empty.map((unit) => unit.id)).toEqual([]);
  });

  it('gives free users something in every course they can open', () => {
    const freeCourses = COURSES.filter((course) => !course.isPremium);
    expect(freeCourses.length).toBeGreaterThan(0);

    for (const course of freeCourses) {
      const unitIds = UNITS.filter((unit) => unit.courseId === course.id).map((unit) => unit.id);
      const free = LESSONS.filter(
        (lesson) => unitIds.includes(lesson.unitId) && !lesson.isPremium,
      );
      expect(free.length).toBeGreaterThan(0);
    }
  });
});

describe('daily phrases', () => {
  it('carry enough content that the rotation does not repeat within a month', () => {
    expect(DAILY_PHRASES.length).toBeGreaterThanOrEqual(31);
  });

  it('rotate to a different phrase on consecutive days', () => {
    const first = getDailyPhrase(new Date(2026, 4, 1));
    const second = getDailyPhrase(new Date(2026, 4, 2));
    expect(first.id).not.toBe(second.id);
  });

  it('return the same phrase for any time on the same day', () => {
    const morning = getDailyPhrase(new Date(2026, 4, 1, 8, 0));
    const evening = getDailyPhrase(new Date(2026, 4, 1, 23, 30));
    expect(morning.id).toBe(evening.id);
  });

  it('never fall off the end of the list', () => {
    for (let offset = 0; offset < 400; offset += 1) {
      const day = new Date(2026, 0, 1);
      day.setDate(day.getDate() + offset);
      expect(getDailyPhrase(day)).toBeDefined();
    }
  });
});

describe('culture articles', () => {
  it('all have at least one section of body copy', () => {
    const empty = CULTURE_ARTICLES.filter((article) => article.sections.length === 0);
    expect(empty.map((article) => article.id)).toEqual([]);
  });

  it('include free articles, so the tab is not a wall of locks', () => {
    expect(CULTURE_ARTICLES.filter((article) => !article.isPremium).length).toBeGreaterThan(0);
  });
});
