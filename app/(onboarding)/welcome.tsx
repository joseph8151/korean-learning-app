import { useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import {
  Dimensions,
  FlatList,
  Pressable,
  StyleSheet,
  View,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from 'react-native';

import { AppButton, AppText, Screen } from '@/components/ui';
import { colors, radius, spacing } from '@/constants/theme';

interface Slide {
  id: string;
  emoji: string;
  title: string;
  body: string;
  tint: string;
}

const SLIDES: Slide[] = [
  {
    id: 'your-way',
    emoji: '🎧',
    title: 'Learn Korean Your Way',
    body: 'Short lessons designed for real life — not a textbook.',
    tint: colors.primarySoft,
  },
  {
    id: 'day-one',
    emoji: '💬',
    title: 'Speak From Day One',
    body: 'Learn the Korean people actually use in Seoul cafes, taxis and group chats.',
    tint: colors.secondarySoft,
  },
  {
    id: 'ten-minutes',
    emoji: '⏱️',
    title: 'Learn Just 10 Minutes a Day',
    body: 'One coffee break is enough. Small daily wins beat weekend cramming.',
    tint: colors.accentSoft,
  },
  {
    id: 'connect',
    emoji: '🌏',
    title: 'Travel. Work. Connect.',
    body: 'Order food, make friends, handle your job — in Korean.',
    tint: colors.successSoft,
  },
];

const { width } = Dimensions.get('window');

export default function WelcomeScreen() {
  const router = useRouter();
  const [index, setIndex] = useState(0);
  const listRef = useRef<FlatList<Slide>>(null);

  const isLast = index === SLIDES.length - 1;

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const next = Math.round(event.nativeEvent.contentOffset.x / event.nativeEvent.layoutMeasurement.width);
    if (next !== index) setIndex(next);
  };

  const goNext = () => {
    if (isLast) {
      router.push('/(onboarding)/goals');
      return;
    }
    listRef.current?.scrollToIndex({ index: index + 1, animated: true });
    setIndex(index + 1);
  };

  return (
    <Screen
      scroll={false}
      padded={false}
      footer={
        <View style={styles.footer}>
          <AppButton
            label={isLast ? 'Get Started' : 'Next'}
            size="lg"
            onPress={goNext}
            accessibilityHint={isLast ? 'Starts setting up your learning plan' : 'Shows the next slide'}
          />
          <Pressable
            onPress={() => router.push('/(onboarding)/goals')}
            accessibilityRole="button"
            accessibilityLabel="Skip the introduction"
            style={styles.skip}
            hitSlop={12}
          >
            <AppText variant="caption" color={colors.textMuted}>
              Skip
            </AppText>
          </Pressable>
        </View>
      }
    >
      <FlatList
        ref={listRef}
        data={SLIDES}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
        renderItem={({ item }) => (
          <View style={[styles.slide, { width }]}>
            <View style={[styles.art, { backgroundColor: item.tint }]}>
              <AppText style={styles.emoji}>{item.emoji}</AppText>
            </View>
            <AppText variant="title" center style={styles.title}>
              {item.title}
            </AppText>
            <AppText variant="body" color={colors.textMuted} center style={styles.body}>
              {item.body}
            </AppText>
          </View>
        )}
      />

      <View style={styles.dots} accessibilityLabel={`Slide ${index + 1} of ${SLIDES.length}`}>
        {SLIDES.map((slide, dotIndex) => (
          <View
            key={slide.id}
            style={[styles.dot, dotIndex === index && styles.dotActive]}
          />
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  slide: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
    gap: spacing.lg,
  },
  art: {
    width: 200,
    height: 200,
    borderRadius: radius.xl * 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xl,
  },
  emoji: { fontSize: 84, lineHeight: 96 },
  title: { paddingHorizontal: spacing.lg },
  body: { maxWidth: 320 },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.xl,
  },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.border },
  dotActive: { width: 24, backgroundColor: colors.primary },
  footer: { gap: spacing.md },
  skip: { alignSelf: 'center', padding: spacing.sm },
});
