import { StyleSheet, View } from 'react-native';

import { AppText, AudioButton, Card, Tag } from '@/components/ui';
import { colors, spacing } from '@/constants/theme';
import type { LessonContent, Vocabulary } from '@/types/content';

export interface LessonStepViewProps {
  block: LessonContent;
  vocabulary: Vocabulary | null;
}

const STEP_LABEL: Record<LessonContent['contentType'], string> = {
  introduction: 'INTRODUCTION',
  vocabulary: 'VOCABULARY',
  expression: 'EXPRESSION',
  listening: 'LISTENING',
  speaking: 'SPEAKING',
  summary: 'SUMMARY',
};

export function LessonStepView({ block, vocabulary }: LessonStepViewProps) {
  const note = (block.metadata?.note as string | undefined) ?? null;
  const heading = (block.metadata?.heading as string | undefined) ?? null;
  const points = (block.metadata?.points as string[] | undefined) ?? null;

  return (
    <View style={styles.root}>
      <Tag label={STEP_LABEL[block.contentType]} backgroundColor={colors.primarySoft} color={colors.primary} />

      {block.contentType === 'introduction' ? (
        <Card style={styles.card}>
          <AppText variant="title">{heading}</AppText>
          <AppText variant="body" color={colors.textMuted} style={styles.body}>
            {block.englishText}
          </AppText>
        </Card>
      ) : null}

      {block.contentType === 'vocabulary' && vocabulary ? (
        <Card style={styles.card}>
          <AppText variant="koreanLarge" center>
            {vocabulary.korean}
          </AppText>
          <AppText variant="caption" color={colors.textMuted} center>
            {vocabulary.romanization}
          </AppText>
          <AppText variant="subheading" center style={styles.body}>
            {vocabulary.english}
          </AppText>

          {vocabulary.exampleKorean ? (
            <View style={styles.example}>
              <AppText variant="body" center>
                {vocabulary.exampleKorean}
              </AppText>
              <AppText variant="caption" color={colors.textMuted} center>
                {vocabulary.exampleEnglish}
              </AppText>
            </View>
          ) : null}

          <View style={styles.audioRow}>
            <AudioButton text={vocabulary.korean} />
            <AudioButton text={vocabulary.korean} label="Slow" slow />
          </View>
        </Card>
      ) : null}

      {['expression', 'listening', 'speaking'].includes(block.contentType) ? (
        <Card style={styles.card}>
          <AppText variant="korean" center>
            {block.koreanText}
          </AppText>
          <AppText variant="caption" color={colors.textMuted} center>
            {block.romanization}
          </AppText>
          <AppText variant="body" center style={styles.body}>
            {block.englishText}
          </AppText>

          {note ? (
            <View style={styles.note}>
              <AppText variant="caption" color={colors.warningDeep}>
                💡 {note}
              </AppText>
            </View>
          ) : null}

          <View style={styles.audioRow}>
            <AudioButton text={block.koreanText ?? ''} />
            <AudioButton text={block.koreanText ?? ''} label="Slow" slow />
          </View>
        </Card>
      ) : null}

      {block.contentType === 'summary' && points ? (
        <Card style={styles.card}>
          <AppText variant="heading">What you learned</AppText>
          <View style={styles.points}>
            {points.map((point) => (
              <View key={point} style={styles.point}>
                <AppText variant="body" color={colors.primaryDark}>
                  ✓
                </AppText>
                <AppText variant="body" style={styles.pointText}>
                  {point}
                </AppText>
              </View>
            ))}
          </View>
        </Card>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { gap: spacing.lg },
  card: { gap: spacing.xs },
  body: { marginTop: spacing.sm },
  example: {
    marginTop: spacing.xl,
    paddingTop: spacing.lg,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
    gap: spacing.xs,
  },
  note: {
    marginTop: spacing.lg,
    backgroundColor: colors.warningSoft,
    padding: spacing.md,
    borderRadius: spacing.md,
  },
  audioRow: { flexDirection: 'row', gap: spacing.md, marginTop: spacing.xl, justifyContent: 'center' },
  points: { gap: spacing.md, marginTop: spacing.lg },
  point: { flexDirection: 'row', gap: spacing.md, alignItems: 'flex-start' },
  pointText: { flex: 1 },
});
