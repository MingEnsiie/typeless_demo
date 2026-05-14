import type { EndpointConfig } from '@/types';

export const DEFAULT_ENDPOINTS: EndpointConfig[] = [
  {
    id: 'deepseek',
    label: 'DeepSeek V4 Flash',
    kind: 'llm',
    baseUrl: '/api/llm/deepseek/v1',
    model: 'deepseek-chat',
    apiKey: '',
    enabled: true,
  },
  {
    id: 'mimo',
    label: 'Xiaomi MiMo',
    kind: 'llm',
    baseUrl: '/api/llm/mimo/v1',
    model: 'mimo-vl-7b',
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
