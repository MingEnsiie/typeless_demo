import { describe, expect, it } from 'vitest';
import { DEFAULT_ENDPOINTS } from './endpoints';

describe('default endpoints', () => {
  it('uses the local Qwen3.5 4B model as the default LLM option', () => {
    const qwen = DEFAULT_ENDPOINTS.find((endpoint) => endpoint.id === 'qwen35-local');

    expect(qwen?.kind).toBe('llm');
    expect(qwen?.baseUrl).toBe('/api/llm/qwen35-local/v1');
    expect(qwen?.model).toBe('Qwen3.5-4B');
    expect(qwen?.localPath).toBe('/home/mingzh/Documents/Workplace/QwenAsset/model/Qwen3.5-4B');
  });

  it('uses the approved MiMo OpenAI-compatible endpoint and model', () => {
    const mimo = DEFAULT_ENDPOINTS.find((endpoint) => endpoint.id === 'mimo');

    expect(mimo?.baseUrl).toBe('/api/llm/mimo/v1');
    expect(mimo?.model).toBe('MiMo-V2.5-Pro');
  });

  it('defaults DeepSeek to v4 flash and exposes v4 pro as an option', () => {
    const deepseek = DEFAULT_ENDPOINTS.find((endpoint) => endpoint.id === 'deepseek');

    expect(deepseek?.baseUrl).toBe('/api/llm/deepseek/v1');
    expect(deepseek?.model).toBe('deepseek-v4-flash');
    expect(deepseek?.modelOptions).toContain('deepseek-v4-pro');
  });

  it('defaults Ollama to an installed local model', () => {
    const ollama = DEFAULT_ENDPOINTS.find((endpoint) => endpoint.id === 'ollama');

    expect(ollama?.label).toBe('Ollama Local');
    expect(ollama?.baseUrl).toBe('/api/llm/ollama/v1');
    expect(ollama?.model).toBe('gemma4:e2b');
    expect(ollama?.modelOptions).toContain('gemma4:e4b');
  });

  it('includes the local Qwen3 ASR 1.7B model path', () => {
    const qwenAsr = DEFAULT_ENDPOINTS.find((endpoint) => endpoint.id === 'qwen3-asr-local');

    expect(qwenAsr?.kind).toBe('asr');
    expect(qwenAsr?.baseUrl).toBe('/api/asr/qwen3-local/v1');
    expect(qwenAsr?.model).toBe('Qwen3-ASR-1.7B');
    expect(qwenAsr?.localPath).toBe('/home/mingzh/Documents/Workplace/QwenAsset/model/Qwen3-ASR-1.7B');
  });
});
