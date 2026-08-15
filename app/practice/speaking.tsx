import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import { Animated, Pressable, StyleSheet, View } from 'react-native';

import { AppButton, AppText, AudioButton, Card, Screen } from '@/components/ui';
import { colors, radius, spacing } from '@/constants/theme';
import { useProgressStore } from '@/store/useProgressStore';

const PHRASES = [
  { korean: '안녕하세요. 저는 알렉스예요.', english: "Hello. I'm Alex.", romanization: 'annyeonghaseyo. jeoneun alekseuyeyo.' },
  { korean: '아메리카노 한 잔 주세요.', english: 'One americano, please.', romanization: 'amerikano han jan juseyo.' },
  { korean: '이거 얼마예요?', english: 'How much is this?', romanization: 'igeo eolmayeyo?' },
  { korean: '천천히 말해 주세요.', english: 'Please speak slowly.', romanization: 'cheoncheonhi malhae juseyo.' },
  { korean: '만나서 반가워요.', english: 'Nice to meet you.', romanization: 'mannaseo bangawoyo.' },
];

type Phase = 'idle' | 'recording' | 'done';

/**
 * MVP speaking flow: listen, hold to speak, self-assess. Recording capture and
 * AI pronunciation scoring plug into this same screen through a speaking
 * service without changing the UX.
 */
export default function SpeakingPracticeScreen() {
  const router = useRouter();
  const recordSpeakingPractice = useProgressStore((state) => state.recordSpeakingPractice);

  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>('idle');
  const [pulse] = useState(() => new Animated.Value(1));
  const startedAt = useRef(0);

  const phrase = PHRASES[index];
  const isLast = index === PHRASES.length - 1;

  const startRecording = () => {
    setPhase('recording');
    startedAt.current = Date.now();
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => undefined);
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1.12, duration: 550, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 1, duration: 550, useNativeDriver: true }),
      ]),
    ).start();
  };

  const stopRecording = () => {
    pulse.stopAnimation();
    pulse.setValue(1);
    const seconds = Math.max(1, Math.round((Date.now() - startedAt.current) / 1000));
    recordSpeakingPractice(seconds);
    setPhase('done');
  };

  const goNext = () => {
    if (isLast) {
      router.back();
      return;
    }
    setIndex(index + 1);
    setPhase('idle');
  };

  return (
    <Screen
      footer={
        phase === 'done' ? (
          <View style={styles.footer}>
            <AppButton label={isLast ? 'Finish' : 'Next'} size="lg" onPress={goNext} />
            <AppButton label="Try Again" variant="outline" onPress={() => setPhase('idle')} />
          </View>
        ) : null
      }
    >
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
        <AppText variant="heading">Speak Korean</AppText>
        <AppText variant="caption" color={colors.textMuted}>
          Listen first, then say it out loud. {index + 1} of {PHRASES.length}
        </AppText>
      </View>

      <Card style={styles.card}>
        <AppText variant="korean" center>
          {phrase.korean}
        </AppText>
        <AppText variant="caption" color={colors.textMuted} center>
          {phrase.romanization}
        </AppText>
        <AppText variant="body" center style={styles.english}>
          {phrase.english}
        </AppText>

        <View style={styles.audioRow}>
          <AudioButton text={phrase.korean} />
          <AudioButton text={phrase.korean} label="Slow" slow />
        </View>
      </Card>

      <View style={styles.micArea}>
        {phase === 'done' ? (
          <View style={styles.doneBox}>
            <AppText variant="title" center>
              🎉
            </AppText>
            <AppText variant="subheading" center>
              Great!
            </AppText>
            <AppText variant="caption" color={colors.textMuted} center>
              Compare with the audio and try once more if it felt off.
            </AppText>
          </View>
        ) : (
          <>
            <Animated.View style={{ transform: [{ scale: pulse }] }}>
              <Pressable
                onPressIn={startRecording}
                onPressOut={stopRecording}
                accessibilityRole="button"
                accessibilityLabel="Hold to speak"
                accessibilityHint="Press and hold while you say the phrase out loud"
                style={[styles.mic, phase === 'recording' && styles.micActive]}
              >
                <Ionicons name="mic" size={36} color={colors.white} />
              </Pressable>
            </Animated.View>

            <AppText variant="caption" color={colors.textMuted} center style={styles.micLabel}>
              {phase === 'recording' ? 'Listening… release when done' : 'Hold to Speak'}
            </AppText>
          </>
        )}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { paddingTop: spacing.lg, gap: spacing.xs },
  back: { width: 40, height: 40, justifyContent: 'center', marginLeft: -spacing.sm },
  card: { marginTop: spacing.xl, gap: spacing.xs },
  english: { marginTop: spacing.sm },
  audioRow: { flexDirection: 'row', gap: spacing.md, marginTop: spacing.xl, justifyContent: 'center' },
  micArea: { alignItems: 'center', marginTop: spacing.xxxl, gap: spacing.lg },
  mic: {
    width: 104,
    height: 104,
    borderRadius: 52,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  micActive: { backgroundColor: colors.accent },
  micLabel: { marginTop: spacing.sm },
  doneBox: {
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.successSoft,
    borderRadius: radius.xl,
    padding: spacing.xl,
    alignSelf: 'stretch',
  },
  footer: { gap: spacing.md },
});
