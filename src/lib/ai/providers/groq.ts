import { BaseAIProvider } from './base';
import type { IAIProvider, AIProviderType, AIRequestOptions, AIResponse } from '../types';

export class GroqProvider extends BaseAIProvider implements IAIProvider {
  readonly providerType: AIProviderType = 'groq';
  readonly defaultModel: string;
  private apiKey: string;
  private endpoint = 'https://api.groq.com/openai/v1/chat/completions';

  constructor(apiKey?: string, model?: string) {
    super();
    this.apiKey = apiKey || process.env.GROQ_API_KEY || '';
    this.defaultModel = model || process.env.GROQ_MODEL || 'llama-3.3-70b-versatile';
  }

  get isConfigured(): boolean {
    return Boolean(this.apiKey && this.apiKey.trim().length > 0);
  }

  async generateSocraticHint(options: AIRequestOptions): Promise<AIResponse> {
    if (!this.isConfigured) {
      throw new Error('GroqProvider: GROQ_API_KEY is not configured.');
    }

    const systemPrompt = this.buildSystemPrompt(options);
    const messages = [
      { role: 'system', content: systemPrompt },
      ...(options.history || []).map((h) => ({ role: h.role, content: h.content })),
      { role: 'user', content: options.userMessage },
    ];

    const maxTokens = options.maxOutputTokens || parseInt(process.env.DEFAULT_AI_MAX_OUTPUT_TOKENS || '600', 10);
    const temperature = options.temperature ?? 0.6;

    const response = await fetch(this.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: this.defaultModel,
        messages,
        max_tokens: maxTokens,
        temperature,
      }),
    });

    if (!response.ok) {
      const errBody = await response.text().catch(() => '');
      throw new Error(`Groq API error (${response.status}): ${errBody || response.statusText}`);
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || '';
    const promptTokens = data.usage?.prompt_tokens ?? this.estimateTokens(options.userMessage);
    const completionTokens = data.usage?.completion_tokens ?? this.estimateTokens(reply);
    const totalTokens = data.usage?.total_tokens ?? (promptTokens + completionTokens);

    return {
      reply,
      promptTokens,
      completionTokens,
      totalTokens,
      modelName: data.model || this.defaultModel,
      provider: 'groq',
    };
  }
}
