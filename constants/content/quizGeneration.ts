import type { Quiz } from '@/types/content';
import type { LessonSpec } from './lessonContent';

/**
 * Builds a lesson's quiz set from the lesson's own content.
 *
 * Hand-written quizzes are better than generated ones and take priority — see
 * `QUIZZES`. This exists because they do not scale: a course of ninety lessons
 * needs a few hundred questions, and hand-writing them all is how content
 * stops getting written at all. Deriving from the lesson guarantees the
 * question is about something the lesson actually taught, and that the right
 * answer is always among the options.
 *
 * Distractors come from *other* lessons, so they are plausible Korean rather
 * than obvious filler. They are picked deterministically from a rotating
 * offset rather than at random, so the same lesson always produces the same
 * quiz — a question that reshuffles between runs is impossible to review.
 */

/** Strips the sentence punctuation that would otherwise have to be typed. */
function bare(text: string): string {
  return text.replace(/[.?!]+$/u, '').trim();
}

/**
 * Picks `count` distractors that are not the answer. `seed` walks the pool so
 * different questions in a lesson do not all get the same wrong options.
 */
function distractors(pool: string[], answer: string, count: number, seed: number): string[] {
  const candidates = pool.filter((item) => item !== answer);
  const picked: string[] = [];

  for (let step = 0; step < candidates.length && picked.length < count; step += 1) {
    const candidate = candidates[(seed * 7 + step * 3) % candidates.length];
    if (!picked.includes(candidate)) picked.push(candidate);
  }

  return picked;
}

/** Rotates the answer's position so it is not always first. */
function shuffleWithAnswer(answer: string, wrong: string[], seed: number): string[] {
  const options = [answer, ...wrong];
  const offset = seed % options.length;
  return [...options.slice(offset), ...options.slice(0, offset)];
}

export interface QuizPools {
  /** Korean lines from across the course, for wrong Korean options. */
  korean: string[];
  /** English meanings from across the course, for wrong English options. */
  english: string[];
}

/** Collects distractor pools from every spec, so wrong answers are real Korean. */
export function buildQuizPools(specs: LessonSpec[]): QuizPools {
  const korean: string[] = [];
  const english: string[] = [];

  for (const spec of specs) {
    for (const line of spec.expressions) {
      korean.push(bare(line.korean));
      english.push(bare(line.english));
    }
  }

  return { korean: [...new Set(korean)], english: [...new Set(english)] };
}

export function generateQuizzesForLesson(spec: LessonSpec, pools: QuizPools): Quiz[] {
  const quizzes: Quiz[] = [];
  const { lessonId } = spec;
  // A stable per-lesson seed, so questions differ between lessons but never
  // between runs of the same lesson.
  const seed = [...lessonId].reduce((sum, character) => sum + character.charCodeAt(0), 0);

  const usable = spec.expressions.filter((line) => bare(line.korean) && bare(line.english));

  usable.slice(0, 2).forEach((line, index) => {
    const answer = bare(line.english);
    const wrong = distractors(pools.english, answer, 3, seed + index);
    if (wrong.length < 3) return;

    quizzes.push({
      id: `qg-${lessonId}-ko-${index}`,
      lessonId,
      questionType: 'multiple_choice_ko_en',
      question: `What does ${bare(line.korean)} mean?`,
      prompt: bare(line.korean),
      correctAnswer: answer,
      options: shuffleWithAnswer(answer, wrong, seed + index),
      metadata: null,
    });
  });

  usable.slice(2, 4).forEach((line, index) => {
    const answer = bare(line.korean);
    const wrong = distractors(pools.korean, answer, 3, seed + index + 11);
    if (wrong.length < 3) return;

    quizzes.push({
      id: `qg-${lessonId}-en-${index}`,
      lessonId,
      questionType: 'multiple_choice_en_ko',
      question: `How do you say "${bare(line.english)}"?`,
      prompt: null,
      correctAnswer: answer,
      options: shuffleWithAnswer(answer, wrong, seed + index + 3),
      metadata: null,
    });
  });

  const heard = spec.listening[0];
  if (heard) {
    const answer = bare(heard.english);
    const wrong = distractors(pools.english, answer, 3, seed + 23);
    if (wrong.length === 3) {
      quizzes.push({
        id: `qg-${lessonId}-listen`,
        lessonId,
        questionType: 'listening',
        question: 'What did you hear?',
        prompt: heard.korean,
        correctAnswer: answer,
        options: shuffleWithAnswer(answer, wrong, seed + 5),
        metadata: null,
      });
    }
  }

  // Sentence building, but only where the sentence is short enough to be a
  // puzzle rather than a slog. Two to four chunks is the sweet spot.
  const buildable = usable.find((line) => {
    const words = bare(line.korean).split(/\s+/u);
    return words.length >= 2 && words.length <= 4;
  });

  if (buildable) {
    const answer = bare(buildable.korean);
    quizzes.push({
      id: `qg-${lessonId}-order`,
      lessonId,
      questionType: 'sentence_ordering',
      question: 'Put the sentence in the right order.',
      prompt: bare(buildable.english),
      correctAnswer: answer,
      options: answer.split(/\s+/u),
      metadata: null,
    });
  }

  return quizzes;
}

/**
 * Quizzes for every lesson that has no hand-written ones. Hand-written always
 * wins: they can ask about nuance a generator cannot see.
 */
export function generateMissingQuizzes(specs: LessonSpec[], existing: Quiz[]): Quiz[] {
  const covered = new Set(existing.map((quiz) => quiz.lessonId).filter(Boolean));
  const pools = buildQuizPools(specs);

  return specs
    .filter((spec) => !covered.has(spec.lessonId))
    .flatMap((spec) => generateQuizzesForLesson(spec, pools));
}
