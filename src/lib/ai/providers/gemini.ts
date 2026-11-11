import { BaseAIProvider } from './base';
import type { IAIProvider, AIProviderType, AIRequestOptions, AIResponse } from '../types';

export class GeminiProvider extends BaseAIProvider implements IAIProvider {
  readonly providerType: AIProviderType = 'gemini';
  readonly defaultModel: string;
  private apiKey: string;

  constructor(apiKey?: string, model?: string) {
    super();
    this.apiKey = apiKey || process.env.GEMINI_API_KEY || '';
    this.defaultModel = model || process.env.GEMINI_MODEL || 'gemini-1.5-flash';
  }

  get isConfigured(): boolean {
    return Boolean(this.apiKey && this.apiKey.trim().length > 0);
  }

  async generateSocraticHint(options: AIRequestOptions): Promise<AIResponse> {
    if (!this.isConfigured) {
      throw new Error('GeminiProvider: GEMINI_API_KEY is not configured.');
    }

    const systemPrompt = this.buildSystemPrompt(options);
    const contents: any[] = [];

    // Prior conversation history
    if (options.history && options.history.length > 0) {
      for (const h of options.history) {
        contents.push({
          role: h.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: h.content }],
        });
      }
    }

    // Current user message
    contents.push({
      role: 'user',
      parts: [{ text: options.userMessage }],
    });

    const maxTokens = options.maxOutputTokens || parseInt(process.env.DEFAULT_AI_MAX_OUTPUT_TOKENS || '600', 10);
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${this.defaultModel}:generateContent?key=${this.apiKey}`;

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        systemInstruction: {
          parts: [{ text: systemPrompt }],
        },
        contents,
        generationConfig: {
          maxOutputTokens: maxTokens,
          temperature: options.temperature ?? 0.7,
        },
      }),
    });

    if (!response.ok) {
      const errBody = await response.text().catch(() => '');
      const err: any = new Error(`Gemini API error (${response.status}): ${errBody || response.statusText}`);
      err.status = response.status;
      err.statusCode = response.status;
      throw err;
    }

    const data = await response.json();
    const candidate = data.candidates?.[0];
    const reply = candidate?.content?.parts?.[0]?.text || '';

    const promptTokens = data.usageMetadata?.promptTokenCount ?? this.estimateTokens(options.userMessage);
    const completionTokens = data.usageMetadata?.candidatesTokenCount ?? this.estimateTokens(reply);
    const totalTokens = data.usageMetadata?.totalTokenCount ?? (promptTokens + completionTokens);

    return {
      reply,
      promptTokens,
      completionTokens,
      totalTokens,
      modelName: this.defaultModel,
      provider: 'gemini',
    };
  }
}
