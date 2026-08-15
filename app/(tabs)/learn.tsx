import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useCallback } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { CourseCard } from '@/components/CourseCard';
import { AppText, ErrorState, LoadingState, Screen, SectionHeader } from '@/components/ui';
import { colors, radius, spacing } from '@/constants/theme';
import { useAsyncData } from '@/hooks/useAsyncData';
import { usePremiumGate } from '@/hooks/usePremium';
import { contentService } from '@/services/content';
import { useProgressStore } from '@/store/useProgressStore';
import type { Course, Lesson, Unit } from '@/types/content';

interface LearnData {
  courses: Course[];
  units: Unit[];
  lessons: Lesson[];
}

export default function LearnScreen() {
  const router = useRouter();
  const { isPremium, guard } = usePremiumGate();
  const lessonProgress = useProgressStore((state) => state.lessons);

  const loader = useCallback(async (): Promise<LearnData> => {
    const [courses, units, lessons] = await Promise.all([
      contentService.listCourses(),
      contentService.listAllUnits(),
      contentService.listAllLessons(),
    ]);
    return { courses, units, lessons };
  }, []);

  const { data, loading, error, reload } = useAsyncData(loader);

  if (loading) {
    return (
      <Screen scroll={false}>
        <LoadingState label="Loading your courses…" />
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

  return (
    <Screen>
      <View style={styles.header}>
        <SectionHeader title="Learn" subtitle="Courses built around real Korean life." />

        <Pressable
          onPress={() => router.push('/search')}
          accessibilityRole="button"
          accessibilityLabel="Search lessons, words and phrases"
          style={styles.searchBar}
        >
          <Ionicons name="search" size={18} color={colors.textSubtle} />
          <AppText variant="caption" color={colors.textSubtle}>
            Search lessons, words, phrases
          </AppText>
        </Pressable>
      </View>

      <Pressable
        onPress={() => router.push('/hangul')}
        accessibilityRole="button"
        accessibilityLabel="Open the Hangul trainer"
        style={({ pressed }) => [styles.hangulBanner, pressed && styles.pressed]}
      >
        <View style={styles.hangulText}>
          <AppText variant="micro" color="rgba(255,255,255,0.8)">
            START HERE
          </AppText>
          <AppText variant="subheading" color={colors.white}>
            Read Hangul in one sitting
          </AppText>
          <AppText variant="caption" color="rgba(255,255,255,0.85)">
            Consonants, vowels and batchim with audio.
          </AppText>
        </View>
        <AppText style={styles.hangulEmoji}>한</AppText>
      </Pressable>

      <View style={styles.list}>
        {data.courses.map((course) => {
          const unitIds = data.units.filter((unit) => unit.courseId === course.id).map((unit) => unit.id);
          const courseLessons = data.lessons.filter((lesson) => unitIds.includes(lesson.unitId));
          const completed = courseLessons.filter(
            (lesson) => lessonProgress[lesson.id]?.status === 'completed',
          ).length;

          return (
            <CourseCard
              key={course.id}
              course={course}
              unitCount={unitIds.length}
              lessonCount={courseLessons.length}
              completedLessons={completed}
              locked={course.isPremium && !isPremium}
              onPress={() =>
                guard(course.isPremium, () => router.push(`/course/${course.id}`))
              }
            />
          );
        })}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { paddingTop: spacing.lg, gap: spacing.lg },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    height: 50,
  },
  hangulBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.accent,
    borderRadius: radius.xl,
    padding: spacing.xl,
    marginTop: spacing.xl,
    gap: spacing.lg,
  },
  hangulText: { flex: 1, gap: 2 },
  hangulEmoji: { fontSize: 46, lineHeight: 56, color: 'rgba(255,255,255,0.85)' },
  pressed: { opacity: 0.9 },
  list: { gap: spacing.lg, paddingTop: spacing.xl },
});
