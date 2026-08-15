import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { LessonCard } from '@/components/LessonCard';
import {
  AppText,
  EmptyState,
  ErrorState,
  LoadingState,
  ProgressBar,
  Screen,
} from '@/components/ui';
import { colors, spacing } from '@/constants/theme';
import { useAsyncData } from '@/hooks/useAsyncData';
import { usePremiumGate } from '@/hooks/usePremium';
import { summarizeLessons } from '@/lib/progress';
import { contentService } from '@/services/content';
import { useProgressStore } from '@/store/useProgressStore';
import type { Course, Lesson, Unit } from '@/types/content';

interface CourseData {
  course: Course | null;
  units: Unit[];
  lessonsByUnit: Record<string, Lesson[]>;
}

export default function CourseScreen() {
  const router = useRouter();
  const { courseId } = useLocalSearchParams<{ courseId: string }>();
  const { isPremium, guard } = usePremiumGate();
  const lessonProgress = useProgressStore((state) => state.lessons);

  const loader = useCallback(async (): Promise<CourseData> => {
    if (!courseId) return { course: null, units: [], lessonsByUnit: {} };

    const [courses, units] = await Promise.all([
      contentService.listCourses(),
      contentService.listUnits(courseId),
    ]);

    const lessonLists = await Promise.all(units.map((unit) => contentService.listLessons(unit.id)));
    const lessonsByUnit = Object.fromEntries(
      units.map((unit, index) => [unit.id, lessonLists[index]]),
    );

    return {
      course: courses.find((item) => item.id === courseId) ?? null,
      units,
      lessonsByUnit,
    };
  }, [courseId]);

  const { data, loading, error, reload } = useAsyncData(loader);

  if (loading) {
    return (
      <Screen scroll={false}>
        <LoadingState />
      </Screen>
    );
  }

  if (error || !data?.course) {
    return (
      <Screen scroll={false}>
        <ErrorState onRetry={reload} title="We couldn't load this course." />
      </Screen>
    );
  }

  const allLessons = Object.values(data.lessonsByUnit).flat();
  const summary = summarizeLessons(allLessons, lessonProgress);

  return (
    <Screen>
      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel="Go back"
          hitSlop={12}
          style={styles.back}
        >
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </Pressable>
      </View>

      <View style={styles.hero}>
        <AppText style={styles.emoji}>{data.course.emoji}</AppText>
        <AppText variant="title">{data.course.title}</AppText>
        <AppText variant="body" color={colors.textMuted}>
          {data.course.description}
        </AppText>

        <View style={styles.progressRow}>
          <ProgressBar
            ratio={summary.percentage / 100}
            color={data.course.accent}
            accessibilityLabel={`${summary.percentage} percent complete`}
          />
          <AppText variant="micro" color={colors.textMuted} style={styles.progressLabel}>
            {summary.completedLessons} of {summary.totalLessons} lessons · {summary.percentage}%
          </AppText>
        </View>
      </View>

      {data.units.length === 0 ? (
        <EmptyState
          title="No units yet"
          message="New content for this course is on the way."
          emoji="📦"
        />
      ) : (
        data.units.map((unit) => (
          <View key={unit.id} style={styles.unit}>
            <View style={styles.unitHeader}>
              <AppText variant="subheading">{unit.title}</AppText>
              <AppText variant="caption" color={colors.textMuted}>
                {unit.description}
              </AppText>
            </View>

            <View style={styles.lessons}>
              {(data.lessonsByUnit[unit.id] ?? []).map((lesson) => {
                const locked = (lesson.isPremium || data.course!.isPremium) && !isPremium;
                return (
                  <LessonCard
                    key={lesson.id}
                    lesson={lesson}
                    status={lessonProgress[lesson.id]?.status ?? 'not_started'}
                    locked={locked}
                    onPress={() =>
                      guard(lesson.isPremium || data.course!.isPremium, () =>
                        router.push(`/lesson/${lesson.id}`),
                      )
                    }
                  />
                );
              })}
            </View>
          </View>
        ))
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { paddingTop: spacing.lg },
  back: { width: 40, height: 40, justifyContent: 'center' },
  hero: { paddingTop: spacing.md, gap: spacing.sm },
  emoji: { fontSize: 44, lineHeight: 54 },
  progressRow: { marginTop: spacing.lg, gap: spacing.sm },
  progressLabel: { marginTop: 2 },
  unit: { marginTop: spacing.xxl },
  unitHeader: { gap: 2, marginBottom: spacing.lg },
  lessons: { gap: spacing.md },
});
