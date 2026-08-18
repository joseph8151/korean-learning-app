import { Ionicons } from '@expo/vector-icons';
import { useAudioPlayer, useAudioRecorder, RecordingPresets } from 'expo-audio';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Alert, Linking, Pressable, StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { Bouncy, Reveal, useReduceMotion } from '@/components/motion';
import { AppButton, AppText, AudioButton, Card, ChunkyButton, Screen } from '@/components/ui';
import { colors, depth, radius, spacing } from '@/constants/theme';
import {
  assessAttempt,
  MAX_RECORDING_SECONDS,
  recordingService,
  type MicPermission,
} from '@/services/recording';
import { useProgressStore } from '@/store/useProgressStore';

const PHRASES = [
  { korean: '안녕하세요. 저는 알렉스예요.', english: "Hello. I'm Alex.", romanization: 'annyeonghaseyo. jeoneun alekseuyeyo.' },
  { korean: '아메리카노 한 잔 주세요.', english: 'One americano, please.', romanization: 'amerikano han jan juseyo.' },
  { korean: '이거 얼마예요?', english: 'How much is this?', romanization: 'igeo eolmayeyo?' },
  { korean: '천천히 말해 주세요.', english: 'Please speak slowly.', romanization: 'cheoncheonhi malhae juseyo.' },
  { korean: '만나서 반가워요.', english: 'Nice to meet you.', romanization: 'mannaseo bangawoyo.' },
];

type Phase = 'idle' | 'recording' | 'recorded';

/**
 * Shadowing practice: hear it, say it, hear yourself against it.
 *
 * There is deliberately no pronunciation score. Grading a learner's Korean
 * needs a speech model we do not have, and a number invented from clip length
 * would be worse than none — people trust scores. Hearing your own attempt
 * next to the native audio is what actually surfaces the difference, and it
 * is the technique language teachers use anyway.
 *
 * Recordings never leave the device and are deleted as soon as the learner
 * moves on. See services/recording.ts.
 */
export default function SpeakingPracticeScreen() {
  const router = useRouter();
  const reduceMotion = useReduceMotion();
  const recordSpeakingPractice = useProgressStore((state) => state.recordSpeakingPractice);

  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>('idle');
  const [permission, setPermission] = useState<MicPermission | null>(null);
  const [clipUri, setClipUri] = useState<string | null>(null);

  const recorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const player = useAudioPlayer(clipUri ? { uri: clipUri } : null);

  const startedAt = useRef(0);
  const autoStop = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pulse = useSharedValue(0);

  const phrase = PHRASES[index];
  const isLast = index === PHRASES.length - 1;

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: 1 + pulse.value * 0.12 }],
  }));

  // The pulse follows the phase rather than being poked from the press
  // handlers: a shared value passed to a hook must not be mutated inside a
  // memoised callback, and "animate while recording" is the real rule anyway.
  useEffect(() => {
    if (phase !== 'recording' || reduceMotion) {
      pulse.value = withSpring(0, depth.spring.settle);
      return;
    }

    pulse.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 520, easing: Easing.out(Easing.quad) }),
        withTiming(0, { duration: 520, easing: Easing.inOut(Easing.quad) }),
      ),
      -1,
      false,
    );
  }, [phase, reduceMotion, pulse]);

  // Put the device in record-and-playback mode on entry, and hand it back on
  // exit so audio elsewhere in the app behaves normally.
  useEffect(() => {
    void recordingService.prepareSession();
    return () => {
      void recordingService.endSession();
    };
  }, []);

  // Never leave a voice clip behind when the screen goes away.
  useEffect(
    () => () => {
      if (autoStop.current) clearTimeout(autoStop.current);
      void recordingService.discard(clipUri);
    },
    [clipUri],
  );

  const stopRecording = useCallback(async () => {
    if (autoStop.current) {
      clearTimeout(autoStop.current);
      autoStop.current = null;
    }

    const seconds = (Date.now() - startedAt.current) / 1000;

    try {
      await recorder.stop();
    } catch {
      setPhase('idle');
      return;
    }

    const quality = assessAttempt(seconds);
    if (!quality.usable) {
      // Too short to be an attempt — say so rather than playing back silence.
      await recordingService.discard(recorder.uri);
      setPhase('idle');
      if (quality.reason === 'too-short') {
        Alert.alert('That was very short', 'Hold the button while you say the whole phrase.');
      }
      return;
    }

    recordSpeakingPractice(Math.max(1, Math.round(seconds)));
    setClipUri(recorder.uri);
    setPhase('recorded');
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => undefined);
  }, [recorder, recordSpeakingPractice]);

  const startRecording = useCallback(async () => {
    let granted = permission;
    if (granted !== 'granted') {
      granted = await recordingService.requestPermission();
      setPermission(granted);
    }

    if (granted === 'unavailable') {
      Alert.alert(
        'Recording is not available',
        'This build cannot use the microphone. Everything else on this screen still works — listen and repeat out loud.',
      );
      return;
    }

    if (granted === 'denied') {
      Alert.alert(
        'Microphone access is off',
        'KoreanGo needs the microphone to record your attempt. Recordings stay on this phone and are deleted when you move on.',
        [
          { text: 'Not now', style: 'cancel' },
          { text: 'Open Settings', onPress: () => void Linking.openSettings() },
        ],
      );
      return;
    }

    // A previous take is replaced, not accumulated.
    await recordingService.discard(clipUri);
    setClipUri(null);

    try {
      await recorder.prepareToRecordAsync();
      recorder.record();
    } catch {
      Alert.alert('Could not start recording', 'Please try again.');
      return;
    }

    startedAt.current = Date.now();
    setPhase('recording');
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => undefined);

    // A finger that slips off the button must not leave the mic open.
    autoStop.current = setTimeout(() => void stopRecording(), MAX_RECORDING_SECONDS * 1000);
  }, [clipUri, permission, recorder, stopRecording]);

  const playBack = () => {
    if (!clipUri) return;
    player.seekTo(0);
    player.play();
  };

  const next = async () => {
    await recordingService.discard(clipUri);
    setClipUri(null);
    setPhase('idle');

    if (isLast) {
      router.back();
      return;
    }
    setIndex((value) => value + 1);
  };

  const retry = async () => {
    await recordingService.discard(clipUri);
    setClipUri(null);
    setPhase('idle');
  };

  return (
    <Screen>
      <View style={styles.header}>
        <Bouncy
          onPress={() => router.back()}
          scaleTo={0.9}
          accessibilityLabel="Close speaking practice"
          hitSlop={12}
          style={styles.back}
        >
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </Bouncy>
        <AppText variant="micro" color={colors.textMuted}>
          {index + 1} / {PHRASES.length}
        </AppText>
      </View>

      <Reveal index={0}>
        <Card style={styles.phraseCard}>
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
            <AudioButton text={phrase.korean} label="Native" />
            <AudioButton text={phrase.korean} label="Slow" slow />
          </View>
        </Card>
      </Reveal>

      {phase === 'recorded' ? (
        <Reveal index={1}>
          <Card style={styles.compareCard}>
            <AppText variant="overline" color={colors.textSubtle}>
              COMPARE
            </AppText>
            <AppText variant="caption" color={colors.textMuted} style={styles.compareHint}>
              Play them one after the other. The gap you hear is the thing to
              work on — usually the vowel or where the stress lands.
            </AppText>

            <View style={styles.compareRow}>
              <AudioButton text={phrase.korean} label="Native" style={styles.compareButton} />
              <Bouncy
                onPress={playBack}
                haptic
                accessibilityLabel="Play your recording"
                style={[styles.compareButton, styles.yourButton]}
              >
                <Ionicons name="person" size={18} color={colors.accentDeep} />
                <AppText variant="caption" color={colors.accentDeep}>
                  You
                </AppText>
              </Bouncy>
            </View>
          </Card>
        </Reveal>
      ) : null}

      <View style={styles.micArea}>
        {phase === 'recorded' ? (
          <View style={styles.actions}>
            <ChunkyButton label={isLast ? 'Finish' : 'Next phrase'} onPress={() => void next()} />
            <AppButton label="Record again" variant="ghost" onPress={() => void retry()} />
          </View>
        ) : (
          <>
            <Animated.View style={pulseStyle}>
              <Pressable
                onPressIn={() => void startRecording()}
                onPressOut={() => void stopRecording()}
                accessibilityRole="button"
                accessibilityLabel="Hold to speak"
                accessibilityHint="Press and hold while you say the phrase out loud"
                style={[styles.mic, phase === 'recording' && styles.micActive]}
              >
                <Ionicons name="mic" size={36} color={colors.white} />
              </Pressable>
            </Animated.View>

            <AppText variant="caption" color={colors.textMuted} center style={styles.micLabel}>
              {phase === 'recording' ? 'Listening… release when done' : 'Hold to speak'}
            </AppText>
            <AppText variant="micro" color={colors.textSubtle} center>
              Stays on your phone. Deleted when you move on.
            </AppText>
          </>
        )}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: spacing.lg,
  },
  back: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center', marginLeft: -spacing.sm },

  phraseCard: { gap: spacing.sm, marginTop: spacing.lg },
  english: { marginTop: spacing.xs },
  audioRow: { flexDirection: 'row', gap: spacing.md, justifyContent: 'center', marginTop: spacing.lg },

  compareCard: { marginTop: spacing.lg },
  compareHint: { marginTop: spacing.xs, marginBottom: spacing.lg },
  compareRow: { flexDirection: 'row', gap: spacing.md },
  compareButton: { flex: 1 },
  yourButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    height: 48,
    borderRadius: radius.pill,
    backgroundColor: colors.accentSoft,
  },

  micArea: { alignItems: 'center', paddingTop: spacing.xxxl, gap: spacing.sm },
  mic: {
    width: 96,
    height: 96,
    borderRadius: radius.pill,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  micActive: { backgroundColor: colors.accentDeep },
  micLabel: { marginTop: spacing.lg },
  actions: { alignSelf: 'stretch', gap: spacing.sm },
});
