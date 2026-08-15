import { PLACEMENT_QUESTIONS } from '@/constants/content';
import {
  isAnswerCorrect,
  levelFromRatio,
  scorePlacementTest,
  scoreQuiz,
  type PlacementAnswer,
  type QuizAnswer,
} from '@/lib/scoring';
import type { Quiz } from '@/types/content';

const quiz: Quiz = {
  id: 'q1',
  lessonId: 'l1',
  questionType: 'multiple_choice_ko_en',
  question: 'What does 안녕하세요 mean?',
  prompt: '안녕하세요',
  correctAnswer: 'Hello',
  options: ['Hello', 'Thank you', 'Goodbye', 'Sorry'],
  metadata: null,
};

describe('quiz scoring', () => {
  it('matches answers ignoring case and surrounding whitespace', () => {
    expect(isAnswerCorrect(quiz, 'Hello')).toBe(true);
    expect(isAnswerCorrect(quiz, '  hello ')).toBe(true);
    expect(isAnswerCorrect(quiz, 'Goodbye')).toBe(false);
  });

  it('collapses repeated whitespace so sentence ordering answers match', () => {
    const ordering: Quiz = { ...quiz, correctAnswer: '아메리카노 한 잔 주세요' };
    expect(isAnswerCorrect(ordering, '아메리카노  한 잔   주세요')).toBe(true);
  });

  it('scores a mixed set of answers', () => {
    const answers: QuizAnswer[] = [
      { quizId: 'a', answer: 'x', isCorrect: true },
      { quizId: 'b', answer: 'y', isCorrect: false },
      { quizId: 'c', answer: 'z', isCorrect: true },
      { quizId: 'd', answer: 'w', isCorrect: true },
    ];

    const result = scoreQuiz(answers);
    expect(result.correct).toBe(3);
    expect(result.total).toBe(4);
    expect(result.percentage).toBe(75);
    expect(result.isPerfect).toBe(false);
    expect(result.wrongQuizIds).toEqual(['b']);
  });

  it('reports a perfect round', () => {
    const result = scoreQuiz([
      { quizId: 'a', answer: 'x', isCorrect: true },
      { quizId: 'b', answer: 'y', isCorrect: true },
    ]);
    expect(result.isPerfect).toBe(true);
    expect(result.percentage).toBe(100);
  });

  it('handles an empty answer set without dividing by zero', () => {
    const result = scoreQuiz([]);
    expect(result).toEqual({
      correct: 0,
      total: 0,
      percentage: 0,
      isPerfect: false,
      wrongQuizIds: [],
    });
  });
});

describe('placement test scoring', () => {
  const answerAll = (predicate: (level: number) => boolean): PlacementAnswer[] =>
    PLACEMENT_QUESTIONS.map((question) => ({
      questionId: question.id,
      answer: predicate(question.level) ? question.correctAnswer : '__wrong__',
    }));

  it('places a complete beginner at level 1', () => {
    const result = scorePlacementTest(PLACEMENT_QUESTIONS, answerAll(() => false));
    expect(result.level).toBe(1);
    expect(result.correct).toBe(0);
    expect(result.percentage).toBe(0);
  });

  it('places a perfect score at level 5', () => {
    const result = scorePlacementTest(PLACEMENT_QUESTIONS, answerAll(() => true));
    expect(result.level).toBe(5);
    expect(result.correct).toBe(PLACEMENT_QUESTIONS.length);
    expect(result.percentage).toBe(100);
  });

  it('weights harder questions more than easy ones', () => {
    const easyOnly = scorePlacementTest(PLACEMENT_QUESTIONS, answerAll((level) => level <= 2));
    const hardOnly = scorePlacementTest(PLACEMENT_QUESTIONS, answerAll((level) => level >= 4));
    expect(hardOnly.level).toBeGreaterThan(easyOnly.level);
  });

  it('ignores answers for questions that are not in the test', () => {
    const result = scorePlacementTest(PLACEMENT_QUESTIONS, [
      { questionId: 'does-not-exist', answer: 'Hello' },
    ]);
    expect(result.correct).toBe(0);
    expect(result.level).toBe(1);
  });

  it('maps score ratios onto levels', () => {
    expect(levelFromRatio(0)).toBe(1);
    expect(levelFromRatio(0.3)).toBe(2);
    expect(levelFromRatio(0.5)).toBe(3);
    expect(levelFromRatio(0.7)).toBe(4);
    expect(levelFromRatio(1)).toBe(5);
  });
});
