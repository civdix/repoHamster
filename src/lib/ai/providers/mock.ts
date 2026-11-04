import { BaseAIProvider } from './base';
import type { IAIProvider, AIProviderType, AIRequestOptions, AIResponse } from '../types';

export class MockSocraticProvider extends BaseAIProvider implements IAIProvider {
  readonly providerType: AIProviderType = 'mock';
  readonly defaultModel = 'socratic-hamster-rule-engine-v1';

  get isConfigured(): boolean {
    return true; // Always ready
  }

  async generateSocraticHint(options: AIRequestOptions): Promise<AIResponse> {
    const q = (options.userMessage || '').toLowerCase();
    const assignmentTitle = options.assignmentTitle || 'the debugging challenge';

    let advice = '';

    if (q.includes('race') || q.includes('concurrency') || q.includes('lock') || q.includes('atomic') || q.includes('mutex')) {
      advice = `### 🐹 Concurrency & Synchronization Diagnostic Hint
When troubleshooting race conditions in **${assignmentTitle}**:
1. **Critical Section Inspection**: Locate where shared state is read and updated. If there is an asynchronous pause (such as an \`await\` or non-atomic DB call) between validating inventory and committing the update, concurrent requests will interleave.
2. **Atomic Primitives**: Does your framework support atomic decrements (e.g. \`UPDATE ... WHERE stock >= qty\`), database transactions with serializable isolation, or in-memory mutex locks?
3. **Reproduction Strategy**: Try issuing 10 simultaneous asynchronous requests using \`Promise.all()\` with identical payloads. Verify whether stock drops below zero.`;
    } else if (q.includes('rate') || q.includes('limit') || q.includes('window') || q.includes('memory') || q.includes('leak') || q.includes('evict')) {
      advice = `### 🐹 Sliding Window & Memory Eviction Hint
When analyzing the rate limiter in **${assignmentTitle}**:
1. **Timestamp Pruning**: Sliding window algorithms require purging bucket timestamps older than \`now - windowSizeMs\` *before* evaluating bucket capacity.
2. **Boundary Condition**: Verify your timestamp comparison logic: are you comparing \`timestamp <= cutoff\` or \`timestamp < cutoff\`?
3. **Memory Eviction**: Ensure client keys with no active timestamps are removed from your in-memory Map rather than storing empty arrays indefinitely.`;
    } else if (q.includes('token') || q.includes('jwt') || q.includes('timezone') || q.includes('utc') || q.includes('expire') || q.includes('auth')) {
      advice = `### 🐹 Authentication & Timezone Diagnostic Hint
When troubleshooting authentication in **${assignmentTitle}**:
1. **Timezone Normalization**: Naive local timestamps (lacking explicit UTC timezone information) will trigger subtle comparison failures against standard Unix epoch claims.
2. **Token Parsing**: Check whether bearer tokens are split properly (e.g. \`headers.authorization.split(' ')[1]\`) and trimmed of whitespace.
3. **Expiration Boundary**: Compare current Unix seconds (\`Math.floor(Date.now() / 1000)\`) strictly against the \`exp\` claim. Are you comparing seconds to milliseconds by mistake?`;
    } else if (q.includes('deadlock') || q.includes('stall') || q.includes('promise') || q.includes('reject') || q.includes('hang')) {
      advice = `### 🐹 Asynchronous Flow & Deadlock Diagnostic Hint
When investigating worker stalls in **${assignmentTitle}**:
1. **Unhandled Promise Rejections**: Using \`Promise.all()\` halts on the first rejection, leaving other promises unsettled. Consider whether \`Promise.allSettled()\` or per-task error containment is needed.
2. **Unconditional Cleanup**: Is your lock, channel, or database connection guaranteed to be closed in a \`finally\` block, even when an exception is thrown?`;
    } else if (q.includes('precision') || q.includes('float') || q.includes('round') || q.includes('decimal') || q.includes('cents')) {
      advice = `### 🐹 Numerical Precision Diagnostic Hint
When evaluating financial or calculation bugs in **${assignmentTitle}**:
1. **Binary Floating-Point Inaccuracy**: Standard IEEE 754 floats cannot represent fractions like \`0.1\` accurately (\`0.1 + 0.2 !== 0.3\`).
2. **Integer Arithmetic**: Store monetary values in base integer units (cents/satoshis) or use arbitrary-precision decimal libraries (\`decimal.js\` or \`BigNumber\`).
3. **Rounding Rules**: Check if your rounding function defaults to banker's rounding (round-half-to-even) when standard half-up rounding is required.`;
    } else if (q.includes('cors') || q.includes('fetch') || q.includes('header') || q.includes('403') || q.includes('401')) {
      advice = `### 🐹 Network & HTTP Header Diagnostic Hint
When analyzing network issues in **${assignmentTitle}**:
1. **CORS Origins**: Check whether the backend whitelist includes the frontend development port (e.g. \`localhost:3000\` vs \`localhost:5173\`).
2. **Endpoint Typo**: Double check URL routes in client requests (e.g. \`/api/v1/users\` vs \`/api/v1/uers\`).
3. **Request Headers**: Verify that \`Content-Type: application/json\` is present on POST/PUT requests and that payloads are JSON-stringified.`;
    } else {
      advice = `### 🐹 Architectural Debugging Guidance
For **${assignmentTitle}**:
- Start by checking the failing assertions in the public test suite (\`npm test\`, \`pytest\`, or \`mvn test\`).
- Trace the lifecycle of inputs from the request handler through the service layer.
- Look for assumptions where asynchronous operations or shared mutable state are accessed without synchronization.
- What specific error message or unexpected return value are you observing in your terminal?`;
    }

    const promptTokens = this.estimateTokens(options.userMessage);
    const completionTokens = this.estimateTokens(advice);

    return {
      reply: advice,
      promptTokens,
      completionTokens,
      totalTokens: promptTokens + completionTokens,
      modelName: this.defaultModel,
      provider: 'mock',
    };
  }
}
