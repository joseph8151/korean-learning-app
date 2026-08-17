import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText, AudioButton, Card, QuizOption, type QuizOptionState } from '@/components/ui';
import { colors, layout, radius, spacing } from '@/constants/theme';
import { isAnswerCorrect } from '@/lib/scoring';
import type { Quiz } from '@/types/content';

export interface QuizQuestionViewProps {
  quiz: Quiz;
  answered: boolean;
  selectedAnswer: string | null;
  onSelect: (answer: string) => void;
}

export function QuizQuestionView({
  quiz,
  answered,
  selectedAnswer,
  onSelect,
}: QuizQuestionViewProps) {
  if (quiz.questionType === 'sentence_ordering') {
    return (
      <SentenceOrdering
        quiz={quiz}
        answered={answered}
        selectedAnswer={selectedAnswer}
        onSelect={onSelect}
      />
    );
  }

  const matchTarget = (quiz.metadata?.matchTarget as string | undefined) ?? null;
  const showAudio = quiz.questionType === 'listening' && quiz.prompt;

  const optionState = (option: string): QuizOptionState => {
    if (!answered) return selectedAnswer === option ? 'selected' : 'idle';
    if (isAnswerCorrect(quiz, option)) return 'correct';
    if (selectedAnswer === option) return 'wrong';
    return 'idle';
  };

  return (
    <View style={styles.root}>
      <Card style={styles.prompt}>
        {showAudio ? (
          <View style={styles.audio}>
            <AudioButton text={quiz.prompt as string} label="Play" />
            <AudioButton text={quiz.prompt as string} label="Slow" slow />
          </View>
        ) : quiz.prompt ? (
          <AppText variant="korean" center>
            {quiz.prompt}
          </AppText>
        ) : null}

        <AppText variant="subheading" center style={styles.question}>
          {quiz.question}
        </AppText>

        {matchTarget ? (
          <View style={styles.matchTarget}>
            <AppText variant="bodyStrong" color={colors.primaryDark} center>
              {matchTarget}
            </AppText>
          </View>
        ) : null}
      </Card>

      <View style={styles.options}>
        {quiz.options.map((option, index) => (
          <QuizOption
            key={option}
            index={index}
            label={option}
            state={optionState(option)}
            disabled={answered}
            onPress={() => onSelect(option)}
          />
        ))}
      </View>
    </View>
  );
}

function SentenceOrdering({ quiz, answered, onSelect }: QuizQuestionViewProps) {
  const shuffled = useMemo(
    () => [...quiz.options].sort((a, b) => a.localeCompare(b)),
    [quiz.options],
  );
  // Reset the built sentence when the question changes, during render rather
  // than in an effect, so there is no flash of the previous answer.
  const [session, setSession] = useState<{ quizId: string; picked: string[] }>({
    quizId: quiz.id,
    picked: [],
  });

  if (session.quizId !== quiz.id) {
    setSession({ quizId: quiz.id, picked: [] });
  }

  const picked = session.quizId === quiz.id ? session.picked : [];
  const setPicked = (next: string[]) => setSession({ quizId: quiz.id, picked: next });

  const available = shuffled.filter((token) => !picked.includes(token));

  const handlePick = (token: string) => {
    if (answered) return;
    const next = [...picked, token];
    setPicked(next);
    if (next.length === shuffled.length) {
      onSelect(next.join(' '));
    }
  };

  const handleUndo = () => {
    if (answered) return;
    setPicked(picked.slice(0, -1));
  };

  return (
    <View style={styles.root}>
      <Card style={styles.prompt}>
        <AppText variant="subheading" center>
          {quiz.question}
        </AppText>
        {quiz.prompt ? (
          <AppText variant="body" color={colors.textMuted} center style={styles.question}>
            {quiz.prompt}
          </AppText>
        ) : null}
      </Card>

      <View style={styles.answerArea} accessibilityLabel="Your sentence so far">
        {picked.length === 0 ? (
          <AppText variant="caption" color={colors.textSubtle}>
            Tap the words in order
          </AppText>
        ) : (
          picked.map((token, index) => (
            <View key={`${token}-${index}`} style={styles.token}>
              <AppText variant="body">{token}</AppText>
            </View>
          ))
        )}
      </View>

      <View style={styles.tokenRow}>
        {available.map((token) => (
          <Pressable
            key={token}
            onPress={() => handlePick(token)}
            accessibilityRole="button"
            accessibilityLabel={`Add ${token}`}
            style={({ pressed }) => [styles.token, styles.tokenChoice, pressed && styles.pressed]}
          >
            <AppText variant="body">{token}</AppText>
          </Pressable>
        ))}
      </View>

      {picked.length > 0 && !answered ? (
        <Pressable onPress={handleUndo} accessibilityRole="button" accessibilityLabel="Undo last word">
          <AppText variant="caption" color={colors.primaryDark} center>
            Undo
          </AppText>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { gap: spacing.xl },
  prompt: { gap: spacing.sm },
  question: { marginTop: spacing.sm },
  audio: { flexDirection: 'row', gap: spacing.md, justifyContent: 'center' },
  matchTarget: {
    marginTop: spacing.lg,
    backgroundColor: colors.primarySoft,
    borderRadius: radius.md,
    padding: spacing.lg,
  },
  options: { gap: spacing.md },
  answerArea: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    minHeight: 64,
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.lg,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: colors.border,
  },
  tokenRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, justifyContent: 'center' },
  token: {
    backgroundColor: colors.primarySoft,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    minHeight: layout.minTouchTarget,
    justifyContent: 'center',
  },
  tokenChoice: { backgroundColor: colors.surface, borderWidth: 1.5, borderColor: colors.border },
  pressed: { opacity: 0.9, transform: [{ scale: 0.98 }] },
});
