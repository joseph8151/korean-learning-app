import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { LessonStepView } from '@/features/lesson/LessonStepView';
import { AnswerFeedback } from '@/features/quiz/AnswerFeedback';
import { QuizQuestionView } from '@/features/quiz/QuizQuestionView';
import {
  AppText,
  ChunkyButton,
  ErrorState,
  LoadingState,
  ProgressBar,
  Screen,
} from '@/components/ui';
import { colors, spacing } from '@/constants/theme';
import { useAsyncData } from '@/hooks/useAsyncData';
import { useStudyTimer } from '@/hooks/useStudyTimer';
import { isAnswerCorrect, scoreQuiz, type QuizAnswer } from '@/lib/scoring';
import { contentService } from '@/services/content';
import { syncService } from '@/services/sync';
import { useProgressStore } from '@/store/useProgressStore';
import { useUserStore } from '@/store/useUserStore';
import type { Lesson, LessonContent, Quiz, Vocabulary } from '@/types/content';

interface LessonData {
  lesson: Lesson | null;
  blocks: LessonContent[];
  quizzes: Quiz[];
  vocabularyById: Record<string, Vocabulary>;
}

export default function LessonScreen() {
  const router = useRouter();
  const { lessonId } = useLocalSearchParams<{ lessonId: string }>();
  const { elapsedSeconds } = useStudyTimer();

  const dailyGoalMinutes = useUserStore((state) => state.dailyGoalMinutes);
  const userId = useUserStore((state) => state.userId);
  const startLesson = useProgressStore((state) => state.startLesson);
  const getSyncableSnapshot = useProgressStore((state) => state.getSyncableSnapshot);
  const completeLesson = useProgressStore((state) => state.completeLesson);
  const recordVocabularyReview = useProgressStore((state) => state.recordVocabularyReview);

  const [stepIndex, setStepIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [answered, setAnswered] = useState(false);
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);

  const loader = useCallback(async (): Promise<LessonData> => {
    if (!lessonId) return { lesson: null, blocks: [], quizzes: [], vocabularyById: {} };

    const [lesson, blocks, quizzes] = await Promise.all([
      contentService.getLesson(lessonId),
      contentService.getLessonContent(lessonId),
      contentService.getLessonQuizzes(lessonId),
    ]);

    const vocabularyIds = blocks
      .map((block) => block.metadata?.vocabularyId as string | undefined)
      .filter((id): id is string => Boolean(id));

    const words = await contentService.getVocabularyById(vocabularyIds);
    const vocabularyById = Object.fromEntries(words.map((word) => [word.id, word]));

    startLesson(lessonId);
    return { lesson, blocks, quizzes, vocabularyById };
  }, [lessonId, startLesson]);

  const { data, loading, error, reload } = useAsyncData(loader);

  const steps = useMemo(() => {
    if (!data) return [] as { kind: 'content' | 'quiz'; index: number }[];
    return [
      ...data.blocks.map((_, index) => ({ kind: 'content' as const, index })),
      ...data.quizzes.map((_, index) => ({ kind: 'quiz' as const, index })),
    ];
  }, [data]);

  if (loading) {
    return (
      <Screen scroll={false}>
        <LoadingState label="Opening your lesson…" />
      </Screen>
    );
  }

  if (error || !data?.lesson || steps.length === 0) {
    return (
      <Screen scroll={false}>
        <ErrorState
          onRetry={reload}
          title="We couldn't open this lesson."
          message="Please check your connection and try again."
        />
      </Screen>
    );
  }

  const step = steps[stepIndex];
  const isLastStep = stepIndex === steps.length - 1;
  const currentQuiz = step.kind === 'quiz' ? data.quizzes[step.index] : null;

  const handleSelect = (answer: string) => {
    if (answered || !currentQuiz) return;

    const correct = isAnswerCorrect(currentQuiz, answer);
    setSelectedAnswer(answer);
    setAnswered(true);
    setAnswers((previous) => [
      ...previous,
      { quizId: currentQuiz.id, answer, isCorrect: correct },
    ]);

    Haptics.notificationAsync(
      correct ? Haptics.NotificationFeedbackType.Success : Haptics.NotificationFeedbackType.Warning,
    ).catch(() => undefined);

    const relatedVocabulary = Object.keys(data.vocabularyById);
    if (relatedVocabulary.length > 0) {
      const target = relatedVocabulary[step.index % relatedVocabulary.length];
      recordVocabularyReview(target, correct);
    }
  };

  const finishLesson = () => {
    const result = scoreQuiz(answers);
    const outcome = completeLesson({
      lessonId: data.lesson!.id,
      score: result.correct,
      totalQuestions: result.total,
      studySeconds: elapsedSeconds(),
      dailyGoalMinutes,
    });

    // Fire-and-forget: a failed upload is harmless because the next sign-in
    // merges this device's state anyway.
    if (userId) {
      void syncService.pushLatest(userId, getSyncableSnapshot());
    }

    router.replace({
      pathname: '/lesson/complete',
      params: {
        lessonId: data.lesson!.id,
        score: `${result.correct}`,
        total: `${result.total}`,
        xp: `${outcome.xpEarned}`,
        streak: `${outcome.streak}`,
        words: `${Object.keys(data.vocabularyById).length}`,
        achievements: outcome.unlockedAchievements.join(','),
      },
    });
  };

  const handleNext = () => {
    if (isLastStep) {
      finishLesson();
      return;
    }
    setStepIndex(stepIndex + 1);
    setSelectedAnswer(null);
    setAnswered(false);
  };

  const canAdvance = step.kind === 'content' || answered;

  return (
    <Screen
      footer={
        <View style={styles.footer}>
          {currentQuiz && answered ? (
            <AnswerFeedback
              isCorrect={answers[answers.length - 1]?.isCorrect ?? false}
              correctAnswer={currentQuiz.correctAnswer}
              seed={stepIndex}
            />
          ) : null}
          <ChunkyButton
            label={isLastStep ? 'Finish Lesson' : 'Continue'}
            tone={isLastStep ? 'success' : 'primary'}
            disabled={!canAdvance}
            onPress={handleNext}
          />
        </View>
      }
    >
      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel="Close lesson"
          hitSlop={12}
          style={styles.close}
        >
          <Ionicons name="close" size={22} color={colors.textMuted} />
        </Pressable>

        <View style={styles.progress}>
          <ProgressBar
            ratio={(stepIndex + 1) / steps.length}
            accessibilityLabel={`Step ${stepIndex + 1} of ${steps.length}`}
          />
        </View>

        <AppText variant="micro" color={colors.textMuted}>
          {stepIndex + 1}/{steps.length}
        </AppText>
      </View>

      <AppText variant="overline" color={colors.textSubtle} style={styles.lessonName}>
        {data.lesson.title.toUpperCase()}
      </AppText>

      <View style={styles.body}>
        {step.kind === 'content' ? (
          <LessonStepView
            block={data.blocks[step.index]}
            vocabulary={
              data.vocabularyById[
                (data.blocks[step.index].metadata?.vocabularyId as string | undefined) ?? ''
              ] ?? null
            }
          />
        ) : currentQuiz ? (
          <QuizQuestionView
            quiz={currentQuiz}
            answered={answered}
            selectedAnswer={selectedAnswer}
            onSelect={handleSelect}
          />
        ) : null}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
    paddingTop: spacing.lg,
  },
  close: { width: 32, height: 32, alignItems: 'center', justifyContent: 'center' },
  progress: { flex: 1 },
  lessonName: { marginTop: spacing.lg },
  body: { paddingTop: spacing.lg },
  footer: { gap: spacing.lg },
});
