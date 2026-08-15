import { isAiProxyConfigured } from '@/lib/env';
import { mockAIProvider } from './mockProvider';
import { remoteAIProvider } from './remoteProvider';
import type { AIProvider } from './types';

export const aiProvider: AIProvider = isAiProxyConfigured ? remoteAIProvider : mockAIProvider;

export { mockAIProvider, remoteAIProvider };
export { AIUserFacingError } from './types';
export type { AIProvider, ChatMessage, ChatTurnRequest, ChatTurnResponse } from './types';
