import { CheckCircle2, KeyRound, X } from 'lucide-react';
import type { EndpointConfig } from '@/types';

export function SettingsDialog({
  open,
  endpoints,
  llmEndpointId,
  asrEndpointId,
  onClose,
  onKey,
  onModel,
  onSelect,
  onTest,
}: {
  open: boolean;
  endpoints: EndpointConfig[];
  llmEndpointId: string;
  asrEndpointId: string;
  onClose: () => void;
  onKey: (id: string, key: string) => void;
  onModel: (id: string, model: string) => void;
  onSelect: (kind: 'asr' | 'llm', id: string) => void;
  onTest: (endpoint: EndpointConfig) => void;
}) {
  if (!open) return null;
  return (
    <div className="modal-backdrop">
      <div className="settings-modal">
        <header>
          <div>
            <h2>模型与 API 设置</h2>
            <p>Key 存在浏览器 localStorage，仅用于本地 demo。</p>
          </div>
          <button onClick={onClose} aria-label="close settings">
            <X size={18} />
          </button>
        </header>
        <div className="endpoint-list">
          {endpoints.map((endpoint) => (
            <div key={endpoint.id} className="endpoint-row">
              <div>
                <strong>{endpoint.label}</strong>
                <span>{endpoint.kind.toUpperCase()} · {endpoint.baseUrl}</span>
              </div>
              <input value={endpoint.model} onChange={(event) => onModel(endpoint.id, event.target.value)} />
              <input
                type="password"
                placeholder={endpoint.id === 'ollama' ? 'Ollama 不需要 key' : 'API key'}
                value={endpoint.apiKey}
                onChange={(event) => onKey(endpoint.id, event.target.value)}
              />
              <button
                className={(endpoint.kind === 'llm' ? llmEndpointId : asrEndpointId) === endpoint.id ? 'active' : ''}
                onClick={() => onSelect(endpoint.kind, endpoint.id)}
              >
                <KeyRound size={14} /> 使用
              </button>
              <button onClick={() => onTest(endpoint)}>
                <CheckCircle2 size={14} /> 连通
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
