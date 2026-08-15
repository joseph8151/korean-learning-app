import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

import type { NotificationSettings } from '@/types/user';

export const DEFAULT_NOTIFICATION_SETTINGS: NotificationSettings = {
  dailyReminderEnabled: true,
  dailyReminderTime: '19:00',
  streakReminderEnabled: true,
  dailyKoreanEnabled: true,
};

const DAILY_REMINDER_IDENTIFIER = 'koreango-daily-reminder';

export function parseTime(value: string): { hour: number; minute: number } {
  const [hour, minute] = value.split(':').map(Number);
  return {
    hour: Number.isFinite(hour) ? Math.min(23, Math.max(0, hour)) : 19,
    minute: Number.isFinite(minute) ? Math.min(59, Math.max(0, minute)) : 0,
  };
}

export function formatTime(value: string): string {
  const { hour, minute } = parseTime(value);
  const suffix = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 === 0 ? 12 : hour % 12;
  return `${displayHour}:${`${minute}`.padStart(2, '0')} ${suffix}`;
}

/**
 * The MVP wires up permissions and one local daily reminder. Server-driven
 * push (streak saves, new Daily Korean) plugs in behind the same service.
 */
export const notificationService = {
  async requestPermission(): Promise<boolean> {
    try {
      const existing = await Notifications.getPermissionsAsync();
      if (existing.granted) return true;

      const requested = await Notifications.requestPermissionsAsync();
      return requested.granted;
    } catch {
      return false;
    }
  },

  async scheduleDailyReminder(settings: NotificationSettings): Promise<boolean> {
    try {
      await this.cancelDailyReminder();
      if (!settings.dailyReminderEnabled) return true;

      const granted = await this.requestPermission();
      if (!granted) return false;

      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('daily', {
          name: 'Daily reminder',
          importance: Notifications.AndroidImportance.DEFAULT,
        });
      }

      const { hour, minute } = parseTime(settings.dailyReminderTime);

      await Notifications.scheduleNotificationAsync({
        identifier: DAILY_REMINDER_IDENTIFIER,
        content: {
          title: 'Korean time 🇰🇷',
          body: 'Ten minutes today keeps your streak alive.',
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DAILY,
          hour,
          minute,
        },
      });

      return true;
    } catch {
      return false;
    }
  },

  async cancelDailyReminder(): Promise<void> {
    try {
      await Notifications.cancelScheduledNotificationAsync(DAILY_REMINDER_IDENTIFIER);
    } catch {
      // Nothing scheduled yet — safe to ignore.
    }
  },
};
