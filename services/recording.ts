import { Platform } from 'react-native';

/**
 * Microphone access for speaking practice.
 *
 * Two rules this module exists to keep:
 *
 * 1. **Nothing is uploaded.** A recording never leaves the device. There is no
 *    network call anywhere in this file, and there is no pronunciation score,
 *    because scoring a learner's Korean accurately needs a speech model we do
 *    not have — a made-up number would be worse than none.
 * 2. **Clips are deleted.** `discard` runs when the learner moves on, when the
 *    screen unmounts, and before a re-record. A voice recording left on disk
 *    after it has been listened to is a liability, not a feature.
 *
 * expo-audio is a native module, so it is loaded lazily and everything degrades
 * to "unavailable" rather than throwing in Expo Go or on web.
 */
type AudioModule = typeof import('expo-audio');

let audioModule: AudioModule | null = null;
let loadAttempted = false;

function loadAudio(): AudioModule | null {
  if (loadAttempted) return audioModule;
  loadAttempted = true;

  if (Platform.OS !== 'android' && Platform.OS !== 'ios') return null;

  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    audioModule = require('expo-audio') as AudioModule;
  } catch {
    audioModule = null;
  }

  return audioModule;
}

export type MicPermission = 'granted' | 'denied' | 'unavailable';

export const recordingService = {
  get isAvailable() {
    return loadAudio() !== null;
  },

  /**
   * Asks for the microphone. Returns `denied` rather than throwing so the
   * screen can explain and offer the rest of the exercise without it.
   */
  async requestPermission(): Promise<MicPermission> {
    const audio = loadAudio();
    if (!audio) return 'unavailable';

    try {
      const { granted } = await audio.requestRecordingPermissionsAsync();
      return granted ? 'granted' : 'denied';
    } catch {
      return 'unavailable';
    }
  },

  /**
   * Puts the device into a mode that both records and plays back through the
   * main speaker. Without this, playback on iOS comes out of the earpiece at
   * a whisper and the whole exercise seems broken.
   */
  async prepareSession(): Promise<void> {
    const audio = loadAudio();
    if (!audio) return;

    try {
      await audio.setAudioModeAsync({
        allowsRecording: true,
        playsInSilentMode: true,
      });
    } catch {
      // Non-fatal: recording may still work, just quieter on playback.
    }
  },

  /** Releases the recording mode so other audio behaves normally again. */
  async endSession(): Promise<void> {
    const audio = loadAudio();
    if (!audio) return;

    try {
      await audio.setAudioModeAsync({ allowsRecording: false, playsInSilentMode: true });
    } catch {
      // Nothing useful to do — the next screen sets its own mode.
    }
  },

  /**
   * Deletes a clip from disk. Safe to call with a stale or missing uri, which
   * matters because it runs from unmount paths where the file may already be
   * gone.
   */
  async discard(uri: string | null): Promise<void> {
    if (!uri) return;

    try {
      // The `File` class rather than the deprecated `deleteAsync`. `exists` is
      // checked first because `delete()` throws on a missing file.
      const { File } = await import('expo-file-system');
      const file = new File(uri);
      if (file.exists) file.delete();
    } catch {
      // Clips live in the app's cache directory, which the OS clears on its
      // own, so a failed delete is not worth surfacing to a learner.
    }
  },
};

/** The shortest clip worth keeping. Below this it is a mis-tap, not an attempt. */
export const MIN_RECORDING_SECONDS = 0.6;

/** Above this we stop on our own, so a pocket recording cannot run forever. */
export const MAX_RECORDING_SECONDS = 15;

export interface AttemptQuality {
  usable: boolean;
  reason: 'ok' | 'too-short' | 'too-long';
}

/**
 * Whether an attempt is worth playing back.
 *
 * Deliberately not a pronunciation score — length says nothing about accuracy.
 * It only catches the two mechanical failures: a tap that recorded nothing,
 * and a button held down by accident.
 */
export function assessAttempt(seconds: number): AttemptQuality {
  if (!Number.isFinite(seconds) || seconds < MIN_RECORDING_SECONDS) {
    return { usable: false, reason: 'too-short' };
  }
  if (seconds > MAX_RECORDING_SECONDS) return { usable: false, reason: 'too-long' };
  return { usable: true, reason: 'ok' };
}
