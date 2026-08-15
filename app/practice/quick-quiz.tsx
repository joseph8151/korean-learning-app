import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { AnswerFeedback } from '@/features/quiz/AnswerFeedback';
import { QuizQuestionView } from '@/features/quiz/QuizQuestionView';
import {
  AppButton,
  AppText,
  Card,
  EmptyState,
  ErrorState,
  LoadingState,
  ProgressBar,
  Screen,
} from '@/components/ui';
import { QUIZZES } from '@/constants/content';
import { colors, spacing } from '@/constants/theme';
import { useAsyncData } from '@/hooks/useAsyncData';
import { isAnswerCorrect, scoreQuiz, type QuizAnswer } from '@/lib/scoring';
import type { Quiz } from '@/types/content';

const QUESTION_COUNT = 10;

export default function QuickQuizScreen() {
  const router = useRouter();
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [answered, setAnswered] = useState(false);
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);
  const [finished, setFinished] = useState(false);

  const loader = useCallback(async (): Promise<Quiz[]> => {
    const pool = [...QUIZZES];
    const picked: Quiz[] = [];
    while (picked.length < Math.min(QUESTION_COUNT, pool.length)) {
      const position = Math.floor(Math.random() * pool.length);
      picked.push(pool.splice(position, 1)[0]);
    }
    return picked;
  }, []);

  const { data, loading, error, reload } = useAsyncData(loader);

  if (loading) {
    return (
      <Screen scroll={false}>
        <LoadingState label="Picking your questions…" />
      </Screen>
    );
  }

  if (error || !data) {
    return (
      <Screen scroll={false}>
        <ErrorState onRetry={reload} />
      </Screen>
    );
  }

  if (data.length === 0) {
    return (
      <Screen scroll={false}>
        <EmptyState title="No questions yet" message="Complete a lesson to unlock quiz questions." />
      </Screen>
    );
  }

  if (finished) {
    const result = scoreQuiz(answers);
    return (
      <Screen
        scroll={false}
        footer={
          <View style={styles.footer}>
            <AppButton label="Try Another" size="lg" onPress={() => {
              setAnswers([]);
              setIndex(0);
              setSelected(null);
              setAnswered(false);
              setFinished(false);
              reload();
            }} />
            <AppButton label="Done" variant="outline" onPress={() => router.back()} />
          </View>
        }
      >
        <View style={styles.result}>
          <AppText style={styles.emoji}>{result.isPerfect ? '🏆' : '👏'}</AppText>
          <AppText variant="title" center>
            {result.correct} / {result.total}
          </AppText>
          <AppText variant="body" color={colors.textMuted} center>
            {result.isPerfect ? 'Perfect round. 완벽해요!' : `${result.percentage}% correct — keep going.`}
          </AppText>
        </View>
      </Screen>
    );
  }

  const quiz = data[index];
  const isLast = index === data.length - 1;

  const handleSelect = (answer: string) => {
    if (answered) return;
    const correct = isAnswerCorrect(quiz, answer);
    setSelected(answer);
    setAnswered(true);
    setAnswers((previous) => [...previous, { quizId: quiz.id, answer, isCorrect: correct }]);
    Haptics.selectionAsync().catch(() => undefined);
  };

  const handleNext = () => {
    if (isLast) {
      setFinished(true);
      return;
    }
    setIndex(index + 1);
    setSelected(null);
    setAnswered(false);
  };

  return (
    <Screen
      footer={
        <View style={styles.footer}>
          {answered ? (
            <AnswerFeedback
              isCorrect={answers[answers.length - 1]?.isCorrect ?? false}
              correctAnswer={quiz.correctAnswer}
              seed={index}
            />
          ) : null}
          <AppButton
            label={isLast ? 'See Results' : 'Continue'}
            size="lg"
            disabled={!answered}
            onPress={handleNext}
          />
        </View>
      }
    >
      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel="Close quiz"
          hitSlop={12}
          style={styles.back}
        >
          <Ionicons name="close" size={22} color={colors.textMuted} />
        </Pressable>
        <View style={styles.progress}>
          <ProgressBar
            ratio={(index + 1) / data.length}
            accessibilityLabel={`Question ${index + 1} of ${data.length}`}
          />
        </View>
        <AppText variant="micro" color={colors.textMuted}>
          {index + 1}/{data.length}
        </AppText>
      </View>

      <Card style={styles.scoreCard}>
        <AppText variant="micro" color={colors.textMuted}>
          CORRECT SO FAR
        </AppText>
        <AppText variant="subheading">
          {answers.filter((answer) => answer.isCorrect).length}
        </AppText>
      </Card>

      <View style={styles.body}>
        <QuizQuestionView
          quiz={quiz}
          answered={answered}
          selectedAnswer={selected}
          onSelect={handleSelect}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', gap: spacing.lg, paddingTop: spacing.lg },
  back: { width: 32, height: 32, alignItems: 'center', justifyContent: 'center' },
  progress: { flex: 1 },
  scoreCard: { marginTop: spacing.lg, paddingVertical: spacing.md, gap: 2 },
  body: { paddingTop: spacing.xl },
  footer: { gap: spacing.lg },
  result: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.sm },
  emoji: { fontSize: 72, lineHeight: 84 },
});
