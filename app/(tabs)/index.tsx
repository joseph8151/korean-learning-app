import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useCallback } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { SeoulSkyline } from '@/components/decor/SeoulSkyline';
import { DailyKoreanCard } from '@/features/home/DailyKoreanCard';
import {
  AppButton,
  AppText,
  Card,
  ErrorState,
  GradientCard,
  LoadingState,
  ProgressBar,
  Screen,
  StreakBadge,
} from '@/components/ui';
import { colors, onGradient, radius, spacing } from '@/constants/theme';
import { useAsyncData } from '@/hooks/useAsyncData';
import { useNow } from '@/hooks/useNow';
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

const QUICK_ACTIONS = [
  { emoji: '🔤', label: 'Hangul', tint: colors.primarySoft, href: '/hangul' },
  { emoji: '🤖', label: 'AI Partner', tint: colors.secondarySoft, href: '/practice/ai-chat' },
  { emoji: '🎧', label: 'Listening', tint: colors.accentSoft, href: '/practice/listening' },
  { emoji: '🍜', label: 'Culture', tint: colors.successSoft, href: '/culture' },
] as const;

export default function HomeScreen() {
  const router = useRouter();
  const { guard } = usePremiumGate();
  const now = useNow();

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
  const goalMet = goalRatio >= 1;
  const days = visibleStreak(streak);

  const openLesson = (lesson: Lesson) =>
    guard(lesson.isPremium, () => router.push(`/lesson/${lesson.id}`));

  return (
    <Screen>
      <View style={styles.header}>
        <View style={styles.headerText}>
          <AppText variant="overline" color={colors.textSubtle}>
            {greetingForHour(now.getHours()).toUpperCase()}
          </AppText>
          <AppText variant="title" numberOfLines={1}>
            {displayName} 👋
          </AppText>
        </View>

        <Pressable
          onPress={() => router.push('/search')}
          accessibilityRole="button"
          accessibilityLabel="Search lessons, words and phrases"
          style={({ pressed }) => [styles.iconButton, pressed && styles.pressed]}
          hitSlop={8}
        >
          <Ionicons name="search" size={21} color={colors.text} />
        </Pressable>
      </View>

      {next ? (
        <GradientCard
          style={styles.hero}
          contentStyle={styles.heroContent}
          decoration={<SeoulSkyline />}
          onPress={() => openLesson(next.lesson)}
          accessibilityLabel={`Today's lesson: ${next.lesson.title}, ${next.unit.title}, ${next.lesson.estimatedMinutes} minutes`}
          accessibilityHint="Opens the lesson"
        >
          <AppText variant="overline" color={onGradient.secondary}>
            TODAY&apos;S LESSON
          </AppText>
          <AppText variant="title" color={onGradient.primary} style={styles.heroTitle}>
            {next.lesson.title}
          </AppText>
          <AppText variant="caption" color={onGradient.secondary}>
            {next.unit.title} · {next.lesson.estimatedMinutes} min
          </AppText>

          <AppButton
            label="Start Lesson"
            size="lg"
            variant="onColor"
            style={styles.heroButton}
            onPress={() => openLesson(next.lesson)}
            accessibilityHint={`Opens ${next.lesson.title}`}
          />
        </GradientCard>
      ) : (
        <Card style={styles.hero}>
          <AppText variant="subheading">You have finished every lesson. 🎉</AppText>
          <AppText variant="caption" color={colors.textMuted} style={styles.heroTitle}>
            Keep it warm with a quick drill or a review session.
          </AppText>
          <AppButton
            label="Practise Now"
            style={styles.heroButton}
            onPress={() => router.push('/practice/quick-quiz')}
          />
        </Card>
      )}

      <Card style={styles.goalCard}>
        <View style={styles.goalHeader}>
          <View style={styles.goalHeaderText}>
            <AppText variant="overline" color={colors.textSubtle}>
              DAILY GOAL
            </AppText>
            <View style={styles.goalNumbers}>
              <AppText variant="title">{todayMinutes}</AppText>
              <AppText variant="caption" color={colors.textMuted} style={styles.goalUnit}>
                / {dailyGoalMinutes} min
              </AppText>
            </View>
          </View>
          <StreakBadge days={days} />
        </View>

        <ProgressBar
          ratio={goalRatio}
          color={goalMet ? colors.success : colors.primary}
          trackColor={goalMet ? colors.successSoft : colors.primarySoft}
          accessibilityLabel={`Daily goal ${todayMinutes} of ${dailyGoalMinutes} minutes`}
        />

        <View style={styles.goalHint}>
          <Ionicons
            name={goalMet ? 'checkmark-circle' : 'time-outline'}
            size={15}
            color={goalMet ? colors.successDeep : colors.textSubtle}
          />
          <AppText variant="caption" color={goalMet ? colors.successDeep : colors.textMuted}>
            {goalMet
              ? 'Goal complete. Anything else today is a bonus.'
              : `${Math.max(dailyGoalMinutes - todayMinutes, 0)} minutes to go.`}
          </AppText>
        </View>
      </Card>

      <View style={styles.quickRow}>
        {QUICK_ACTIONS.map((action) => (
          <QuickAction
            key={action.label}
            emoji={action.emoji}
            label={action.label}
            tint={action.tint}
            onPress={() => router.push(action.href)}
          />
        ))}
      </View>

      <View style={styles.section}>
        <DailyKoreanCard
          phrase={data.phrase}
          saved={savedPhraseIds.includes(data.phrase.id)}
          onToggleSave={() => toggleSavedPhrase(data.phrase.id)}
          onSeeAll={() => router.push('/daily')}
        />
      </View>
    </Screen>
  );
}

function QuickAction({
  emoji,
  label,
  tint,
  onPress,
}: {
  emoji: string;
  label: string;
  tint: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={({ pressed }) => [styles.quickAction, pressed && styles.pressed]}
    >
      <View style={[styles.quickIcon, { backgroundColor: tint }]}>
        <AppText variant="subheading">{emoji}</AppText>
      </View>
      <AppText variant="micro" color={colors.textMuted} center numberOfLines={1}>
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
  headerText: { flex: 1, gap: spacing.xs },
  iconButton: {
    width: 46,
    height: 46,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.borderSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hero: { marginTop: spacing.xl },
  // Extra bottom room so the skyline sits under the button rather than
  // behind it.
  heroContent: { paddingBottom: spacing.xxl },
  heroTitle: { marginTop: spacing.xs, marginBottom: spacing.xs },
  heroButton: { marginTop: spacing.xl },
  goalCard: { marginTop: spacing.lg },
  goalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  goalHeaderText: { flex: 1, gap: spacing.xs },
  goalNumbers: { flexDirection: 'row', alignItems: 'baseline', gap: spacing.xs },
  goalUnit: { paddingBottom: 2 },
  goalHint: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  quickRow: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.lg },
  quickAction: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.borderSoft,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xs,
    alignItems: 'center',
    gap: spacing.sm,
    minHeight: 96,
    justifyContent: 'center',
  },
  quickIcon: {
    width: 40,
    height: 40,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: { opacity: 0.9, transform: [{ scale: 0.985 }] },
  section: { marginTop: spacing.lg },
});
