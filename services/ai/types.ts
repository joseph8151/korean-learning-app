export type ChatRole = 'user' | 'assistant';

export interface ChatMessage {
  id: string;
  role: ChatRole;
  korean: string;
  english: string;
  romanization: string;
  /** Present when the assistant suggests a more natural way to say something. */
  suggestion?: { korean: string; english: string } | null;
}

export interface ChatTurnRequest {
  situationId: string;
  history: ChatMessage[];
  userText: string;
}

export interface ChatTurnResponse {
  reply: ChatMessage;
  hint: { korean: string; english: string } | null;
}

/**
 * Implementations must never hold a model API key on the device. The remote
 * provider talks to a Supabase Edge Function (or any trusted backend) that
 * owns the secret.
 */
export interface AIProvider {
  readonly id: string;
  readonly isMock: boolean;
  sendTurn(request: ChatTurnRequest): Promise<ChatTurnResponse>;
}
