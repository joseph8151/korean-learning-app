import {
  addDays,
  daysBetween,
  formatMinutes,
  greetingForHour,
  lastSevenDayKeys,
  toDateKey,
  weekdayInitial,
} from '@/lib/date';

describe('addDays', () => {
  it('moves forward and backward by whole calendar days', () => {
    expect(toDateKey(addDays(new Date(2026, 2, 10, 9, 30), 5))).toBe('2026-03-15');
    expect(toDateKey(addDays(new Date(2026, 2, 10, 9, 30), -5))).toBe('2026-03-05');
  });

  it('rolls over month and year boundaries', () => {
    expect(toDateKey(addDays(new Date(2026, 0, 30), 3))).toBe('2026-02-02');
    expect(toDateKey(addDays(new Date(2026, 11, 30), 3))).toBe('2027-01-02');
    // 2028 is a leap year.
    expect(toDateKey(addDays(new Date(2028, 1, 28), 1))).toBe('2028-02-29');
  });

  it('lands on the right calendar day across a daylight-saving shift', () => {
    // Days that gain or lose an hour are not 86,400,000 ms long. Adding raw
    // milliseconds lands on 23:00 the day before, which used to make the
    // weekly chart show a duplicated day.
    const beforeAutumnShift = new Date(2026, 9, 20, 0, 0, 0);
    const keys = Array.from({ length: 21 }, (_, index) =>
      toDateKey(addDays(beforeAutumnShift, index)),
    );
    expect(new Set(keys).size).toBe(21);
  });

  it('does not mutate the date it is given', () => {
    const original = new Date(2026, 5, 1);
    addDays(original, 10);
    expect(toDateKey(original)).toBe('2026-06-01');
  });
});

describe('lastSevenDayKeys', () => {
  it('returns seven distinct keys, oldest first, ending today', () => {
    const keys = lastSevenDayKeys(new Date(2026, 2, 15));
    expect(keys).toHaveLength(7);
    expect(new Set(keys).size).toBe(7);
    expect(keys[6]).toBe('2026-03-15');
    expect(keys[0]).toBe('2026-03-09');
    expect(daysBetween(keys[0], keys[6])).toBe(6);
  });
});

describe('weekdayInitial', () => {
  it('reads the weekday from the key rather than assuming a Monday start', () => {
    // 2026-03-15 is a Sunday.
    expect(weekdayInitial('2026-03-15')).toBe('S');
    expect(weekdayInitial('2026-03-16')).toBe('M');
    expect(weekdayInitial('2026-03-18')).toBe('W');
    expect(weekdayInitial('2026-03-20')).toBe('F');
  });

  it('labels a rolling window in the order the window actually runs', () => {
    // The chart plots the last seven days ending today, so on a Wednesday the
    // axis has to start on Thursday. A fixed M-T-W-T-F-S-S label list was
    // wrong on six days out of seven.
    const labels = lastSevenDayKeys(new Date(2026, 2, 18)).map(weekdayInitial);
    expect(labels).toEqual(['T', 'F', 'S', 'S', 'M', 'T', 'W']);
  });
});

describe('greetingForHour', () => {
  it('covers every hour of the day', () => {
    expect(greetingForHour(0)).toBe('Good night');
    expect(greetingForHour(4)).toBe('Good night');
    expect(greetingForHour(5)).toBe('Good morning');
    expect(greetingForHour(11)).toBe('Good morning');
    expect(greetingForHour(12)).toBe('Good afternoon');
    expect(greetingForHour(17)).toBe('Good afternoon');
    expect(greetingForHour(18)).toBe('Good evening');
    expect(greetingForHour(23)).toBe('Good evening');
  });
});

describe('formatMinutes', () => {
  it('switches to hours past sixty minutes', () => {
    expect(formatMinutes(0)).toBe('0 min');
    expect(formatMinutes(90)).toBe('1 min');
    expect(formatMinutes(3600)).toBe('1 h');
    expect(formatMinutes(5400)).toBe('1 h 30 min');
  });
});
