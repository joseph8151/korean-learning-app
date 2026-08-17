import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { Confetti, CountUp, Reveal, useReduceMotion } from '@/components/motion';
import { AppButton, AppText, Card, ChunkyButton, Screen } from '@/components/ui';
import { ACHIEVEMENTS } from '@/constants/content';
import { colors, depth, radius, spacing, undersides } from '@/constants/theme';
import { selectCompletedLessonCount, useProgressStore } from '@/store/useProgressStore';
import { useUserStore } from '@/store/useUserStore';
import type { AchievementId } from '@/types/user';

export default function LessonCompleteScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    lessonId?: string;
    score?: string;
    total?: string;
    xp?: string;
    streak?: string;
    words?: string;
    achievements?: string;
  }>();

  const score = Number(params.score ?? '0');
  const total = Number(params.total ?? '0');
  const xp = Number(params.xp ?? '0');
  const streak = Number(params.streak ?? '0');
  const words = Number(params.words ?? '0');

  const unlockedIds = (params.achievements ?? '')
    .split(',')
    .filter(Boolean) as AchievementId[];
  const unlocked = ACHIEVEMENTS.filter((achievement) => unlockedIds.includes(achievement.id));

  // Nudge guests to sign up once they have progress worth keeping, rather
  // than gating the app behind an account up front.
  const isGuest = useUserStore((state) => state.isGuest);
  const lessonsCompleted = useProgressStore(selectCompletedLessonCount);
  const showSignUpPrompt = isGuest && lessonsCompleted >= 1;

  const perfect = total > 0 && score === total;

  return (
    <Screen
      footer={
        <View style={styles.footer}>
          <ChunkyButton label="Continue" onPress={() => router.replace('/(tabs)')} />
          <AppButton
            label="Practice Again"
            variant="ghost"
            onPress={() => router.replace('/practice/quick-quiz')}
          />
        </View>
      }
    >
      <Confetti count={perfect ? 46 : 30} />

      <View style={styles.content}>
        <CelebrationSeal perfect={perfect} />

        <Reveal delay={220}>
          <AppText variant="display" center>
            {perfect ? 'Perfect!' : 'Lesson Complete!'}
          </AppText>
          <AppText variant="body" color={colors.textMuted} center style={styles.subtitle}>
            You practised {words} new {words === 1 ? 'word' : 'words'}.
          </AppText>
        </Reveal>

        <Reveal delay={340}>
          <View style={styles.stats}>
            <Stat
              label="Score"
              value={total > 0 ? `${score}/${total}` : '—'}
              tint={colors.primarySoft}
              shadow={undersides.surface}
            />
            <Stat
              label="Earned"
              count={xp}
              prefix="+"
              suffix=" XP"
              tint={colors.secondarySoft}
              shadow={undersides.secondary}
            />
            <Stat
              label="Streak"
              count={streak}
              suffix=" 🔥"
              tint={colors.accentSoft}
              shadow={undersides.accent}
            />
          </View>
        </Reveal>

        {showSignUpPrompt ? (
          <Reveal delay={460}>
            <Card style={styles.signUp}>
              <AppText variant="subheading">Keep this progress</AppText>
              <AppText variant="caption" color={colors.textMuted}>
                You&apos;re learning as a guest. Create a free account so your streak, XP
                and saved words follow you to any device.
              </AppText>
              <AppButton
                label="Create Free Account"
                variant="outline"
                style={styles.signUpButton}
                onPress={() => router.push('/auth/sign-up')}
              />
            </Card>
          </Reveal>
        ) : null}

        {unlocked.map((achievement, index) => (
          <Animated.View
            key={achievement.id}
            entering={FadeInDown.springify().damping(12).delay(560 + index * 140)}
          >
            <Card style={styles.achievement}>
              <View style={styles.achievementMedal}>
                <AppText variant="title">{achievement.emoji}</AppText>
              </View>
              <View style={styles.achievementText}>
                <AppText variant="overline" color={colors.warningDeep}>
                  NEW ACHIEVEMENT
                </AppText>
                <AppText variant="bodyStrong">{achievement.title}</AppText>
                <AppText variant="caption" color={colors.textMuted}>
                  {achievement.description}
                </AppText>
              </View>
            </Card>
          </Animated.View>
        ))}
      </View>
    </Screen>
  );
}

/**
 * The badge lands, overshoots, and settles — a stamp being pressed down. The
 * slight rotation on the way in is what stops it feeling machine-generated.
 */
function CelebrationSeal({ perfect }: { perfect: boolean }) {
  const scale = useSharedValue(0);
  const reduceMotion = useReduceMotion();

  useEffect(() => {
    if (reduceMotion) {
      scale.value = 1;
      return;
    }
    scale.value = withSequence(
      withTiming(0, { duration: 0 }),
      withDelay(90, withSpring(1, depth.spring.bouncy)),
    );
  }, [scale, reduceMotion]);

  const style = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }, { rotate: `${(1 - scale.value) * -18}deg` }],
  }));

  return (
    <Animated.View
      style={[styles.seal, style]}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    >
      <View style={styles.sealUnderside} />
      <View style={[styles.sealFace, perfect && styles.sealFacePerfect]}>
        <AppText style={styles.sealEmoji}>{perfect ? '🏆' : '🎉'}</AppText>
      </View>
    </Animated.View>
  );
}

interface StatProps {
  label: string;
  value?: string;
  count?: number;
  prefix?: string;
  suffix?: string;
  tint: string;
  shadow: string;
}

function Stat({ label, value, count, prefix, suffix, tint, shadow }: StatProps) {
  return (
    <View style={styles.statWrap}>
      <View style={[styles.statUnderside, { backgroundColor: shadow }]} />
      <View style={[styles.stat, { backgroundColor: tint }]}>
        {count === undefined ? (
          <AppText variant="subheading" center>
            {value}
          </AppText>
        ) : (
          <CountUp
            value={count}
            prefix={prefix}
            suffix={suffix}
            variant="subheading"
            center
            duration={1000}
          />
        )}
        <AppText variant="micro" color={colors.textMuted} center>
          {label}
        </AppText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  content: { flex: 1, justifyContent: 'center', paddingVertical: spacing.xxl },
  subtitle: { marginTop: spacing.sm },

  seal: { alignSelf: 'center', marginBottom: spacing.xl },
  sealUnderside: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 7,
    bottom: -7,
    borderRadius: radius.pill,
    backgroundColor: undersides.primary,
  },
  sealFace: {
    width: 116,
    height: 116,
    borderRadius: radius.pill,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 5,
    borderColor: colors.white,
  },
  sealFacePerfect: { backgroundColor: colors.secondary },
  sealEmoji: { fontSize: 54, lineHeight: 64 },

  stats: { flexDirection: 'row', gap: spacing.md, marginTop: spacing.xxl },
  statWrap: { flex: 1, position: 'relative', marginBottom: depth.lift },
  statUnderside: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: depth.lift,
    bottom: -depth.lift,
    borderRadius: radius.md,
    opacity: 0.4,
  },
  stat: { borderRadius: radius.md, paddingVertical: spacing.lg, gap: spacing.xs },

  signUp: { marginTop: spacing.xl, gap: spacing.sm },
  signUpButton: { marginTop: spacing.md },

  achievement: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
    marginTop: spacing.lg,
  },
  achievementMedal: {
    width: 60,
    height: 60,
    borderRadius: radius.pill,
    backgroundColor: colors.secondarySoft,
    borderWidth: 3,
    borderColor: colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  achievementText: { flex: 1, gap: 2 },
  footer: { gap: spacing.sm },
});
