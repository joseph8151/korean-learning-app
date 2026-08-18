import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, useDerivedValue, withSpring } from 'react-native-reanimated';

import { Bouncy } from '@/components/motion';
import { AppText, Card } from '@/components/ui';
import { colors, depth, radius, spacing } from '@/constants/theme';
import type { DailyPlan, DailyTaskId } from '@/lib/dailyPlan';

export interface DailyPlanCardProps {
  plan: DailyPlan;
  onOpen: (task: DailyTaskId) => void;
}

const COPY: Record<DailyTaskId, { title: string; hint: string; icon: keyof typeof Ionicons.glyphMap }> = {
  lesson: { title: 'Finish a lesson', hint: 'Five minutes is enough', icon: 'book' },
  review: { title: 'Review your words', hint: 'Before you forget them', icon: 'refresh' },
  phrase: { title: "Save today's phrase", hint: 'One line, learned for good', icon: 'sparkles' },
};

/**
 * The day as three things to finish rather than a number of minutes to
 * accumulate. A minute count is something you watch; a list is something you
 * complete, and finishing it is what brings someone back tomorrow.
 */
export function DailyPlanCard({ plan, onOpen }: DailyPlanCardProps) {
  return (
    <Card>
      <View style={styles.header}>
        <View style={styles.headerText}>
          <AppText variant="overline" color={colors.textSubtle}>
            TODAY
          </AppText>
          <AppText variant="heading">
            {plan.allDone ? 'All done for today 🎉' : `${plan.completed} of ${plan.total} finished`}
          </AppText>
        </View>
        <PlanDots plan={plan} />
      </View>

      <View style={styles.tasks}>
        {plan.tasks.map((task) => {
          const copy = COPY[task.id];
          const showCount = task.id === 'review' && !task.done && (task.count ?? 0) > 0;

          return (
            <Bouncy
              key={task.id}
              onPress={() => onOpen(task.id)}
              scaleTo={0.98}
              haptic
              accessibilityLabel={`${copy.title}. ${task.done ? 'Done.' : copy.hint}`}
              style={[styles.task, task.done && styles.taskDone]}
            >
              <View style={[styles.check, task.done && styles.checkDone]}>
                {task.done ? (
                  <Ionicons name="checkmark" size={15} color={colors.white} />
                ) : (
                  <Ionicons name={copy.icon} size={15} color={colors.primaryDeep} />
                )}
              </View>

              <View style={styles.taskText}>
                <AppText
                  variant="bodyStrong"
                  color={task.done ? colors.textSubtle : colors.text}
                  style={task.done && styles.struck}
                >
                  {copy.title}
                </AppText>
                {!task.done ? (
                  <AppText variant="micro" color={colors.textSubtle}>
                    {copy.hint}
                  </AppText>
                ) : null}
              </View>

              {showCount ? (
                <View style={styles.countPill}>
                  <AppText variant="micro" color={colors.white}>
                    {task.count}
                  </AppText>
                </View>
              ) : task.done ? null : (
                <Ionicons name="chevron-forward" size={16} color={colors.textFaint} />
              )}
            </Bouncy>
          );
        })}
      </View>
    </Card>
  );
}

/** Three dots that fill as the day is completed. Small, and readable at a glance. */
function PlanDots({ plan }: { plan: DailyPlan }) {
  return (
    <View
      style={styles.dots}
      accessibilityLabel={`${plan.completed} of ${plan.total} tasks complete`}
    >
      {plan.tasks.map((task) => (
        <PlanDot key={task.id} done={task.done} />
      ))}
    </View>
  );
}

function PlanDot({ done }: { done: boolean }) {
  const progress = useDerivedValue(() => withSpring(done ? 1 : 0, depth.spring.bouncy));

  const style = useAnimatedStyle(() => ({
    transform: [{ scale: 0.75 + progress.value * 0.25 }],
    opacity: 0.35 + progress.value * 0.65,
  }));

  return (
    <Animated.View
      style={[styles.dot, done ? styles.dotDone : styles.dotPending, style]}
    />
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  headerText: { flex: 1, gap: spacing.xs },
  dots: { flexDirection: 'row', gap: spacing.sm, alignItems: 'center' },
  dot: { width: 12, height: 12, borderRadius: radius.pill },
  dotPending: { backgroundColor: colors.border },
  dotDone: { backgroundColor: colors.success },

  tasks: { gap: spacing.sm, marginTop: spacing.lg },
  task: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.surfaceMuted,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    minHeight: 56,
  },
  taskDone: { backgroundColor: colors.successSoft },
  check: {
    width: 28,
    height: 28,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkDone: { backgroundColor: colors.successDeep },
  taskText: { flex: 1, gap: 1 },
  struck: { textDecorationLine: 'line-through' },
  countPill: {
    minWidth: 24,
    height: 24,
    borderRadius: radius.pill,
    paddingHorizontal: 6,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
