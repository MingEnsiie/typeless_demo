import { transcribeCloud, transcribeLocal } from '@/lib/asr';
import type { EndpointConfig } from '@/types';

export function useAsr() {
  return async function transcribe(audio: Blob, endpoint: EndpointConfig, offlineMode: boolean) {
    if (offlineMode || endpoint.id === 'qwen3-asr-local') return transcribeLocal(endpoint.localPath);
    return transcribeCloud(audio, {
      provider: endpoint.id === 'groq' ? 'groq' : endpoint.id === 'openai-asr' ? 'openai' : endpoint.id === 'siliconflow-asr' ? 'siliconflow' : 'demo',
      apiKey: endpoint.apiKey,
      model: endpoint.model,
      language: 'auto',
    });
  };
}
