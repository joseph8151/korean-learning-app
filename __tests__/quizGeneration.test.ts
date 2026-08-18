import { QUIZZES } from '@/constants/content';
import { LESSON_SPECS } from '@/constants/content/lessonContent';
import {
  buildQuizPools,
  generateMissingQuizzes,
  generateQuizzesForLesson,
} from '@/constants/content/quizGeneration';
import type { LessonSpec } from '@/constants/content/lessonContent';

const spec = (lessonId: string): LessonSpec => ({
  lessonId,
  intro: { heading: 'Test', body: 'Body' },
  vocabularyIds: [],
  expressions: [
    { korean: '커피 주세요.', english: 'Coffee, please.', romanization: 'keopi juseyo.' },
    { korean: '얼마예요?', english: 'How much is it?', romanization: 'eolmayeyo?' },
    { korean: '카드로 할게요.', english: "I'll pay by card.", romanization: 'kadeuro halgeyo.' },
    { korean: '봉투 주세요.', english: 'A bag, please.', romanization: 'bongtu juseyo.' },
  ],
  listening: [
    { korean: '주문하시겠어요?', english: 'Would you like to order?', romanization: 'jumunhasigesseoyo?' },
  ],
  speaking: [],
  summary: ['A summary line.'],
});

const POOLS = buildQuizPools([
  spec('a'),
  {
    ...spec('b'),
    expressions: [
      { korean: '물 좀 주세요.', english: 'Some water, please.', romanization: 'mul jom juseyo.' },
      { korean: '여기서 먹을게요.', english: "I'll eat in.", romanization: 'yeogiseo meogeulgeyo.' },
      { korean: '포장해 주세요.', english: 'To go, please.', romanization: 'pojanghae juseyo.' },
      { korean: '영수증 주세요.', english: 'The receipt, please.', romanization: 'yeongsujeung juseyo.' },
    ],
  },
]);

describe('generateQuizzesForLesson', () => {
  const generated = generateQuizzesForLesson(spec('lesson-test'), POOLS);

  it('always includes the correct answer among the options', () => {
    const broken = generated.filter(
      (quiz) =>
        quiz.questionType !== 'sentence_ordering' && !quiz.options.includes(quiz.correctAnswer),
    );
    expect(broken).toEqual([]);
  });

  it('never repeats an option within a question', () => {
    const dupes = generated.filter((quiz) => new Set(quiz.options).size !== quiz.options.length);
    expect(dupes).toEqual([]);
  });

  it('offers four choices on multiple choice', () => {
    const choices = generated.filter((quiz) => quiz.questionType.startsWith('multiple_choice'));
    expect(choices.length).toBeGreaterThan(0);
    for (const quiz of choices) expect(quiz.options).toHaveLength(4);
  });

  it('strips sentence punctuation the learner would have to type', () => {
    const ordering = generated.find((quiz) => quiz.questionType === 'sentence_ordering');
    expect(ordering?.correctAnswer).not.toMatch(/[.?!]$/);
    expect(ordering?.options.join(' ')).toBe(ordering?.correctAnswer);
  });

  it('is deterministic — the same lesson produces the same quiz every time', () => {
    // A question that reshuffles between runs cannot be reviewed or reported.
    const again = generateQuizzesForLesson(spec('lesson-test'), POOLS);
    expect(again).toEqual(generated);
  });

  it('does not put the answer in the same slot every time', () => {
    const positions = new Set(
      generated
        .filter((quiz) => quiz.questionType.startsWith('multiple_choice'))
        .map((quiz) => quiz.options.indexOf(quiz.correctAnswer)),
    );
    expect(positions.size).toBeGreaterThan(1);
  });

  it('skips a question rather than shipping one with too few distractors', () => {
    const thin = buildQuizPools([spec('only')]);
    const output = generateQuizzesForLesson(spec('only'), thin);
    const broken = output.filter(
      (quiz) => quiz.questionType.startsWith('multiple_choice') && quiz.options.length !== 4,
    );
    expect(broken).toEqual([]);
  });
});

describe('generateMissingQuizzes', () => {
  it('leaves hand-written lessons alone', () => {
    const handWritten = [
      {
        id: 'q-manual',
        lessonId: 'lesson-test',
        questionType: 'true_false' as const,
        question: 'Manual question.',
        prompt: null,
        correctAnswer: 'True',
        options: ['True', 'False'],
        metadata: null,
      },
    ];

    const generated = generateMissingQuizzes([spec('lesson-test')], handWritten);
    expect(generated).toEqual([]);
  });
});

describe('the shipped quiz set', () => {
  it('covers every lesson that has content', () => {
    const withQuizzes = new Set(QUIZZES.map((quiz) => quiz.lessonId));
    const uncovered = LESSON_SPECS.filter((lesson) => !withQuizzes.has(lesson.lessonId));
    expect(uncovered.map((lesson) => lesson.lessonId)).toEqual([]);
  });

  it('has no duplicate quiz ids after merging generated with hand-written', () => {
    const ids = QUIZZES.map((quiz) => quiz.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
