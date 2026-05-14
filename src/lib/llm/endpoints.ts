import type { EndpointConfig } from '@/types';

export const DEFAULT_ENDPOINTS: EndpointConfig[] = [
  {
    id: 'deepseek',
    label: 'DeepSeek V4 Flash',
    kind: 'llm',
    baseUrl: '/api/llm/deepseek/v1',
    model: 'deepseek-v4-flash',
    modelOptions: ['deepseek-v4-flash', 'deepseek-v4-pro'],
    apiKey: '',
    enabled: true,
  },
  {
    id: 'mimo',
    label: 'MiMo V2.5 Pro',
    kind: 'llm',
    baseUrl: '/api/llm/mimo/v1',
    model: 'MiMo-V2.5-Pro',
    modelOptions: ['MiMo-V2.5-Pro'],
    apiKey: '',
    enabled: false,
  },
  {
    id: 'ollama',
    label: 'Ollama qwen3:4b',
    kind: 'llm',
    baseUrl: '/api/llm/ollama/v1',
    model: 'qwen3:4b',
    apiKey: '',
    enabled: true,
  },
  {
    id: 'qwen3-asr-local',
    label: 'Qwen3-ASR-1.7B Local',
    kind: 'asr',
    baseUrl: 'local://qwen3-asr',
    model: 'Qwen3-ASR-1.7B',
    modelOptions: ['Qwen3-ASR-1.7B'],
    localPath: '/home/mingzh/Documents/Workplace/QwenAsset/model/Qwen3-ASR-1.7B',
    apiKey: '',
    enabled: true,
  },
  {
    id: 'groq',
    label: 'Groq Whisper Turbo',
    kind: 'asr',
    baseUrl: '/api/asr/groq/v1',
    model: 'whisper-large-v3-turbo',
    apiKey: '',
    enabled: true,
  },
  {
    id: 'openai-asr',
    label: 'OpenAI Whisper',
    kind: 'asr',
    baseUrl: '/api/asr/openai/v1',
    model: 'whisper-1',
    apiKey: '',
    enabled: false,
  },
  {
    id: 'siliconflow-asr',
    label: 'SiliconFlow ASR',
    kind: 'asr',
    baseUrl: '/api/asr/siliconflow/v1',
    model: 'FunAudioLLM/SenseVoiceSmall',
    apiKey: '',
    enabled: false,
  },
];

export function findEndpoint(endpoints: EndpointConfig[], id: string): EndpointConfig {
  return endpoints.find((endpoint) => endpoint.id === id) ?? DEFAULT_ENDPOINTS[0];
}
