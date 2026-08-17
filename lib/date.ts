export const MS_PER_DAY = 86_400_000;

/** Local calendar date as YYYY-MM-DD. */
export function toDateKey(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function fromDateKey(key: string): Date {
  const [year, month, day] = key.split('-').map(Number);
  return new Date(year, month - 1, day);
}

export function daysBetween(fromKey: string, toKey: string): number {
  const from = fromDateKey(fromKey).getTime();
  const to = fromDateKey(toKey).getTime();
  return Math.round((to - from) / MS_PER_DAY);
}

/**
 * Adds whole days, preserving the wall-clock time of day.
 *
 * Deliberately not `time + days * MS_PER_DAY`: a day that gains or loses an
 * hour to daylight saving is not 86,400,000 ms long, so the arithmetic version
 * lands on 23:00 the day before and `toDateKey` then reports the wrong
 * calendar date. `setDate` overflows across month and year ends on its own.
 */
export function addDays(date: Date, days: number): Date {
  const result = new Date(date.getTime());
  result.setDate(result.getDate() + days);
  return result;
}

const WEEKDAY_INITIALS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'] as const;

/** Single-letter weekday for a YYYY-MM-DD key, for compact chart axes. */
export function weekdayInitial(key: string): string {
  return WEEKDAY_INITIALS[fromDateKey(key).getDay()];
}

export function formatMinutes(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return rest === 0 ? `${hours} h` : `${hours} h ${rest} min`;
}

export function greetingForHour(hour: number): string {
  if (hour < 5) return 'Good night';
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

/** Last 7 date keys, oldest first, ending today. */
export function lastSevenDayKeys(today: Date = new Date()): string[] {
  return Array.from({ length: 7 }, (_, index) => toDateKey(addDays(today, index - 6)));
}
