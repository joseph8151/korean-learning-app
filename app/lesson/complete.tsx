import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Animated, StyleSheet, View } from 'react-native';

import { AppButton, AppText, Card, Screen } from '@/components/ui';
import { ACHIEVEMENTS } from '@/constants/content';
import { colors, radius, spacing } from '@/constants/theme';
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

  const [scale] = useState(() => new Animated.Value(0.85));

  useEffect(() => {
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, friction: 6 }).start();
  }, [scale]);

  return (
    <Screen
      footer={
        <View style={styles.footer}>
          <AppButton label="Continue" size="lg" onPress={() => router.replace('/(tabs)')} />
          <AppButton
            label="Practice Again"
            variant="outline"
            onPress={() => router.replace('/practice/quick-quiz')}
          />
        </View>
      }
    >
      <View style={styles.content}>
        <Animated.Text style={[styles.emoji, { transform: [{ scale }] }]}>🎉</Animated.Text>

        <AppText variant="title" center>
          Lesson Complete!
        </AppText>
        <AppText variant="body" color={colors.textMuted} center>
          You practised {words} new {words === 1 ? 'word' : 'words'}.
        </AppText>

        <View style={styles.stats}>
          <Stat label="Score" value={total > 0 ? `${score} / ${total}` : '—'} tint={colors.primarySoft} />
          <Stat label="Earned" value={`+${xp} XP`} tint={colors.secondarySoft} />
          <Stat label="Streak" value={`${streak} 🔥`} tint={colors.accentSoft} />
        </View>

        {showSignUpPrompt ? (
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
        ) : null}

        {unlocked.length > 0 ? (
          <Card style={styles.achievements}>
            <AppText variant="micro" color={colors.primary}>
              NEW ACHIEVEMENT{unlocked.length > 1 ? 'S' : ''}
            </AppText>
            {unlocked.map((achievement) => (
              <View key={achievement.id} style={styles.achievement}>
                <AppText variant="heading">{achievement.emoji}</AppText>
                <View style={styles.achievementText}>
                  <AppText variant="bodyStrong">{achievement.title}</AppText>
                  <AppText variant="caption" color={colors.textMuted}>
                    {achievement.description}
                  </AppText>
                </View>
              </View>
            ))}
          </Card>
        ) : null}
      </View>
    </Screen>
  );
}

function Stat({ label, value, tint }: { label: string; value: string; tint: string }) {
  return (
    <View style={[styles.stat, { backgroundColor: tint }]} accessibilityLabel={`${label}: ${value}`}>
      <AppText variant="subheading" center>
        {value}
      </AppText>
      <AppText variant="micro" color={colors.textMuted} center>
        {label}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  content: { flex: 1, justifyContent: 'center', gap: spacing.md, paddingVertical: spacing.xxl },
  emoji: { fontSize: 72, lineHeight: 84, textAlign: 'center' },
  stats: { flexDirection: 'row', gap: spacing.md, marginTop: spacing.xl },
  stat: { flex: 1, borderRadius: radius.md, paddingVertical: spacing.lg, gap: 2 },
  signUp: { marginTop: spacing.lg, gap: spacing.sm },
  signUpButton: { marginTop: spacing.md },
  achievements: { marginTop: spacing.lg, gap: spacing.lg },
  achievement: { flexDirection: 'row', alignItems: 'center', gap: spacing.lg },
  achievementText: { flex: 1, gap: 2 },
  footer: { gap: spacing.md },
});
