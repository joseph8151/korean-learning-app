import * as Speech from 'expo-speech';

const KOREAN_LOCALE = 'ko-KR';

export interface SpeakOptions {
  slow?: boolean;
}

/**
 * MVP audio uses on-device TTS so every phrase is playable without shipping
 * audio files. Recorded audio URLs from Supabase Storage can be layered in
 * here later without touching any screen.
 */
export const audioService = {
  speakKorean(text: string, options: SpeakOptions = {}) {
    if (!text.trim()) return;
    Speech.stop();
    Speech.speak(text, {
      language: KOREAN_LOCALE,
      rate: options.slow ? 0.45 : 0.85,
      pitch: 1.0,
    });
  },

  stop() {
    Speech.stop();
  },

  async isSpeaking() {
    try {
      return await Speech.isSpeakingAsync();
    } catch {
      return false;
    }
  },
};
