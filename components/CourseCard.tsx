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

  return (
    <Card
      onPress={onPress}
      accessibilityLabel={`${course.title}. ${completedLessons} of ${lessonCount} lessons complete.${
        locked ? ' Premium course.' : ''
      }`}
      accessibilityHint="Opens the course"
    >
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
      </View>

      <AppText variant="caption" color={colors.textMuted} style={styles.description}>
        {course.description}
      </AppText>

      <ProgressBar
        ratio={ratio}
        color={course.accent}
        trackColor={colors.border}
        accessibilityLabel={`${Math.round(ratio * 100)} percent complete`}
      />

      <AppText variant="micro" color={colors.textSubtle} style={styles.footer}>
        {completedLessons} / {lessonCount} lessons
      </AppText>
    </Card>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', gap: spacing.lg },
  emojiBox: {
    width: 52,
    height: 52,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: { flex: 1, gap: 2 },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  title: { flexShrink: 1 },
  description: { marginTop: spacing.md, marginBottom: spacing.lg },
  footer: { marginTop: spacing.sm },
});
