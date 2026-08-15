import { INITIAL_STREAK, isStreakAtRisk, recordActivity, visibleStreak } from '@/lib/streak';

const day = (iso: string) => new Date(`${iso}T10:00:00`);

describe('streak calculation', () => {
  it('starts a streak on the first study day', () => {
    const state = recordActivity(INITIAL_STREAK, day('2026-03-01'));
    expect(state.currentStreak).toBe(1);
    expect(state.longestStreak).toBe(1);
    expect(state.lastActivityDate).toBe('2026-03-01');
  });

  it('is idempotent within the same day', () => {
    const first = recordActivity(INITIAL_STREAK, day('2026-03-01'));
    const second = recordActivity(first, day('2026-03-01'));
    expect(second).toBe(first);
    expect(second.currentStreak).toBe(1);
  });

  it('extends the streak on consecutive days', () => {
    let state = recordActivity(INITIAL_STREAK, day('2026-03-01'));
    state = recordActivity(state, day('2026-03-02'));
    state = recordActivity(state, day('2026-03-03'));
    expect(state.currentStreak).toBe(3);
    expect(state.longestStreak).toBe(3);
  });

  it('resets after a missed day but keeps the longest streak', () => {
    let state = recordActivity(INITIAL_STREAK, day('2026-03-01'));
    state = recordActivity(state, day('2026-03-02'));
    state = recordActivity(state, day('2026-03-05'));
    expect(state.currentStreak).toBe(1);
    expect(state.longestStreak).toBe(2);
  });

  it('works across a month boundary', () => {
    let state = recordActivity(INITIAL_STREAK, day('2026-03-31'));
    state = recordActivity(state, day('2026-04-01'));
    expect(state.currentStreak).toBe(2);
  });

  it('keeps a streak visible on the day after the last activity', () => {
    const state = recordActivity(INITIAL_STREAK, day('2026-03-01'));
    expect(visibleStreak(state, day('2026-03-02'))).toBe(1);
  });

  it('hides a streak once a full day has been missed', () => {
    const state = recordActivity(INITIAL_STREAK, day('2026-03-01'));
    expect(visibleStreak(state, day('2026-03-03'))).toBe(0);
  });

  it('flags a streak as at risk exactly one day after the last activity', () => {
    const state = recordActivity(INITIAL_STREAK, day('2026-03-01'));
    expect(isStreakAtRisk(state, day('2026-03-01'))).toBe(false);
    expect(isStreakAtRisk(state, day('2026-03-02'))).toBe(true);
    expect(isStreakAtRisk(state, day('2026-03-04'))).toBe(false);
  });
});
