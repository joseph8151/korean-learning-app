import { hasKoreanVoice, isKoreanVoice } from '@/lib/voices';

describe('isKoreanVoice', () => {
  it('accepts every tag format the platforms actually emit', () => {
    // Android
    expect(isKoreanVoice('ko_KR')).toBe(true);
    // iOS
    expect(isKoreanVoice('ko-KR')).toBe(true);
    // Some Android OEM engines report a bare subtag.
    expect(isKoreanVoice('ko')).toBe(true);
    expect(isKoreanVoice('KO-KR')).toBe(true);
  });

  it('rejects other languages, including ones that start with the same letters', () => {
    expect(isKoreanVoice('en-US')).toBe(false);
    expect(isKoreanVoice('ja-JP')).toBe(false);
    expect(isKoreanVoice('kok-IN')).toBe(false); // Konkani
    expect(isKoreanVoice('')).toBe(false);
  });
});

describe('hasKoreanVoice', () => {
  it('finds Korean anywhere in the list', () => {
    expect(
      hasKoreanVoice([{ language: 'en-US' }, { language: 'ja-JP' }, { language: 'ko_KR' }]),
    ).toBe(true);
  });

  it('reports false for a list with no Korean voice', () => {
    expect(hasKoreanVoice([{ language: 'en-US' }, { language: 'ja-JP' }])).toBe(false);
  });

  it('reports false for an empty list', () => {
    // The service treats empty as "unknown" rather than "missing", because
    // some Android engines return nothing until they finish initialising.
    expect(hasKoreanVoice([])).toBe(false);
  });
});
