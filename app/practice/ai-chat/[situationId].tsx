import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText, EmptyState } from '@/components/ui';
import { CHAT_SITUATIONS } from '@/constants/content';
import { colors, layout, radius, spacing } from '@/constants/theme';
import { useSpeak } from '@/hooks/useKoreanVoice';
import { AIUserFacingError, aiProvider, type ChatMessage } from '@/services/ai';
import { useProgressStore } from '@/store/useProgressStore';

export default function AIChatScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { situationId } = useLocalSearchParams<{ situationId: string }>();
  const recordConversationCompleted = useProgressStore((state) => state.recordConversationCompleted);
  const { speak } = useSpeak();

  const situation = useMemo(
    () => CHAT_SITUATIONS.find((item) => item.id === situationId) ?? null,
    [situationId],
  );

  const [messages, setMessages] = useState<ChatMessage[]>(() =>
    situation
      ? [
          {
            id: 'opening',
            role: 'assistant',
            korean: situation.openingLine.korean,
            english: situation.openingLine.english,
            romanization: situation.openingLine.romanization,
            suggestion: null,
          },
        ]
      : [],
  );
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [showTranslation, setShowTranslation] = useState(true);
  const [hint, setHint] = useState<{ korean: string; english: string } | null>(null);
  const [showHint, setShowHint] = useState(false);
  const listRef = useRef<FlatList<ChatMessage>>(null);

  if (!situation) {
    return (
      <View style={styles.root}>
        <EmptyState
          title="Situation not found"
          message="Pick another situation to start practising."
          actionLabel="Back"
          onAction={() => router.back()}
        />
      </View>
    );
  }

  const send = async () => {
    const text = input.trim();
    if (!text || sending) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      korean: text,
      english: '',
      romanization: '',
      suggestion: null,
    };

    const history = [...messages, userMessage];
    setMessages(history);
    setInput('');
    setSending(true);
    setShowHint(false);

    try {
      const response = await aiProvider.sendTurn({
        situationId: situation.id,
        history,
        userText: text,
      });
      setMessages((current) => [...current, response.reply]);
      setHint(response.hint);

      if (history.filter((message) => message.role === 'user').length >= 3) {
        recordConversationCompleted();
      }
    } catch (caught) {
      const english =
        caught instanceof AIUserFacingError
          ? caught.message
          : 'Something went wrong. Please try again.';

      setMessages((current) => [
        ...current,
        {
          id: `error-${Date.now()}`,
          role: 'assistant',
          korean: '',
          english,
          romanization: '',
          suggestion: null,
        },
      ]);
    } finally {
      setSending(false);
      requestAnimationFrame(() => listRef.current?.scrollToEnd({ animated: true }));
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.root, { paddingTop: insets.top }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={0}
    >
      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel="Leave conversation"
          hitSlop={12}
          style={styles.back}
        >
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </Pressable>

        <View style={styles.headerText}>
          <AppText variant="bodyStrong">
            {situation.emoji} {situation.title}
          </AppText>
          <AppText variant="micro" color={colors.textMuted}>
            {situation.description}
          </AppText>
        </View>

        <Pressable
          onPress={() => setShowTranslation((value) => !value)}
          accessibilityRole="switch"
          accessibilityState={{ checked: showTranslation }}
          accessibilityLabel="Toggle English translation"
          style={styles.toggle}
          hitSlop={8}
        >
          <AppText variant="micro" color={showTranslation ? colors.primary : colors.textSubtle}>
            EN
          </AppText>
        </Pressable>
      </View>

      <FlatList
        ref={listRef}
        data={messages}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: true })}
        renderItem={({ item }) => (
          <MessageBubble message={item} showTranslation={showTranslation} />
        )}
      />

      {sending ? (
        <View style={styles.typing}>
          <ActivityIndicator size="small" color={colors.primary} />
          <AppText variant="micro" color={colors.textMuted}>
            입력 중…
          </AppText>
        </View>
      ) : null}

      {showHint && hint ? (
        <View style={styles.hint}>
          <AppText variant="micro" color={colors.warningDeep}>
            TRY SAYING
          </AppText>
          <Pressable
            onPress={() => setInput(hint.korean)}
            accessibilityRole="button"
            accessibilityLabel={`Use the hint: ${hint.korean}`}
          >
            <AppText variant="body">{hint.korean}</AppText>
            <AppText variant="caption" color={colors.textMuted}>
              {hint.english}
            </AppText>
          </Pressable>
        </View>
      ) : null}

      <View style={[styles.composer, { paddingBottom: insets.bottom + spacing.md }]}>
        <View style={styles.tools}>
          <ToolButton
            label="Hint"
            icon="bulb-outline"
            active={showHint}
            onPress={() => setShowHint((value) => !value)}
          />
          <ToolButton
            label="Slow"
            icon="play-outline"
            onPress={() => {
              const last = [...messages].reverse().find((message) => message.role === 'assistant');
              if (last?.korean) speak(last.korean, { slow: true });
            }}
          />
          <ToolButton
            label={showTranslation ? 'Hide EN' : 'Translate'}
            icon="language-outline"
            active={showTranslation}
            onPress={() => setShowTranslation((value) => !value)}
          />
        </View>

        <View style={styles.inputRow}>
          <TextInput
            value={input}
            onChangeText={setInput}
            placeholder="한국어로 답해 보세요…"
            placeholderTextColor={colors.textSubtle}
            style={styles.input}
            multiline
            accessibilityLabel="Type your reply in Korean"
            onSubmitEditing={send}
          />
          <Pressable
            onPress={send}
            disabled={!input.trim() || sending}
            accessibilityRole="button"
            accessibilityLabel="Send message"
            accessibilityState={{ disabled: !input.trim() || sending }}
            style={[styles.send, (!input.trim() || sending) && styles.sendDisabled]}
          >
            <Ionicons name="arrow-up" size={20} color={colors.white} />
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

function MessageBubble({
  message,
  showTranslation,
}: {
  message: ChatMessage;
  showTranslation: boolean;
}) {
  const isUser = message.role === 'user';
  const { speak } = useSpeak();

  return (
    <View style={[styles.bubbleRow, isUser && styles.bubbleRowUser]}>
      <View style={[styles.bubble, isUser ? styles.bubbleUser : styles.bubbleAssistant]}>
        {message.korean ? (
          <AppText variant="body" color={isUser ? colors.white : colors.text}>
            {message.korean}
          </AppText>
        ) : null}

        {!isUser && message.romanization ? (
          <AppText variant="micro" color={colors.textSubtle}>
            {message.romanization}
          </AppText>
        ) : null}

        {!isUser && showTranslation && message.english ? (
          <AppText variant="caption" color={colors.textMuted} style={styles.translation}>
            {message.english}
          </AppText>
        ) : null}

        {message.suggestion ? (
          <View style={styles.suggestion}>
            <AppText variant="micro" color={colors.successDeep}>
              MORE NATURAL
            </AppText>
            <AppText variant="caption">{message.suggestion.korean}</AppText>
            <AppText variant="micro" color={colors.textMuted}>
              {message.suggestion.english}
            </AppText>
          </View>
        ) : null}
      </View>

      {!isUser && message.korean ? (
        <Pressable
          onPress={() => speak(message.korean)}
          accessibilityRole="button"
          accessibilityLabel={`Play: ${message.korean}`}
          style={styles.play}
          hitSlop={8}
        >
          <Ionicons name="volume-medium-outline" size={18} color={colors.primary} />
        </Pressable>
      ) : null}
    </View>
  );
}

function ToolButton({
  label,
  icon,
  active = false,
  onPress,
}: {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  active?: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ selected: active }}
      style={[styles.tool, active && styles.toolActive]}
    >
      <Ionicons name={icon} size={15} color={active ? colors.primary : colors.textMuted} />
      <AppText variant="micro" color={active ? colors.primary : colors.textMuted}>
        {label}
      </AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  back: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  headerText: { flex: 1, gap: 2 },
  toggle: {
    width: 40,
    height: 32,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
  },
  list: {
    padding: spacing.lg,
    gap: spacing.md,
    maxWidth: layout.maxContentWidth,
    width: '100%',
    alignSelf: 'center',
  },
  bubbleRow: { flexDirection: 'row', alignItems: 'flex-end', gap: spacing.sm },
  bubbleRowUser: { justifyContent: 'flex-end' },
  bubble: { maxWidth: '78%', borderRadius: radius.lg, padding: spacing.lg, gap: 2 },
  bubbleAssistant: { backgroundColor: colors.surface, borderTopLeftRadius: radius.sm },
  bubbleUser: { backgroundColor: colors.primary, borderTopRightRadius: radius.sm },
  translation: { marginTop: spacing.xs },
  suggestion: {
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
    gap: 2,
  },
  play: { width: 32, height: 32, alignItems: 'center', justifyContent: 'center' },
  typing: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, paddingHorizontal: spacing.xl },
  hint: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.sm,
    backgroundColor: colors.warningSoft,
    borderRadius: radius.md,
    padding: spacing.lg,
    gap: 2,
  },
  composer: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    gap: spacing.md,
  },
  tools: { flexDirection: 'row', gap: spacing.sm },
  tool: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    backgroundColor: colors.background,
  },
  toolActive: { backgroundColor: colors.primarySoft },
  inputRow: { flexDirection: 'row', alignItems: 'flex-end', gap: spacing.md },
  input: {
    flex: 1,
    minHeight: 48,
    maxHeight: 120,
    borderRadius: radius.md,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
    fontSize: 16,
    color: colors.text,
  },
  send: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendDisabled: { opacity: 0.4 },
});
