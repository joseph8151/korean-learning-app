import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppButton, AppText, Card, ProgressBar, QuizOption, Screen } from '@/components/ui';
import { PLACEMENT_QUESTIONS } from '@/constants/content';
import { colors, spacing } from '@/constants/theme';
import { scorePlacementTest, type PlacementAnswer } from '@/lib/scoring';
import { useUserStore } from '@/store/useUserStore';

export default function PlacementScreen() {
  const router = useRouter();
  const setLevel = useUserStore((state) => state.setLevel);

  const questions = useMemo(() => PLACEMENT_QUESTIONS, []);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [answers, setAnswers] = useState<PlacementAnswer[]>([]);

  const question = questions[index];
  const isLast = index === questions.length - 1;

  const handleNext = () => {
    if (!selected) return;

    const nextAnswers = [...answers, { questionId: question.id, answer: selected }];
    setAnswers(nextAnswers);
    setSelected(null);

    if (!isLast) {
      setIndex(index + 1);
      return;
    }

    const result = scorePlacementTest(questions, nextAnswers);
    setLevel(result.level, null);
    router.replace({
      pathname: '/(onboarding)/placement-result',
      params: {
        level: `${result.level}`,
        correct: `${result.correct}`,
        total: `${result.total}`,
      },
    });
  };

  return (
    <Screen
      footer={
        <AppButton
          label={isLast ? 'See My Level' : 'Next'}
          size="lg"
          disabled={!selected}
          onPress={handleNext}
        />
      }
    >
      <View style={styles.header}>
        <AppText variant="micro" color={colors.primaryDark}>
          QUESTION {index + 1} OF {questions.length}
        </AppText>
        <ProgressBar
          ratio={(index + 1) / questions.length}
          accessibilityLabel={`Question ${index + 1} of ${questions.length}`}
        />
      </View>

      <Card style={styles.card}>
        {question.prompt ? (
          <AppText variant="korean" center style={styles.prompt}>
            {question.prompt}
          </AppText>
        ) : null}
        <AppText variant="subheading" center>
          {question.question}
        </AppText>
      </Card>

      <View style={styles.options}>
        {question.options.map((option, optionIndex) => (
          <QuizOption
            key={option}
            index={optionIndex}
            label={option}
            state={selected === option ? 'selected' : 'idle'}
            onPress={() => setSelected(option)}
          />
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { paddingTop: spacing.xl, gap: spacing.md },
  card: { marginTop: spacing.xl, gap: spacing.md },
  prompt: { marginBottom: spacing.xs },
  options: { gap: spacing.md, paddingTop: spacing.xl },
});
