import * as Speech from 'expo-speech';

import { hasKoreanVoice } from '@/lib/voices';

const KOREAN_LOCALE = 'ko-KR';

export interface SpeakOptions {
  slow?: boolean;
}

/**
 * `unknown` means we could not ask the platform. Treat it as available: a
 * false warning on a phone that speaks fine is worse than no warning.
 */
export type KoreanVoiceStatus = 'available' | 'missing' | 'unknown';

let cachedStatus: KoreanVoiceStatus | null = null;
let inFlight: Promise<KoreanVoiceStatus> | null = null;

/**
 * MVP audio uses on-device TTS so every phrase is playable without shipping
 * audio files. Recorded audio URLs from Supabase Storage can be layered in
 * here later without touching any screen.
 *
 * The catch is that a Korean voice is not installed by default on every
 * Android phone. Without one, `speak` fails silently — the learner taps
 * Listen, hears nothing, and has no way to know why. So the voice list is
 * checked once and the UI can explain the fix.
 */
export const audioService = {
  speakKorean(text: string, options: SpeakOptions = {}) {
    if (!text.trim()) return;
    Speech.stop();
    Speech.speak(text, {
      language: KOREAN_LOCALE,
      rate: options.slow ? 0.45 : 0.85,
      pitch: 1.0,
      // A failure here means the engine rejected the utterance, which in
      // practice means the Korean voice data went missing after our check.
      onError: () => {
        cachedStatus = 'missing';
      },
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

  /** Cached after the first call; the voice list does not change mid-session. */
  async getKoreanVoiceStatus(): Promise<KoreanVoiceStatus> {
    if (cachedStatus) return cachedStatus;
    if (inFlight) return inFlight;

    inFlight = (async (): Promise<KoreanVoiceStatus> => {
      try {
        const voices = await Speech.getAvailableVoicesAsync();
        // An empty list is not proof of absence: some Android engines return
        // nothing until they finish initialising.
        if (voices.length === 0) return 'unknown';
        return hasKoreanVoice(voices) ? 'available' : 'missing';
      } catch {
        return 'unknown';
      } finally {
        inFlight = null;
      }
    })();

    cachedStatus = await inFlight;
    return cachedStatus;
  },
};
