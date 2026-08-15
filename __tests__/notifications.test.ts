import { formatTime, parseTime } from '@/services/notifications';

describe('reminder time parsing', () => {
  it('parses a 24-hour time string', () => {
    expect(parseTime('19:00')).toEqual({ hour: 19, minute: 0 });
    expect(parseTime('08:30')).toEqual({ hour: 8, minute: 30 });
  });

  it('clamps out-of-range values instead of scheduling an invalid trigger', () => {
    expect(parseTime('25:99')).toEqual({ hour: 23, minute: 59 });
    expect(parseTime('-4:-4')).toEqual({ hour: 0, minute: 0 });
  });

  it('falls back to the default evening slot for unparseable input', () => {
    expect(parseTime('not-a-time')).toEqual({ hour: 19, minute: 0 });
    expect(parseTime('')).toEqual({ hour: 19, minute: 0 });
  });
});

describe('reminder time formatting', () => {
  it('formats as 12-hour time with a suffix', () => {
    expect(formatTime('19:00')).toBe('7:00 PM');
    expect(formatTime('08:05')).toBe('8:05 AM');
  });

  it('shows midnight and noon as 12, not 0', () => {
    expect(formatTime('00:00')).toBe('12:00 AM');
    expect(formatTime('12:00')).toBe('12:00 PM');
  });
});
