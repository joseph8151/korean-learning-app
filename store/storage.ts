import AsyncStorage from '@react-native-async-storage/async-storage';
import { createJSONStorage } from 'zustand/middleware';

export const asyncStorage = createJSONStorage(() => AsyncStorage);

export const STORAGE_KEYS = {
  user: 'koreango.user.v1',
  progress: 'koreango.progress.v1',
} as const;
