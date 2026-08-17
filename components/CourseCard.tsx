import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';

import { AppText, Card, PremiumBadge, ProgressBar } from '@/components/ui';
import { colors, radius, spacing } from '@/constants/theme';
import type { Course } from '@/types/content';

export interface CourseCardProps {
  course: Course;
  unitCount: number;
  lessonCount: number;
  completedLessons: number;
  locked: boolean;
  onPress: () => void;
}

export function CourseCard({
  course,
  unitCount,
  lessonCount,
  completedLessons,
  locked,
  onPress,
}: CourseCardProps) {
  const ratio = lessonCount === 0 ? 0 : completedLessons / lessonCount;
  const percent = Math.round(ratio * 100);
  const started = completedLessons > 0;
  const finished = lessonCount > 0 && completedLessons === lessonCount;

  return (
    <Card
      onPress={onPress}
      padded={false}
      accessibilityLabel={`${course.title}. ${completedLessons} of ${lessonCount} lessons complete.${
        locked ? ' Premium course.' : ''
      }`}
      accessibilityHint="Opens the course"
    >
      {/* A full-bleed colour rule at the top, the way Korean apps mark a
          section. Carries no meaning on its own — the title does that. */}
      <View style={[styles.rule, { backgroundColor: course.accent }]} />

      <View style={styles.body}>
        <View style={styles.header}>
          <View style={[styles.emojiBox, { backgroundColor: `${course.accent}1A` }]}>
            <AppText variant="heading">{course.emoji}</AppText>
          </View>

          <View style={styles.headerText}>
            <View style={styles.titleRow}>
              <AppText variant="subheading" style={styles.title}>
                {course.title}
              </AppText>
              {locked ? <PremiumBadge label="PRO" /> : null}
            </View>
            <AppText variant="caption" color={colors.textMuted}>
              {unitCount} units · {lessonCount} lessons
            </AppText>
          </View>

          {finished ? (
            <Ionicons name="checkmark-circle" size={24} color={colors.successDeep} />
          ) : null}
        </View>

        <AppText variant="caption" color={colors.textMuted} style={styles.description}>
          {course.description}
        </AppText>

        <ProgressBar
          ratio={ratio}
          color={course.accent}
          trackColor={colors.border}
          accessibilityLabel={`${percent} percent complete`}
        />

        <View style={styles.footer}>
          <AppText variant="micro" color={colors.textMuted}>
            {completedLessons} / {lessonCount} lessons
          </AppText>
          <AppText
            variant="micro"
            color={started ? course.accent : colors.textSubtle}
            style={styles.percent}
          >
            {finished ? 'Complete' : started ? `${percent}%` : 'Not started'}
          </AppText>
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  rule: {
    height: 5,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
  },
  body: { padding: spacing.xl },
  header: { flexDirection: 'row', alignItems: 'center', gap: spacing.lg },
  emojiBox: {
    width: 54,
    height: 54,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: { flex: 1, gap: 2 },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  title: { flexShrink: 1 },
  description: { marginTop: spacing.md, marginBottom: spacing.lg },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
    marginTop: spacing.md,
  },
  percent: { fontWeight: '800' },
});
