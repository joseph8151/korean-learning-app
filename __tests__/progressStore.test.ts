import { XP_RULES } from '@/constants/app';
import {
  selectCompletedLessonCount,
  selectTodaySeconds,
  selectWordsLearned,
  useProgressStore,
} from '@/store/useProgressStore';

const completeInput = (overrides: Partial<Parameters<
  ReturnType<typeof useProgressStore.getState>['completeLesson']
>[0]> = {}) => ({
  lessonId: 'lesson-greetings-hello',
  score: 4,
  totalQuestions: 4,
  studySeconds: 300,
  dailyGoalMinutes: 10,
  ...overrides,
});

beforeEach(() => {
  useProgressStore.getState().resetAll();
});

describe('progress store — completing a lesson', () => {
  it('records the lesson, XP and streak in one call', () => {
    const outcome = useProgressStore.getState().completeLesson(completeInput());
    const state = useProgressStore.getState();

    expect(state.lessons['lesson-greetings-hello'].status).toBe('completed');
    expect(state.lessons['lesson-greetings-hello'].score).toBe(4);
    expect(selectCompletedLessonCount(state)).toBe(1);
    expect(state.streak.currentStreak).toBe(1);
    expect(outcome.isPerfect).toBe(true);
    expect(state.totalXp).toBe(outcome.xpEarned);
  });

  it('awards the perfect-quiz bonus only for a full score', () => {
    const perfect = useProgressStore.getState().completeLesson(completeInput());
    useProgressStore.getState().resetAll();
    const partial = useProgressStore
      .getState()
      .completeLesson(completeInput({ score: 2, totalQuestions: 4 }));

    expect(perfect.xpEarned - partial.xpEarned).toBe(XP_RULES.perfectQuizBonus);
    expect(partial.isPerfect).toBe(false);
  });

  it('awards the daily-goal bonus once, on the session that crosses the goal', () => {
    const first = useProgressStore
      .getState()
      .completeLesson(completeInput({ studySeconds: 300, dailyGoalMinutes: 10 }));
    const second = useProgressStore
      .getState()
      .completeLesson(completeInput({ lessonId: 'lesson-greetings-yesno', studySeconds: 400 }));
    const third = useProgressStore
      .getState()
      .completeLesson(completeInput({ lessonId: 'lesson-greetings-thanks', studySeconds: 400 }));

    const labels = (outcome: typeof first) => outcome.xpItems.map((item) => item.label);
    expect(labels(first)).not.toContain('Daily goal');
    expect(labels(second)).toContain('Daily goal');
    expect(labels(third)).not.toContain('Daily goal');
  });

  it('accumulates study time for today', () => {
    useProgressStore.getState().completeLesson(completeInput({ studySeconds: 120 }));
    useProgressStore
      .getState()
      .completeLesson(completeInput({ lessonId: 'lesson-greetings-yesno', studySeconds: 180 }));

    expect(selectTodaySeconds(useProgressStore.getState())).toBe(300);
  });

  it('does not double-count a lesson finished twice', () => {
    useProgressStore.getState().completeLesson(completeInput());
    useProgressStore.getState().completeLesson(completeInput());

    expect(selectCompletedLessonCount(useProgressStore.getState())).toBe(1);
  });

  it('unlocks First Lesson once and never again', () => {
    const first = useProgressStore.getState().completeLesson(completeInput());
    const second = useProgressStore
      .getState()
      .completeLesson(completeInput({ lessonId: 'lesson-greetings-yesno' }));

    expect(first.unlockedAchievements).toContain('first_lesson');
    expect(second.unlockedAchievements).not.toContain('first_lesson');
    expect(
      useProgressStore.getState().achievements.filter((id) => id === 'first_lesson'),
    ).toHaveLength(1);
  });
});

describe('progress store — vocabulary', () => {
  it('tracks mistakes and clears them once the word is answered correctly', () => {
    const store = useProgressStore.getState();
    store.recordVocabularyReview('v-keopi', false);
    expect(useProgressStore.getState().mistakeVocabularyIds).toEqual(['v-keopi']);

    useProgressStore.getState().recordVocabularyReview('v-keopi', true);
    expect(useProgressStore.getState().mistakeVocabularyIds).toEqual([]);
  });

  it('counts a word as learned only after a correct review', () => {
    useProgressStore.getState().recordVocabularyReview('v-keopi', false);
    expect(selectWordsLearned(useProgressStore.getState())).toBe(0);

    useProgressStore.getState().recordVocabularyReview('v-keopi', true);
    expect(selectWordsLearned(useProgressStore.getState())).toBe(1);
  });

  it('toggles saved words without duplicating them', () => {
    const store = useProgressStore.getState();
    store.toggleSavedWord('v-mul');
    store.toggleSavedWord('v-mul');
    store.toggleSavedWord('v-mul');

    expect(useProgressStore.getState().savedWordIds).toEqual(['v-mul']);
    expect(useProgressStore.getState().isSaved('v-mul')).toBe(true);
  });
});

describe('progress store — conversations', () => {
  it('unlocks First Conversation exactly once', () => {
    useProgressStore.getState().recordConversationCompleted();
    useProgressStore.getState().recordConversationCompleted();

    const state = useProgressStore.getState();
    expect(state.conversationsCompleted).toBe(2);
    expect(state.achievements.filter((id) => id === 'first_conversation')).toHaveLength(1);
  });
});
