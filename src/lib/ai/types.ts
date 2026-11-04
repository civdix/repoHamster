export type AIProviderType = 'groq' | 'gemini' | 'openai' | 'mock';

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface AIRequestOptions {
  assignmentTitle: string;
  language: string;
  framework: string;
  userMessage: string;
  history?: Array<{ role: 'user' | 'assistant'; content: string }>;
  maxOutputTokens?: number;
  temperature?: number;
}

export interface AIResponse {
  reply: string;
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  modelName: string;
  provider: AIProviderType;
  fallbackUsed?: boolean;
  error?: string;
}

export interface IAIProvider {
  readonly providerType: AIProviderType;
  readonly isConfigured: boolean;
  readonly defaultModel: string;
  generateSocraticHint(options: AIRequestOptions): Promise<AIResponse>;
}
