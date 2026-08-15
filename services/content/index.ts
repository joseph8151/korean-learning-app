import { isSupabaseConfigured } from '@/lib/env';
import { localContentSource } from './localContentSource';
import { supabaseContentSource } from './supabaseContentSource';
import type { ContentSource } from './types';

export const contentService: ContentSource = isSupabaseConfigured
  ? supabaseContentSource
  : localContentSource;

export type { ContentSource, VocabularyQuery } from './types';
export { localContentSource };
