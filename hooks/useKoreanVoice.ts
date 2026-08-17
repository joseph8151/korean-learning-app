import { useCallback, useEffect, useState } from 'react';
import { Alert, Platform } from 'react-native';

import { audioService, type KoreanVoiceStatus, type SpeakOptions } from '@/services/audio';

// Written for someone who has never opened Android settings on purpose.
const SETUP_STEPS = Platform.select({
  android:
    'Your phone does not have a Korean voice installed yet, so there is nothing to play.\n\n' +
    'Open Settings → General management → Text-to-speech (on some phones: System → Languages & input ' +
    '→ Text-to-speech output), tap the gear next to your speech engine, and install the Korean ' +
    'language pack.\n\nEverything else in KoreanGo works without it.',
  ios:
    'Your phone does not have a Korean voice installed yet, so there is nothing to play.\n\n' +
    'Open Settings → Accessibility → Spoken Content → Voices → Korean and download a voice.\n\n' +
    'Everything else in KoreanGo works without it.',
  default: 'Your phone does not have a Korean voice installed yet, so there is nothing to play.',
});

/**
 * Whether this phone can actually speak Korean. Starts as `unknown`, which the
 * UI treats as working — audio controls stay normal until we know otherwise,
 * so nothing flickers into a warning state on launch.
 */
export function useKoreanVoice(): KoreanVoiceStatus {
  const [status, setStatus] = useState<KoreanVoiceStatus>('unknown');

  useEffect(() => {
    let cancelled = false;

    void audioService.getKoreanVoiceStatus().then((result) => {
      if (!cancelled) setStatus(result);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  return status;
}

export interface SpeakControls {
  speak: (text: string, options?: SpeakOptions) => void;
  /** True when the phone has no Korean voice, so controls can look inert. */
  muted: boolean;
}

/**
 * Speaks Korean, or explains why it cannot. Every audio control in the app
 * goes through this: silence with no explanation reads as a broken app, and
 * a missing Korean voice is common enough on Android to be worth handling
 * properly rather than hoping.
 */
export function useSpeak(): SpeakControls {
  const status = useKoreanVoice();
  const muted = status === 'missing';

  const speak = useCallback(
    (text: string, options?: SpeakOptions) => {
      if (muted) {
        Alert.alert('Korean audio is not set up', SETUP_STEPS);
        return;
      }
      audioService.speakKorean(text, options);
    },
    [muted],
  );

  return { speak, muted };
}
