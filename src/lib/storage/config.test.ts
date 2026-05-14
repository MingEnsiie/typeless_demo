import { describe, expect, it } from 'vitest';
import type { EndpointConfig } from '@/types';
import { mergeDefaultEndpoints, mergeDefaultModels } from './config';

describe('mergeDefaultEndpoints', () => {
  it('keeps saved keys while adding new default endpoints to old persisted config', () => {
    const saved: EndpointConfig[] = [
      {
        id: 'groq',
        label: 'Groq Whisper Turbo',
        kind: 'asr',
        baseUrl: '/api/asr/groq/v1',
        model: 'whisper-large-v3-turbo',
        apiKey: 'saved-groq-key',
        enabled: true,
      },
    ];

    const merged = mergeDefaultEndpoints(saved);
    const groq = merged.find((endpoint) => endpoint.id === 'groq');
    const qwenAsr = merged.find((endpoint) => endpoint.id === 'qwen3-asr-local');

    expect(groq?.apiKey).toBe('saved-groq-key');
    expect(qwenAsr?.label).toBe('Qwen3-ASR-1.7B Local');
    expect(qwenAsr?.localPath).toBe('/home/mingzh/Documents/Workplace/QwenAsset/model/Qwen3-ASR-1.7B');
  });
});

describe('mergeDefaultModels', () => {
  it('adds local ASR and installed Ollama models to old persisted model lists', () => {
    const merged = mergeDefaultModels([
      { id: 'qwen3-4b', label: 'Ollama qwen3:4b', size: '2.4 GB', quantization: 'q4', progress: 100, status: 'ready' },
    ]);

    expect(merged.find((model) => model.id === 'qwen3-asr-1.7b')?.label).toBe('Qwen3-ASR-1.7B Local');
    expect(merged.find((model) => model.id === 'qwen35-4b')?.label).toBe('Qwen3.5-4B Local');
    expect(merged.find((model) => model.id === 'gemma4-e2b')?.label).toBe('Ollama gemma4:e2b');
    expect(merged.find((model) => model.id === 'gemma4-e4b')?.label).toBe('Ollama gemma4:e4b');
  });
});
