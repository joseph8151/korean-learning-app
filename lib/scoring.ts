import type { KoreanLevel, PlacementQuestion, Quiz } from '@/types/content';

export interface QuizAnswer {
  quizId: string;
  answer: string;
  isCorrect: boolean;
}

export interface QuizResult {
  correct: number;
  total: number;
  percentage: number;
  isPerfect: boolean;
  wrongQuizIds: string[];
}

export function normalizeAnswer(value: string): string {
  return value.trim().replace(/\s+/g, ' ').toLowerCase();
}

export function isAnswerCorrect(quiz: Quiz, answer: string): boolean {
  return normalizeAnswer(answer) === normalizeAnswer(quiz.correctAnswer);
}

export function scoreQuiz(answers: QuizAnswer[]): QuizResult {
  const total = answers.length;
  const correct = answers.filter((answer) => answer.isCorrect).length;
  const percentage = total === 0 ? 0 : Math.round((correct / total) * 100);
  return {
    correct,
    total,
    percentage,
    isPerfect: total > 0 && correct === total,
    wrongQuizIds: answers.filter((answer) => !answer.isCorrect).map((answer) => answer.quizId),
  };
}

export interface PlacementAnswer {
  questionId: string;
  answer: string;
}

export interface PlacementResult {
  level: KoreanLevel;
  correct: number;
  total: number;
  percentage: number;
}

/**
 * Weighted placement scoring: each correct answer contributes its own question
 * level, so getting hard questions right moves the learner up faster than
 * getting many easy ones right.
 */
export function scorePlacementTest(
  questions: PlacementQuestion[],
  answers: PlacementAnswer[],
): PlacementResult {
  const answerMap = new Map(answers.map((answer) => [answer.questionId, answer.answer]));

  let earnedWeight = 0;
  let correct = 0;

  for (const question of questions) {
    const given = answerMap.get(question.id);
    if (given !== undefined && normalizeAnswer(given) === normalizeAnswer(question.correctAnswer)) {
      correct += 1;
      earnedWeight += question.level;
    }
  }

  const totalWeight = questions.reduce((sum, question) => sum + question.level, 0);
  const ratio = totalWeight === 0 ? 0 : earnedWeight / totalWeight;

  return {
    level: levelFromRatio(ratio),
    correct,
    total: questions.length,
    percentage: questions.length === 0 ? 0 : Math.round((correct / questions.length) * 100),
  };
}

export function levelFromRatio(ratio: number): KoreanLevel {
  if (ratio >= 0.85) return 5;
  if (ratio >= 0.65) return 4;
  if (ratio >= 0.45) return 3;
  if (ratio >= 0.25) return 2;
  return 1;
}
