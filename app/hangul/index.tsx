import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText, AudioButton, Card, Screen } from '@/components/ui';
import { HANGUL_COMBINATIONS, HANGUL_STAGES } from '@/constants/content';
import { colors, radius, spacing } from '@/constants/theme';
import { useSpeak } from '@/hooks/useKoreanVoice';
import type { HangulCharacter } from '@/types/content';

export default function HangulScreen() {
  const router = useRouter();
  const [stageIndex, setStageIndex] = useState(0);
  const [selected, setSelected] = useState<HangulCharacter | null>(null);
  const { speak } = useSpeak();

  const stage = HANGUL_STAGES[stageIndex];

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
        <AppText variant="heading">Hangul</AppText>
        <AppText variant="caption" color={colors.textMuted}>
          Korean writing was designed to be learned fast. Tap any letter to hear it.
        </AppText>
      </View>

      <View style={styles.tabs}>
        {HANGUL_STAGES.map((item, index) => (
          <Pressable
            key={item.id}
            onPress={() => {
              setStageIndex(index);
              setSelected(null);
            }}
            accessibilityRole="tab"
            accessibilityState={{ selected: index === stageIndex }}
            accessibilityLabel={`${item.title}, ${item.subtitle}`}
            style={[styles.tab, index === stageIndex && styles.tabActive]}
          >
            <AppText
              variant="caption"
              color={index === stageIndex ? colors.white : colors.textMuted}
            >
              {item.title}
            </AppText>
          </Pressable>
        ))}
      </View>

      <AppText variant="caption" color={colors.textMuted} style={styles.stageSubtitle}>
        {stage.subtitle}
      </AppText>

      <View style={styles.grid}>
        {stage.data.map((character) => (
          <Pressable
            key={character.id}
            onPress={() => {
              setSelected(character);
              speak(character.exampleSyllable);
            }}
            accessibilityRole="button"
            accessibilityLabel={`${character.character}, pronounced ${character.romanization}`}
            style={({ pressed }) => [
              styles.cell,
              selected?.id === character.id && styles.cellActive,
              pressed && styles.pressed,
            ]}
          >
            <AppText variant="heading">{character.character}</AppText>
            <AppText variant="micro" color={colors.textMuted}>
              {character.romanization}
            </AppText>
          </Pressable>
        ))}
      </View>

      {selected ? (
        <Card style={styles.detail}>
          <AppText variant="koreanLarge" center>
            {selected.character}
          </AppText>
          <AppText variant="body" color={colors.textMuted} center>
            Pronunciation: {selected.romanization}
          </AppText>

          <View style={styles.exampleRow}>
            <View style={styles.example}>
              <AppText variant="korean" center>
                {selected.exampleSyllable}
              </AppText>
              <AppText variant="caption" color={colors.textMuted} center>
                {selected.exampleRomanization}
              </AppText>
            </View>
            <AudioButton text={selected.exampleSyllable} />
          </View>

          <View style={styles.tip}>
            <AppText variant="caption" color={colors.warningDeep}>
              💡 {selected.tip}
            </AppText>
          </View>
        </Card>
      ) : null}

      <View style={styles.combinations}>
        <AppText variant="subheading">Putting it together</AppText>
        <AppText variant="caption" color={colors.textMuted}>
          A consonant plus a vowel makes one syllable block.
        </AppText>

        <View style={styles.comboList}>
          {HANGUL_COMBINATIONS.map((combination) => (
            <Pressable
              key={combination.syllable}
              onPress={() => speak(combination.syllable)}
              accessibilityRole="button"
              accessibilityLabel={`${combination.consonant} plus ${combination.vowel} makes ${combination.syllable}, ${combination.romanization}`}
              style={({ pressed }) => [styles.combo, pressed && styles.pressed]}
            >
              <AppText variant="body" color={colors.textMuted}>
                {combination.consonant} + {combination.vowel} =
              </AppText>
              <AppText variant="subheading">{combination.syllable}</AppText>
              <AppText variant="caption" color={colors.textMuted}>
                {combination.romanization} · {combination.meaning}
              </AppText>
            </Pressable>
          ))}
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { paddingTop: spacing.lg, gap: spacing.xs },
  back: { width: 40, height: 40, justifyContent: 'center', marginLeft: -spacing.sm },
  tabs: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.xl },
  tab: {
    flex: 1,
    height: 44,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabActive: { backgroundColor: colors.primary },
  stageSubtitle: { marginTop: spacing.lg },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md, marginTop: spacing.md },
  cell: {
    width: 68,
    height: 68,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  cellActive: { borderColor: colors.primary, backgroundColor: colors.primarySoft },
  pressed: { opacity: 0.85 },
  detail: { marginTop: spacing.xl, gap: spacing.sm },
  exampleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xl,
    marginTop: spacing.lg,
  },
  example: { alignItems: 'center' },
  tip: {
    marginTop: spacing.lg,
    backgroundColor: colors.warningSoft,
    padding: spacing.md,
    borderRadius: radius.sm,
  },
  combinations: { marginTop: spacing.xxl, gap: spacing.xs },
  comboList: { gap: spacing.md, marginTop: spacing.lg },
  combo: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.lg,
    gap: 2,
    minHeight: 64,
  },
});
