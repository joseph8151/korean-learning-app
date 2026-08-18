import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useCallback } from 'react';
import { StyleSheet, View } from 'react-native';

import { SeoulSkyline } from '@/components/decor/SeoulSkyline';
import { Bouncy, CountUp, Reveal } from '@/components/motion';
import {
  AppText,
  Card,
  ChunkyButton,
  GradientCard,
  LoadingState,
  Screen,
  Tag,
} from '@/components/ui';
import { colors, onGradient, radius, spacing } from '@/constants/theme';
import { useAsyncData } from '@/hooks/useAsyncData';
import { useIsPremium } from '@/hooks/usePremium';
import { CHAT_SITUATIONS } from '@/constants/content';
import { contentService } from '@/services/content';
import { estimateFinish, STUDY_PACES } from '@/lib/studyPlan';
import { useUserStore } from '@/store/useUserStore';

interface AboutData {
  courses: number;
  lessons: number;
  words: number;
  phrases: number;
  articles: number;
  situations: number;
  lessonMinutes: number;
}

const FEATURES = [
  {
    emoji: '🔤',
    title: 'Read Hangul in one sitting',
    body: 'Every consonant, vowel and batchim with audio. Most people can read signs by the end of the first day.',
  },
  {
    emoji: '☕',
    title: 'Korean from real situations',
    body: 'Cafes, the subway, delivery apps, the office, the clinic. Nothing you would not actually say out loud.',
  },
  {
    emoji: '🎙️',
    title: 'Hear yourself against a native speaker',
    body: 'Record a phrase and play it straight back against the audio. The recording stays on your phone and is deleted when you move on.',
  },
  {
    emoji: '🔁',
    title: 'Review timed to forgetting',
    body: 'Words come back just before you lose them, and the ones you keep missing come back sooner.',
  },
  {
    emoji: '🤖',
    title: 'A conversation partner',
    body: 'Fifteen situations to practise — ordering, a clinic visit, a job interview — without the fear of getting it wrong in public.',
  },
  {
    emoji: '🍜',
    title: 'The culture underneath',
    body: 'Why Koreans say 우리, what 눈치 is, why your age comes up in the first two minutes.',
  },
  {
    emoji: '✈️',
    title: 'Works with no signal',
    body: 'Lessons live on your phone. Study on a plane, on the subway, anywhere the bars drop.',
  },
];

export default function AboutScreen() {
  const router = useRouter();
  const isPremium = useIsPremium();
  const dailyGoalMinutes = useUserStore((state) => state.dailyGoalMinutes);

  const loader = useCallback(async (): Promise<AboutData> => {
    const [courses, lessons, words, phrases, articles] = await Promise.all([
      contentService.listCourses(),
      contentService.listAllLessons(),
      contentService.listVocabulary(),
      contentService.listDailyPhrases(),
      contentService.listCultureArticles(),
    ]);

    return {
      courses: courses.length,
      lessons: lessons.length,
      words: words.length,
      phrases: phrases.length,
      articles: articles.length,
      situations: CHAT_SITUATIONS.length,
      lessonMinutes: lessons.reduce((sum: number, lesson) => sum + lesson.estimatedMinutes, 0),
    };
  }, []);

  const { data, loading } = useAsyncData(loader);

  if (loading || !data) {
    return (
      <Screen scroll={false}>
        <LoadingState label="Loading…" />
      </Screen>
    );
  }

  return (
    <Screen>
      <View style={styles.header}>
        <Bouncy
          onPress={() => router.back()}
          scaleTo={0.9}
          accessibilityLabel="Go back"
          hitSlop={12}
          style={styles.back}
        >
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </Bouncy>
      </View>

      <Reveal index={0}>
        <GradientCard decoration={<SeoulSkyline />} contentStyle={styles.heroContent}>
          <AppText variant="overline" color={onGradient.secondary}>
            WHAT YOU GET
          </AppText>
          <AppText variant="display" color={onGradient.primary} style={styles.heroTitle}>
            The Korean people actually speak
          </AppText>
          <AppText variant="body" color={onGradient.secondary}>
            Not textbook sentences. The lines you need in a Seoul cafe, on the
            subway, and in a group chat.
          </AppText>
        </GradientCard>
      </Reveal>

      <Reveal index={1}>
        <View style={styles.numbers}>
          <NumberTile value={data.lessons} label="lessons" />
          <NumberTile value={data.words} label="words" />
          <NumberTile value={data.phrases} label="daily phrases" />
          <NumberTile value={data.articles} label="culture reads" />
          <NumberTile value={data.situations} label="AI situations" />
          <NumberTile value={data.courses} label="courses" />
        </View>
      </Reveal>

      <Reveal index={2}>
        <View style={styles.section}>
          <AppText variant="title">Inside the app</AppText>
          <View style={styles.features}>
            {FEATURES.map((feature) => (
              <Card key={feature.title} style={styles.feature}>
                <View style={styles.featureIcon}>
                  <AppText variant="heading">{feature.emoji}</AppText>
                </View>
                <View style={styles.featureText}>
                  <AppText variant="bodyStrong">{feature.title}</AppText>
                  <AppText variant="caption" color={colors.textMuted}>
                    {feature.body}
                  </AppText>
                </View>
              </Card>
            ))}
          </View>
        </View>
      </Reveal>

      <Reveal index={3}>
        <View style={styles.section}>
          <AppText variant="title">Pick your pace</AppText>
          <AppText variant="caption" color={colors.textMuted} style={styles.paceIntro}>
            Same courses either way. The pace sets your daily goal — it is a
            commitment, not a different product.
          </AppText>

          <View style={styles.paces}>
            {STUDY_PACES.map((pace) => {
              const finish = estimateFinish(
                pace.minutesPerDay,
                data.lessonMinutes,
                data.lessons,
                new Date(),
                pace.months,
              );
              const current = dailyGoalMinutes === pace.minutesPerDay;

              return (
                <Card
                  key={pace.id}
                  onPress={() => router.push('/settings/daily-goal')}
                  accessibilityLabel={`${pace.title} pace, ${pace.minutesPerDay} minutes a day. ${pace.blurb}`}
                  accessibilityHint="Opens your daily goal setting"
                  style={[styles.pace, current && styles.paceCurrent]}
                >
                  <View style={styles.paceHeader}>
                    <View style={styles.paceHeaderText}>
                      <AppText variant="heading">{pace.title}</AppText>
                      <AppText variant="caption" color={colors.textMuted}>
                        {pace.blurb}
                      </AppText>
                    </View>
                    {current ? (
                      <Tag
                        label="YOUR PACE"
                        color={colors.primaryDeep}
                        backgroundColor={colors.primarySoft}
                      />
                    ) : null}
                  </View>

                  <View style={styles.paceFacts}>
                    <PaceFact value={`${pace.minutesPerDay} min`} label="a day" />
                    <PaceFact value={`${finish.lessonsPerDay}`} label="lessons a day" />
                    <PaceFact value={`${finish.lessonWeeks}`} label="weeks of lessons" />
                  </View>
                </Card>
              );
            })}
          </View>

          <Card tone="tinted" style={styles.paceNote}>
            <AppText variant="bodyStrong">After the lessons run out</AppText>
            <AppText variant="caption" color={colors.textMuted}>
              There are about {Math.round(data.lessonMinutes / 60)} hours of
              lessons today, so at any pace you will reach the end of the new
              material before your plan is up. What carries on is spaced review
              of every word you have met, quizzes, listening, speaking and
              unlimited AI conversation — which is the part that actually makes
              Korean stick. New lessons are added over time.
            </AppText>
          </Card>
        </View>
      </Reveal>

      {!isPremium ? (
        <Reveal index={4}>
          <View style={styles.section}>
            <Card>
              <AppText variant="overline" color={colors.warningDeep}>
                FREE FOREVER
              </AppText>
              <AppText variant="subheading" style={styles.freeTitle}>
                Hangul, two full courses and daily phrases
              </AppText>
              <AppText variant="caption" color={colors.textMuted}>
                Premium opens the other four courses, speaking and grammar
                practice, unlimited AI conversations and smart review.
              </AppText>
              <ChunkyButton
                label="See Premium"
                tone="secondary"
                style={styles.premiumButton}
                onPress={() => router.push('/paywall')}
              />
            </Card>
          </View>
        </Reveal>
      ) : null}
    </Screen>
  );
}

function NumberTile({ value, label }: { value: number; label: string }) {
  return (
    <View style={styles.numberTile}>
      <CountUp value={value} variant="title" duration={900} />
      <AppText variant="micro" color={colors.textMuted}>
        {label}
      </AppText>
    </View>
  );
}

function PaceFact({ value, label }: { value: string; label: string }) {
  return (
    <View style={styles.paceFact}>
      <AppText variant="bodyStrong">{value}</AppText>
      <AppText variant="micro" color={colors.textSubtle}>
        {label}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', paddingTop: spacing.lg, marginBottom: spacing.sm },
  back: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center', marginLeft: -spacing.sm },

  heroContent: { paddingBottom: spacing.xxxl },
  heroTitle: { marginTop: spacing.xs, marginBottom: spacing.sm },

  numbers: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md, marginTop: spacing.lg },
  numberTile: {
    flexGrow: 1,
    flexBasis: '30%',
    maxWidth: '31.5%',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.borderSoft,
    paddingVertical: spacing.lg,
    alignItems: 'center',
    gap: 2,
  },

  section: { marginTop: spacing.xxl, gap: spacing.md },
  features: { gap: spacing.md },
  feature: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.lg },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: radius.sm,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureText: { flex: 1, gap: spacing.xs },

  paceIntro: { marginTop: -spacing.xs },
  paces: { gap: spacing.md },
  pace: { gap: spacing.lg },
  paceCurrent: { borderColor: colors.primary, borderWidth: 1.5 },
  paceHeader: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.md },
  paceHeaderText: { flex: 1, gap: spacing.xs },
  paceFacts: { flexDirection: 'row', gap: spacing.md },
  paceFact: {
    flex: 1,
    backgroundColor: colors.surfaceMuted,
    borderRadius: radius.sm,
    paddingVertical: spacing.md,
    alignItems: 'center',
    gap: 1,
  },
  paceNote: { marginTop: spacing.sm },

  freeTitle: { marginTop: spacing.xs, marginBottom: spacing.xs },
  premiumButton: { marginTop: spacing.lg },
});
