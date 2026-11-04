import type { IAIProvider, AIProviderType, AIRequestOptions, AIResponse } from './types';
import { GroqProvider } from './providers/groq';
import { GeminiProvider } from './providers/gemini';
import { OpenAIProvider } from './providers/openai';
import { MockSocraticProvider } from './providers/mock';

export class AIFactory {
  private static providerInstances = new Map<AIProviderType, IAIProvider>();

  /**
   * Instantiates or retrieves a singleton instance of an AI provider by type.
   */
  public static createProvider(type: AIProviderType): IAIProvider {
    if (this.providerInstances.has(type)) {
      return this.providerInstances.get(type)!;
    }

    let provider: IAIProvider;
    switch (type) {
      case 'groq':
        provider = new GroqProvider();
        break;
      case 'gemini':
        provider = new GeminiProvider();
        break;
      case 'openai':
        provider = new OpenAIProvider();
        break;
      case 'mock':
      default:
        provider = new MockSocraticProvider();
        break;
    }

    this.providerInstances.set(type, provider);
    return provider;
  }

  /**
   * Resolves the best available AI provider based on preference and environment configuration.
   * Priority:
   * 1. Explicit preferred type (if configured)
   * 2. AI_PROVIDER env setting
   * 3. Automatic detection of API keys (GROQ -> GEMINI -> OPENAI)
   * 4. Reliable MockSocraticProvider fallback
   */
  public static resolveProvider(preferredType?: string): IAIProvider {
    const requested = (preferredType || process.env.AI_PROVIDER || '').toLowerCase() as AIProviderType;

    // 1. If explicit provider is requested and configured, use it
    if (requested && ['groq', 'gemini', 'openai', 'mock'].includes(requested)) {
      const candidate = this.createProvider(requested);
      if (candidate.isConfigured || requested === 'mock') {
        return candidate;
      }
      console.warn(`[AI FACTORY] Requested provider "${requested}" is missing its API key. Falling back.`);
    }

    // 2. Auto-detect configured API keys in priority order
    if (process.env.GROQ_API_KEY && process.env.GROQ_API_KEY.trim().length > 0) {
      return this.createProvider('groq');
    }

    if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim().length > 0) {
      return this.createProvider('gemini');
    }

    if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY.trim().length > 0) {
      return this.createProvider('openai');
    }

    // 3. Fallback to zero-dependency Mock Socratic Tutor
    return this.createProvider('mock');
  }

  /**
   * Executes a Socratic debugging query with automatic runtime resilience.
   * If the chosen LLM provider encounters a network or quota error,
   * it seamlessly falls back to the MockSocraticProvider so the candidate is never blocked.
   */
  public static async generateSocraticHint(options: AIRequestOptions, preferredType?: string): Promise<AIResponse> {
    const primaryProvider = this.resolveProvider(preferredType);

    try {
      return await primaryProvider.generateSocraticHint(options);
    } catch (err: any) {
      console.error(`[AI FACTORY] Primary provider "${primaryProvider.providerType}" failed:`, err.message);

      // If primary wasn't already mock, fall back to mock
      if (primaryProvider.providerType !== 'mock') {
        console.warn('[AI FACTORY] Switching to MockSocraticProvider fallback to preserve candidate flow.');
        const fallbackProvider = this.createProvider('mock');
        const fallbackResponse = await fallbackProvider.generateSocraticHint(options);
        return {
          ...fallbackResponse,
          fallbackUsed: true,
          error: `Primary provider (${primaryProvider.providerType}) failed: ${err.message}`,
        };
      }

      throw err;
    }
  }

  /**
   * Returns a diagnostic list of all supported providers and their configuration status.
   */
  public static getAvailableProviders(): Array<{
    type: AIProviderType;
    name: string;
    isConfigured: boolean;
    defaultModel: string;
  }> {
    const types: AIProviderType[] = ['groq', 'gemini', 'openai', 'mock'];
    const names: Record<AIProviderType, string> = {
      groq: 'Groq (Ultra-Fast LPU Inference)',
      gemini: 'Google Gemini (Flash & Pro)',
      openai: 'OpenAI (GPT-4o Mini)',
      mock: 'RepoHamster Socratic Rule Engine (Local Offline)',
    };

    return types.map((type) => {
      const p = this.createProvider(type);
      return {
        type,
        name: names[type],
        isConfigured: p.isConfigured,
        defaultModel: p.defaultModel,
      };
    });
  }
}
