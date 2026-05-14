import { Cpu, Download } from 'lucide-react';
import type { ModelDownload } from '@/types';

export function ModelManager({ models, onDownload }: { models: ModelDownload[]; onDownload: (id: string) => void }) {
  return (
    <section className="side-panel">
      <div className="section-head">
        <span>本地模型</span>
        <Cpu size={16} />
      </div>
      <div className="model-list">
        {models.map((model) => (
          <div key={model.id}>
            <header>
              <strong>{model.label}</strong>
              <span>{model.quantization} · {model.size}</span>
            </header>
            <div className="progress">
              <span style={{ width: `${model.progress}%` }} />
            </div>
            <button onClick={() => onDownload(model.id)} disabled={model.status === 'ready'}>
              <Download size={14} /> {model.status === 'ready' ? 'Ready' : '下载'}
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
