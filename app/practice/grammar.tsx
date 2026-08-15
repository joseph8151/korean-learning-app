import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText, AudioButton, Card, Screen } from '@/components/ui';
import { colors, spacing } from '@/constants/theme';

interface GrammarPoint {
  id: string;
  pattern: string;
  meaning: string;
  explanation: string;
  examples: { korean: string; english: string }[];
}

const GRAMMAR_POINTS: GrammarPoint[] = [
  {
    id: 'juseyo',
    pattern: '~ 주세요',
    meaning: 'Please give me / please do ~',
    explanation: 'Attach 주세요 to a noun to ask for it, or to a verb stem + 아/어 to ask someone to do it.',
    examples: [
      { korean: '물 주세요.', english: 'Water, please.' },
      { korean: '천천히 말해 주세요.', english: 'Please speak slowly.' },
    ],
  },
  {
    id: 'topic-particle',
    pattern: '은 / 는',
    meaning: 'Topic marker',
    explanation: 'Marks what the sentence is about. 은 after a consonant, 는 after a vowel.',
    examples: [
      { korean: '저는 학생이에요.', english: 'I am a student.' },
      { korean: '오늘은 바빠요.', english: 'Today I am busy.' },
    ],
  },
  {
    id: 'eseo-wasseoyo',
    pattern: '~에서 왔어요',
    meaning: 'I came from ~',
    explanation: 'Place + 에서 왔어요 states where you are from. 에서 marks the origin of the movement.',
    examples: [
      { korean: '미국에서 왔어요.', english: 'I came from the United States.' },
      { korean: '어느 나라에서 왔어요?', english: 'Which country are you from?' },
    ],
  },
  {
    id: 'past-tense',
    pattern: '~았어요 / ~었어요',
    meaning: 'Past tense, polite',
    explanation: 'Verb stems with ㅏ/ㅗ take 았어요; everything else takes 었어요.',
    examples: [
      { korean: '밥 먹었어요.', english: 'I ate.' },
      { korean: '어제 갔어요.', english: 'I went yesterday.' },
    ],
  },
  {
    id: 'anayo',
    pattern: '~아/어도 돼요?',
    meaning: 'May I ~?',
    explanation: 'Asks permission politely. Very common when shopping or visiting someone.',
    examples: [
      { korean: '입어 봐도 돼요?', english: 'Can I try it on?' },
      { korean: '여기 앉아도 돼요?', english: 'May I sit here?' },
    ],
  },
];

export default function GrammarPracticeScreen() {
  const router = useRouter();

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
        <AppText variant="heading">Grammar</AppText>
        <AppText variant="caption" color={colors.textMuted}>
          The patterns behind the sentences you already know.
        </AppText>
      </View>

      <View style={styles.list}>
        {GRAMMAR_POINTS.map((point) => (
          <Card key={point.id} style={styles.card}>
            <AppText variant="korean">{point.pattern}</AppText>
            <AppText variant="bodyStrong" color={colors.primary}>
              {point.meaning}
            </AppText>
            <AppText variant="caption" color={colors.textMuted} style={styles.explanation}>
              {point.explanation}
            </AppText>

            <View style={styles.examples}>
              {point.examples.map((example) => (
                <View key={example.korean} style={styles.example}>
                  <View style={styles.exampleText}>
                    <AppText variant="body">{example.korean}</AppText>
                    <AppText variant="caption" color={colors.textMuted}>
                      {example.english}
                    </AppText>
                  </View>
                  <AudioButton text={example.korean} compact />
                </View>
              ))}
            </View>
          </Card>
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { paddingTop: spacing.lg, gap: spacing.xs },
  back: { width: 40, height: 40, justifyContent: 'center', marginLeft: -spacing.sm },
  list: { gap: spacing.lg, paddingTop: spacing.xl },
  card: { gap: spacing.xs },
  explanation: { marginTop: spacing.sm },
  examples: {
    marginTop: spacing.lg,
    paddingTop: spacing.lg,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
    gap: spacing.md,
  },
  example: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  exampleText: { flex: 1, gap: 2 },
});
