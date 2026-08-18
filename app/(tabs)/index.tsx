import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useCallback } from 'react';
import { StyleSheet, View } from 'react-native';

import { SeoulSkyline } from '@/components/decor/SeoulSkyline';
import { Bouncy, CountUp, Reveal, StreakFlame } from '@/components/motion';
import { DailyKoreanCard } from '@/features/home/DailyKoreanCard';
import { DailyPlanCard } from '@/features/home/DailyPlanCard';
import {
  AppText,
  Card,
  ChunkyButton,
  ErrorState,
  GradientCard,
  LoadingState,
  ProgressBar,
  Screen,
} from '@/components/ui';
import { colors, onGradient, radius, spacing } from '@/constants/theme';
import { useAsyncData } from '@/hooks/useAsyncData';
import { useNow } from '@/hooks/useNow';
import { usePremiumGate } from '@/hooks/usePremium';
import { buildDailyPlan, type DailyTaskId } from '@/lib/dailyPlan';
import { greetingForHour } from '@/lib/date';
import { findNextLesson } from '@/lib/progress';
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
  { emoji: '🤖', label: 'AI Chat', tint: colors.secondarySoft, href: '/practice/ai-chat' },
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
  const totalXp = useProgressStore((state) => state.totalXp);
  const vocabulary = useProgressStore((state) => state.vocabulary);
  const activityByDate = useProgressStore((state) => state.activityByDate);
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
  const days = visibleStreak(streak);

  const plan = buildDailyPlan({
    activityByDate,
    vocabulary,
    savedPhraseIds,
    todaysPhraseId: data.phrase.id,
    now,
  });

  // How far through the current unit the learner is, which is more meaningful
  // on the hero than a percentage of the whole course.
  const unitLessons = next ? (data.lessonsByUnit[next.unit.id] ?? []) : [];
  const unitDone = unitLessons.filter((lesson) => lessons[lesson.id]?.status === 'completed').length;

  const openLesson = (lesson: Lesson) =>
    guard(lesson.isPremium, () => router.push(`/lesson/${lesson.id}`));

  const openTask = (task: DailyTaskId) => {
    if (task === 'lesson') {
      if (next) openLesson(next.lesson);
      else router.push('/practice/quick-quiz');
      return;
    }
    if (task === 'review') {
      router.push('/practice/vocabulary');
      return;
    }
    router.push('/daily');
  };

  return (
    <Screen>
      <View style={styles.header}>
        <View style={styles.headerText}>
          <AppText variant="overline" color={colors.textSubtle}>
            {greetingForHour(now.getHours()).toUpperCase()}
          </AppText>
          <AppText variant="title" numberOfLines={1}>
            {displayName}
          </AppText>
        </View>

        <Bouncy
          onPress={() => router.push('/search')}
          scaleTo={0.9}
          accessibilityLabel="Search lessons, words and phrases"
          hitSlop={8}
          style={styles.iconButton}
        >
          <Ionicons name="search" size={21} color={colors.text} />
        </Bouncy>
      </View>

      {/* Streak, XP and minutes as a compact strip rather than a whole card —
          they are reference numbers, not the point of the screen. */}
      <Reveal index={0}>
        <View style={styles.stats}>
          <StatPill
            icon={<StreakFlame active={days > 0} size={14} />}
            value={`${days}`}
            label={days === 1 ? 'day' : 'days'}
          />
          <View style={styles.statDivider} />
          <StatPill
            icon={<Ionicons name="flash" size={14} color={colors.warningDeep} />}
            value={<CountUp value={totalXp} variant="bodyStrong" duration={800} />}
            label="XP"
          />
          <View style={styles.statDivider} />
          <StatPill
            icon={<Ionicons name="time-outline" size={14} color={colors.primaryDeep} />}
            value={`${todayMinutes}/${dailyGoalMinutes}`}
            label="min"
          />
        </View>
      </Reveal>

      <Reveal index={1}>
        {next ? (
          <GradientCard
            style={styles.hero}
            contentStyle={styles.heroContent}
            decoration={<SeoulSkyline />}
            onPress={() => openLesson(next.lesson)}
            accessibilityLabel={`Next lesson: ${next.lesson.title}, ${next.unit.title}, lesson ${unitDone + 1} of ${unitLessons.length}`}
            accessibilityHint="Opens the lesson"
          >
            <AppText variant="overline" color={onGradient.secondary}>
              {unitLessons.length > 0
                ? `${next.unit.title.toUpperCase()} · ${unitDone + 1}/${unitLessons.length}`
                : next.unit.title.toUpperCase()}
            </AppText>
            <AppText variant="title" color={onGradient.primary} style={styles.heroTitle}>
              {next.lesson.title}
            </AppText>
            <AppText variant="caption" color={onGradient.secondary}>
              {next.lesson.description}
            </AppText>

            {unitLessons.length > 0 ? (
              <View style={styles.heroProgress}>
                <ProgressBar
                  ratio={unitDone / unitLessons.length}
                  color={colors.white}
                  trackColor="rgba(255,255,255,0.28)"
                  height={6}
                  accessibilityLabel={`Unit progress: ${unitDone} of ${unitLessons.length} lessons`}
                />
              </View>
            ) : null}

            <ChunkyButton
              label={unitDone > 0 ? 'Continue' : 'Start Lesson'}
              tone="surface"
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
            <ChunkyButton
              label="Practise Now"
              style={styles.heroButton}
              onPress={() => router.push('/practice/quick-quiz')}
            />
          </Card>
        )}
      </Reveal>

      <Reveal index={2}>
        <View style={styles.section}>
          <DailyPlanCard plan={plan} onOpen={openTask} />
        </View>
      </Reveal>

      <Reveal index={3}>
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
      </Reveal>

      <Reveal index={4}>
        <View style={styles.section}>
          <DailyKoreanCard
            phrase={data.phrase}
            saved={savedPhraseIds.includes(data.phrase.id)}
            onToggleSave={() => toggleSavedPhrase(data.phrase.id)}
            onSeeAll={() => router.push('/daily')}
          />
        </View>
      </Reveal>
    </Screen>
  );
}

function StatPill({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: React.ReactNode;
  label: string;
}) {
  return (
    <View style={styles.stat}>
      {icon}
      <View style={styles.statText}>
        {typeof value === 'string' ? <AppText variant="bodyStrong">{value}</AppText> : value}
        <AppText variant="micro" color={colors.textSubtle}>
          {label}
        </AppText>
      </View>
    </View>
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
    <Bouncy
      onPress={onPress}
      haptic
      scaleTo={0.93}
      accessibilityLabel={label}
      style={styles.quickAction}
    >
      <View style={[styles.quickIcon, { backgroundColor: tint }]}>
        <AppText variant="subheading">{emoji}</AppText>
      </View>
      <AppText variant="micro" color={colors.textMuted} center numberOfLines={1}>
        {label}
      </AppText>
    </Bouncy>
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

  stats: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.borderSoft,
    paddingVertical: spacing.md,
    marginTop: spacing.lg,
  },
  stat: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  statText: { alignItems: 'flex-start' },
  statDivider: { width: StyleSheet.hairlineWidth, height: 28, backgroundColor: colors.border },

  hero: { marginTop: spacing.lg },
  heroContent: { paddingBottom: spacing.xxl },
  heroTitle: { marginTop: spacing.xs, marginBottom: spacing.xs },
  heroProgress: { marginTop: spacing.lg },
  heroButton: { marginTop: spacing.lg },

  section: { marginTop: spacing.lg },

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
});
