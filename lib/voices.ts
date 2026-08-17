/**
 * Whether a text-to-speech voice can read Korean.
 *
 * Platforms disagree on the tag: Android reports `ko_KR`, iOS reports `ko-KR`,
 * and some Android OEM engines report a bare `ko`. Matching the language
 * subtag rather than the full tag covers all three.
 */
export function isKoreanVoice(language: string): boolean {
  return language.replace('_', '-').toLowerCase().split('-')[0] === 'ko';
}

export function hasKoreanVoice(voices: readonly { language: string }[]): boolean {
  return voices.some((voice) => isKoreanVoice(voice.language));
}
