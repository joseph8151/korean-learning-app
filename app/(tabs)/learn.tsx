import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useCallback } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { CourseCard } from '@/components/CourseCard';
import {
  AppText,
  ErrorState,
  GradientCard,
  LoadingState,
  Screen,
  SectionHeader,
} from '@/components/ui';
import { colors, onGradient, radius, spacing } from '@/constants/theme';
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

      <GradientCard
        gradient="dusk"
        direction="horizontal"
        onPress={() => router.push('/hangul')}
        accessibilityLabel="Read Hangul in one sitting. Consonants, vowels and batchim with audio."
        accessibilityHint="Opens the Hangul trainer"
        style={styles.bannerWrap}
        contentStyle={styles.hangulBanner}
      >
        <View style={styles.hangulText}>
          <AppText variant="overline" color={onGradient.secondary}>
            START HERE
          </AppText>
          <AppText variant="subheading" color={onGradient.primary} style={styles.hangulTitle}>
            Read Hangul in one sitting
          </AppText>
          <AppText variant="caption" color={onGradient.secondary}>
            Consonants, vowels and batchim with audio.
          </AppText>
        </View>
        <AppText style={styles.hangulGlyph}>한</AppText>
      </GradientCard>

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
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.borderSoft,
    paddingHorizontal: spacing.lg,
    height: 52,
  },
  hangulBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
  },
  // The gradient runs left to right and only its left two thirds are dark
  // enough for white body text, so the copy is capped there and the glyph
  // takes the bright coral end.
  hangulText: { flex: 1, gap: 2 },
  hangulTitle: { marginTop: spacing.xs, marginBottom: 2 },
  hangulGlyph: { fontSize: 52, lineHeight: 62, fontWeight: '800', color: 'rgba(255,255,255,0.9)' },
  bannerWrap: { marginTop: spacing.xl },
  list: { gap: spacing.lg, paddingTop: spacing.xl },
});
