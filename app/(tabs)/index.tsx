import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useCallback } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { DailyKoreanCard } from '@/features/home/DailyKoreanCard';
import {
  AppButton,
  AppText,
  Card,
  ErrorState,
  LoadingState,
  ProgressBar,
  Screen,
  StreakBadge,
} from '@/components/ui';
import { colors, radius, spacing } from '@/constants/theme';
import { useAsyncData } from '@/hooks/useAsyncData';
import { usePremiumGate } from '@/hooks/usePremium';
import { greetingForHour } from '@/lib/date';
import { findNextLesson, goalProgressRatio } from '@/lib/progress';
import { visibleStreak } from '@/lib/streak';
import { contentService } from '@/services/content';
import { selectTodaySeconds, useProgressStore } from '@/store/useProgressStore';
import { useUserStore } from '@/store/useUserStore';
import type { Lesson, Unit } from '@/types/content';

interface HomeData {
  units: Unit[];
  lessonsByUnit: Record<string, Lesson[]>;
  phrase: Awaited<ReturnType<typeof contentService.getTodaysPhrase>>;
}

export default function HomeScreen() {
  const router = useRouter();
  const { guard } = usePremiumGate();

  const displayName = useUserStore((state) => state.displayName);
  const dailyGoalMinutes = useUserStore((state) => state.dailyGoalMinutes);

  const lessons = useProgressStore((state) => state.lessons);
  const streak = useProgressStore((state) => state.streak);
  const savedPhraseIds = useProgressStore((state) => state.savedPhraseIds);
  const toggleSavedPhrase = useProgressStore((state) => state.toggleSavedPhrase);
  const todaySeconds = useProgressStore(selectTodaySeconds);

  const loader = useCallback(async (): Promise<HomeData> => {
    const [units, allLessons, phrase] = await Promise.all([
      contentService.listAllUnits(),
      contentService.listAllLessons(),
      contentService.getTodaysPhrase(),
    ]);

    const lessonsByUnit = allLessons.reduce<Record<string, Lesson[]>>((accumulator, lesson) => {
      (accumulator[lesson.unitId] ??= []).push(lesson);
      return accumulator;
    }, {});

    return { units, lessonsByUnit, phrase };
  }, []);

  const { data, loading, error, reload } = useAsyncData(loader);

  if (loading) {
    return (
      <Screen scroll={false}>
        <LoadingState label="Getting your Korean ready…" />
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

  const next = findNextLesson(data.units, data.lessonsByUnit, lessons);
  const todayMinutes = Math.floor(todaySeconds / 60);
  const goalRatio = goalProgressRatio(todayMinutes, dailyGoalMinutes);
  const days = visibleStreak(streak);

  const openLesson = (lesson: Lesson) =>
    guard(lesson.isPremium, () => router.push(`/lesson/${lesson.id}`));

  return (
    <Screen>
      <View style={styles.header}>
        <View style={styles.headerText}>
          <AppText variant="heading">
            {greetingForHour(new Date().getHours())}, {displayName} 👋
          </AppText>
          <AppText variant="caption" color={colors.textMuted}>
            Ready for your Korean today?
          </AppText>
        </View>

        <Pressable
          onPress={() => router.push('/search')}
          accessibilityRole="button"
          accessibilityLabel="Search lessons, words and phrases"
          style={styles.iconButton}
          hitSlop={8}
        >
          <Ionicons name="search" size={22} color={colors.text} />
        </Pressable>
      </View>

      <Card style={styles.goalCard}>
        <View style={styles.goalHeader}>
          <View>
            <AppText variant="micro" color={colors.textMuted}>
              DAILY GOAL
            </AppText>
            <AppText variant="heading">
              {todayMinutes} / {dailyGoalMinutes} min
            </AppText>
          </View>
          <StreakBadge days={days} />
        </View>

        <ProgressBar
          ratio={goalRatio}
          accessibilityLabel={`Daily goal ${todayMinutes} of ${dailyGoalMinutes} minutes`}
        />

        <AppText variant="caption" color={colors.textMuted} style={styles.goalHint}>
          {goalRatio >= 1
            ? "Goal complete. Anything else today is a bonus. 🎉"
            : `${Math.max(dailyGoalMinutes - todayMinutes, 0)} minutes to go.`}
        </AppText>
      </Card>

      {next ? (
        <Card style={styles.lessonCard}>
          <AppText variant="micro" color="rgba(255,255,255,0.75)">
            TODAY&apos;S LESSON
          </AppText>
          <AppText variant="title" color={colors.white} style={styles.lessonTitle}>
            {next.lesson.title}
          </AppText>
          <AppText variant="caption" color="rgba(255,255,255,0.85)">
            {next.unit.title} · {next.lesson.estimatedMinutes} min
          </AppText>
          <AppButton
            label="Start Lesson"
            size="lg"
            variant="secondary"
            style={styles.lessonButton}
            onPress={() => openLesson(next.lesson)}
            accessibilityHint={`Opens ${next.lesson.title}`}
          />
        </Card>
      ) : null}

      <View style={styles.section}>
        <DailyKoreanCard
          phrase={data.phrase}
          saved={savedPhraseIds.includes(data.phrase.id)}
          onToggleSave={() => toggleSavedPhrase(data.phrase.id)}
        />
      </View>

      <View style={styles.quickRow}>
        <QuickAction
          emoji="🔤"
          label="Hangul"
          onPress={() => router.push('/hangul')}
        />
        <QuickAction
          emoji="🤖"
          label="AI Partner"
          onPress={() => router.push('/practice/ai-chat')}
        />
        <QuickAction
          emoji="🇰🇷"
          label="Culture"
          onPress={() => router.push('/culture')}
        />
      </View>

      {next ? (
        <Pressable
          onPress={() => openLesson(next.lesson)}
          accessibilityRole="button"
          accessibilityLabel={`Continue learning: ${next.unit.title}, ${next.lesson.title}`}
          style={styles.continue}
        >
          <View style={styles.continueText}>
            <AppText variant="micro" color={colors.textMuted}>
              CONTINUE LEARNING
            </AppText>
            <AppText variant="bodyStrong">
              {next.unit.title} · {next.lesson.title}
            </AppText>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.primary} />
        </Pressable>
      ) : null}
    </Screen>
  );
}

function QuickAction({
  emoji,
  label,
  onPress,
}: {
  emoji: string;
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={({ pressed }) => [styles.quickAction, pressed && styles.pressed]}
    >
      <AppText variant="heading">{emoji}</AppText>
      <AppText variant="micro" color={colors.textMuted}>
        {label}
      </AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: spacing.lg,
    gap: spacing.lg,
  },
  headerText: { flex: 1, gap: 2 },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  goalCard: { marginTop: spacing.xl },
  goalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  goalHint: { marginTop: spacing.md },
  lessonCard: { marginTop: spacing.lg, backgroundColor: colors.primary },
  lessonTitle: { marginTop: spacing.xs },
  lessonButton: { marginTop: spacing.xl },
  section: { marginTop: spacing.lg },
  quickRow: { flexDirection: 'row', gap: spacing.md, marginTop: spacing.lg },
  quickAction: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    paddingVertical: spacing.lg,
    alignItems: 'center',
    gap: spacing.xs,
    minHeight: 84,
    justifyContent: 'center',
  },
  pressed: { opacity: 0.85 },
  continue: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.primarySoft,
    borderRadius: radius.md,
    padding: spacing.lg,
    marginTop: spacing.lg,
    minHeight: 68,
  },
  continueText: { flex: 1, gap: 2 },
});
