import { StyleSheet, View } from 'react-native';

import { AppText, Card, ProgressBar, Screen, SectionHeader, StreakBadge } from '@/components/ui';
import { ACHIEVEMENTS } from '@/constants/content';
import { colors, radius, spacing } from '@/constants/theme';
import { formatMinutes, lastSevenDayKeys } from '@/lib/date';
import { goalProgressRatio } from '@/lib/progress';
import { visibleStreak } from '@/lib/streak';
import { xpLevel, xpProgressWithinLevel } from '@/lib/xp';
import {
  selectCompletedLessonCount,
  selectWordsLearned,
  useProgressStore,
} from '@/store/useProgressStore';
import { useUserStore } from '@/store/useUserStore';

const DAY_LABELS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

export default function ProgressScreen() {
  const dailyGoalMinutes = useUserStore((state) => state.dailyGoalMinutes);

  const totalXp = useProgressStore((state) => state.totalXp);
  const streak = useProgressStore((state) => state.streak);
  const activityByDate = useProgressStore((state) => state.activityByDate);
  const speakingSeconds = useProgressStore((state) => state.speakingSeconds);
  const achievements = useProgressStore((state) => state.achievements);
  const lessonsCompleted = useProgressStore(selectCompletedLessonCount);
  const wordsLearned = useProgressStore(selectWordsLearned);

  const weekKeys = lastSevenDayKeys();
  const weekMinutes = weekKeys.reduce(
    (sum, key) => sum + Math.floor((activityByDate[key]?.studySeconds ?? 0) / 60),
    0,
  );
  const weeklyGoal = dailyGoalMinutes * 7;
  const maxDayMinutes = Math.max(
    dailyGoalMinutes,
    ...weekKeys.map((key) => Math.floor((activityByDate[key]?.studySeconds ?? 0) / 60)),
  );

  const level = xpLevel(totalXp);
  const levelProgress = xpProgressWithinLevel(totalXp);

  return (
    <Screen>
      <View style={styles.header}>
        <SectionHeader title="Progress" subtitle="Everything you have built so far." />
      </View>

      <Card style={styles.weekCard}>
        <View style={styles.weekHeader}>
          <View>
            <AppText variant="micro" color={colors.textMuted}>
              WEEKLY GOAL
            </AppText>
            <AppText variant="heading">
              {weekMinutes} / {weeklyGoal} minutes
            </AppText>
          </View>
          <StreakBadge days={visibleStreak(streak)} />
        </View>

        <ProgressBar
          ratio={goalProgressRatio(weekMinutes, weeklyGoal)}
          accessibilityLabel={`${weekMinutes} of ${weeklyGoal} weekly minutes`}
        />

        <View style={styles.chart} accessibilityLabel="Study minutes for the last seven days">
          {weekKeys.map((key, index) => {
            const minutes = Math.floor((activityByDate[key]?.studySeconds ?? 0) / 60);
            const height = Math.max(4, (minutes / maxDayMinutes) * 80);
            return (
              <View key={key} style={styles.chartColumn}>
                <View
                  style={[
                    styles.bar,
                    { height, backgroundColor: minutes > 0 ? colors.primary : colors.border },
                  ]}
                />
                <AppText variant="micro" color={colors.textSubtle}>
                  {DAY_LABELS[index]}
                </AppText>
              </View>
            );
          })}
        </View>
      </Card>

      <Card style={styles.levelCard}>
        <View style={styles.levelRow}>
          <AppText variant="micro" color={colors.textMuted}>
            XP LEVEL {level}
          </AppText>
          <AppText variant="micro" color={colors.textMuted}>
            {levelProgress.current} / {levelProgress.required} XP
          </AppText>
        </View>
        <ProgressBar
          ratio={levelProgress.ratio}
          color={colors.secondary}
          trackColor={colors.secondarySoft}
          accessibilityLabel={`Experience level ${level}`}
        />
        <AppText variant="caption" color={colors.textMuted} style={styles.levelHint}>
          {totalXp} XP earned in total.
        </AppText>
      </Card>

      <View style={styles.stats}>
        <StatTile label="Current Streak" value={`${visibleStreak(streak)} days`} />
        <StatTile label="Lessons Completed" value={`${lessonsCompleted}`} />
        <StatTile label="Words Learned" value={`${wordsLearned}`} />
        <StatTile label="Speaking Practice" value={formatMinutes(speakingSeconds)} />
      </View>

      <View style={styles.achievementsHeader}>
        <SectionHeader
          title="Achievements"
          subtitle={`${achievements.length} of ${ACHIEVEMENTS.length} unlocked`}
        />
      </View>

      <View style={styles.achievements}>
        {ACHIEVEMENTS.map((achievement) => {
          const unlocked = achievements.includes(achievement.id);
          return (
            <View
              key={achievement.id}
              style={[styles.achievement, !unlocked && styles.achievementLocked]}
              accessibilityLabel={`${achievement.title}. ${
                unlocked ? 'Unlocked' : 'Locked'
              }. ${achievement.description}`}
            >
              <AppText variant="heading">{unlocked ? achievement.emoji : '🔒'}</AppText>
              <AppText variant="micro" center numberOfLines={2}>
                {achievement.title}
              </AppText>
            </View>
          );
        })}
      </View>
    </Screen>
  );
}

function StatTile({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.statTile} accessibilityLabel={`${label}: ${value}`}>
      <AppText variant="heading">{value}</AppText>
      <AppText variant="micro" color={colors.textMuted}>
        {label}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { paddingTop: spacing.lg },
  weekCard: { marginTop: spacing.xl },
  weekHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  chart: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: spacing.xl,
    height: 104,
  },
  chartColumn: { alignItems: 'center', gap: spacing.sm, flex: 1 },
  bar: { width: 18, borderRadius: radius.sm },
  levelCard: { marginTop: spacing.lg },
  levelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  levelHint: { marginTop: spacing.md },
  stats: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md, marginTop: spacing.lg },
  statTile: {
    flexGrow: 1,
    flexBasis: '45%',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.lg,
    gap: 2,
  },
  achievementsHeader: { marginTop: spacing.xxl },
  achievements: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md, marginTop: spacing.lg },
  achievement: {
    width: '30%',
    flexGrow: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.sm,
    alignItems: 'center',
    gap: spacing.sm,
    minHeight: 96,
    justifyContent: 'center',
  },
  achievementLocked: { opacity: 0.5 },
});
