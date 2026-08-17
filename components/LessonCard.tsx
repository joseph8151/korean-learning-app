import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText, PremiumBadge } from '@/components/ui';
import { colors, radius, spacing } from '@/constants/theme';
import type { Lesson, LessonType } from '@/types/content';
import type { LessonStatus } from '@/types/user';

const iconByType: Record<LessonType, keyof typeof Ionicons.glyphMap> = {
  hangul: 'text',
  vocabulary: 'library',
  conversation: 'chatbubbles',
  grammar: 'construct',
  culture: 'earth',
  review: 'refresh',
};

export interface LessonCardProps {
  lesson: Lesson;
  status: LessonStatus;
  locked: boolean;
  onPress: () => void;
}

export function LessonCard({ lesson, status, locked, onPress }: LessonCardProps) {
  const isComplete = status === 'completed';

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${lesson.title}. ${lesson.estimatedMinutes} minutes. ${
        isComplete ? 'Completed.' : locked ? 'Premium lesson.' : 'Not started.'
      }`}
      accessibilityHint="Opens the lesson"
      style={({ pressed }) => [styles.row, pressed && styles.pressed]}
    >
      <View
        style={[
          styles.iconBox,
          isComplete && { backgroundColor: colors.successSoft },
          locked && { backgroundColor: colors.background },
        ]}
      >
        <Ionicons
          name={isComplete ? 'checkmark' : locked ? 'lock-closed' : iconByType[lesson.lessonType]}
          size={20}
          color={isComplete ? colors.successDeep : locked ? colors.textSubtle : colors.primary}
        />
      </View>

      <View style={styles.text}>
        <View style={styles.titleRow}>
          <AppText variant="bodyStrong" style={styles.title}>
            {lesson.title}
          </AppText>
          {locked ? <PremiumBadge label="PRO" /> : null}
        </View>
        <AppText variant="caption" color={colors.textMuted} numberOfLines={1}>
          {lesson.description}
        </AppText>
      </View>

      <View style={styles.meta}>
        <AppText variant="micro" color={colors.textMuted}>
          {lesson.estimatedMinutes} min
        </AppText>
        {isComplete ? (
          <AppText variant="micro" color={colors.successDeep}>
            Done
          </AppText>
        ) : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.borderSoft,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    minHeight: 76,
  },
  pressed: { opacity: 0.92, transform: [{ scale: 0.99 }] },
  iconBox: {
    width: 46,
    height: 46,
    borderRadius: radius.sm,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: { flex: 1, gap: 2 },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  title: { flexShrink: 1 },
  meta: { alignItems: 'flex-end', gap: 2 },
});
