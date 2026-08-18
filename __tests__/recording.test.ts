import {
  assessAttempt,
  MAX_RECORDING_SECONDS,
  MIN_RECORDING_SECONDS,
} from '@/services/recording';

/**
 * `assessAttempt` only catches the two mechanical failures — a tap that
 * captured nothing, and a button held down by accident. It is deliberately
 * not a pronunciation score: length says nothing about accuracy, and a made-up
 * number would be trusted.
 */
describe('assessAttempt', () => {
  it('accepts a normal attempt', () => {
    expect(assessAttempt(2.5)).toEqual({ usable: true, reason: 'ok' });
  });

  it('rejects a tap that captured nothing', () => {
    expect(assessAttempt(0.1).usable).toBe(false);
    expect(assessAttempt(0.1).reason).toBe('too-short');
    expect(assessAttempt(0).usable).toBe(false);
  });

  it('rejects a button held down by accident', () => {
    expect(assessAttempt(MAX_RECORDING_SECONDS + 1).reason).toBe('too-long');
  });

  it('accepts exactly the boundaries', () => {
    expect(assessAttempt(MIN_RECORDING_SECONDS).usable).toBe(true);
    expect(assessAttempt(MAX_RECORDING_SECONDS).usable).toBe(true);
  });

  it('rejects nonsense rather than passing it to the player', () => {
    // A clock that jumps backwards produces these, and a NaN duration would
    // otherwise sail through into playback.
    expect(assessAttempt(Number.NaN).usable).toBe(false);
    expect(assessAttempt(Number.POSITIVE_INFINITY).usable).toBe(false);
    expect(assessAttempt(-3).usable).toBe(false);
  });

  it('keeps the limits sane relative to each other', () => {
    expect(MIN_RECORDING_SECONDS).toBeGreaterThan(0);
    expect(MAX_RECORDING_SECONDS).toBeGreaterThan(MIN_RECORDING_SECONDS);
  });
});
