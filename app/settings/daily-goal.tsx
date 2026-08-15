import { useRouter } from 'expo-router';

import { SettingsScreen } from '@/components/SettingsScreen';
import { SelectableChip } from '@/components/ui';
import { DAILY_GOAL_OPTIONS } from '@/constants/app';
import { useUserStore } from '@/store/useUserStore';
import type { DailyGoalMinutes } from '@/types/user';

const DESCRIPTIONS: Record<number, string> = {
  5: 'Casual — one phrase a day.',
  10: 'Recommended — a real habit.',
  15: 'Serious — steady progress.',
  20: 'Intense — fast improvement.',
  30: 'All in — conversation ready sooner.',
};

export default function DailyGoalSettingsScreen() {
  const router = useRouter();
  const dailyGoalMinutes = useUserStore((state) => state.dailyGoalMinutes);
  const setDailyGoal = useUserStore((state) => state.setDailyGoal);

  return (
    <SettingsScreen title="Daily Goal" subtitle="How much Korean per day feels right?">
      {DAILY_GOAL_OPTIONS.map((minutes) => (
        <SelectableChip
          key={minutes}
          label={`${minutes} min`}
          description={DESCRIPTIONS[minutes]}
          selected={dailyGoalMinutes === minutes}
          onPress={() => {
            setDailyGoal(minutes as DailyGoalMinutes);
            router.back();
          }}
        />
      ))}
    </SettingsScreen>
  );
}
