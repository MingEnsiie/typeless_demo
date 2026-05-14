import type { EndpointConfig } from '@/types';

export function CurrentModelInfo({
  asrEndpoint,
  llmEndpoint,
  offlineMode,
}: {
  asrEndpoint: EndpointConfig;
  llmEndpoint: EndpointConfig;
  offlineMode: boolean;
}) {
  const asr = effectiveAsrInfo(asrEndpoint, offlineMode);
  return (
    <div className="model-call-info" aria-label="当前调用模型信息">
      <div>
        <span>ASR</span>
        <strong>{asr.label}</strong>
        <small>{asr.model}</small>
        <em>{asr.source}</em>
      </div>
      <div>
        <span>LLM</span>
        <strong>{llmEndpoint.label}</strong>
        <small>{llmEndpoint.model}</small>
        <em>{llmEndpoint.localPath ?? llmEndpoint.baseUrl}</em>
      </div>
    </div>
  );
}

function effectiveAsrInfo(endpoint: EndpointConfig, offlineMode: boolean) {
  if (offlineMode && endpoint.id !== 'qwen3-asr-local') {
    return {
      label: 'Browser Local ASR',
      model: 'Xenova/whisper-tiny',
      source: 'browser cache',
    };
  }
  return {
    label: endpoint.label,
    model: endpoint.model,
    source: endpoint.localPath ?? endpoint.baseUrl,
  };
}
