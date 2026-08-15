import { useState } from 'react';
import { Pressable, StyleSheet, Switch, View } from 'react-native';

import { SettingsScreen } from '@/components/SettingsScreen';
import { AppText, Card } from '@/components/ui';
import { colors, radius, spacing } from '@/constants/theme';
import { formatTime, notificationService } from '@/services/notifications';
import { useUserStore } from '@/store/useUserStore';

const REMINDER_TIMES = ['08:00', '12:00', '18:00', '19:00', '21:00'];

export default function NotificationSettingsScreen() {
  const notifications = useUserStore((state) => state.notifications);
  const setNotifications = useUserStore((state) => state.setNotifications);
  const [permissionDenied, setPermissionDenied] = useState(false);

  const applySchedule = async (next: typeof notifications) => {
    const scheduled = await notificationService.scheduleDailyReminder(next);
    setPermissionDenied(!scheduled && next.dailyReminderEnabled);
  };

  const toggle = (key: keyof typeof notifications, value: boolean) => {
    const next = { ...notifications, [key]: value };
    setNotifications({ [key]: value });
    if (key === 'dailyReminderEnabled') void applySchedule(next);
  };

  const pickTime = (time: string) => {
    const next = { ...notifications, dailyReminderTime: time };
    setNotifications({ dailyReminderTime: time });
    void applySchedule(next);
  };

  return (
    <SettingsScreen title="Notifications" subtitle="Gentle nudges, never spam.">
      <Card padded={false} style={styles.card}>
        <Row
          label="Daily Reminder"
          description={`Every day at ${formatTime(notifications.dailyReminderTime)}`}
          value={notifications.dailyReminderEnabled}
          onChange={(value) => toggle('dailyReminderEnabled', value)}
        />
        <Row
          label="Streak Reminder"
          description="A heads-up when your streak is about to break."
          value={notifications.streakReminderEnabled}
          onChange={(value) => toggle('streakReminderEnabled', value)}
        />
        <Row
          label="New Daily Korean"
          description="A new phrase every morning."
          value={notifications.dailyKoreanEnabled}
          onChange={(value) => toggle('dailyKoreanEnabled', value)}
          last
        />
      </Card>

      {permissionDenied ? (
        <View style={styles.notice}>
          <AppText variant="caption" color={colors.warning}>
            Notifications are turned off for KoreanGo in your device settings. Turn them on there
            to get reminders.
          </AppText>
        </View>
      ) : null}

      <AppText variant="micro" color={colors.textMuted} style={styles.sectionLabel}>
        REMINDER TIME
      </AppText>

      <View style={styles.times}>
        {REMINDER_TIMES.map((time) => (
          <TimeChip
            key={time}
            time={time}
            selected={notifications.dailyReminderTime === time}
            onPress={() => pickTime(time)}
          />
        ))}
      </View>

      <AppText variant="micro" color={colors.textSubtle} style={styles.footnote}>
        Reminders are scheduled on this device only. You can turn them off any time.
      </AppText>
    </SettingsScreen>
  );
}

function Row({
  label,
  description,
  value,
  onChange,
  last = false,
}: {
  label: string;
  description: string;
  value: boolean;
  onChange: (value: boolean) => void;
  last?: boolean;
}) {
  return (
    <View style={[styles.row, !last && styles.rowBorder]}>
      <View style={styles.rowText}>
        <AppText variant="body">{label}</AppText>
        <AppText variant="caption" color={colors.textMuted}>
          {description}
        </AppText>
      </View>
      <Switch
        value={value}
        onValueChange={onChange}
        accessibilityLabel={label}
        trackColor={{ true: colors.primary, false: colors.border }}
        thumbColor={colors.white}
      />
    </View>
  );
}

function TimeChip({
  time,
  selected,
  onPress,
}: {
  time: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.timeChip, selected && styles.timeChipSelected]}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      accessibilityLabel={formatTime(time)}
    >
      <AppText variant="caption" color={selected ? colors.white : colors.textMuted}>
        {formatTime(time)}
      </AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { overflow: 'hidden' },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    minHeight: 72,
  },
  rowBorder: { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.border },
  rowText: { flex: 1, gap: 2 },
  notice: { backgroundColor: colors.warningSoft, borderRadius: radius.md, padding: spacing.lg },
  sectionLabel: { marginTop: spacing.xl },
  times: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  timeChip: {
    paddingHorizontal: spacing.lg,
    height: 44,
    justifyContent: 'center',
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
  },
  timeChipSelected: { backgroundColor: colors.primary },
  footnote: { marginTop: spacing.xl },
});
