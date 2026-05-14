import { ArrowRight, Copy, RotateCcw } from 'lucide-react';
import type { TypelessMode } from '@/types';

export function ResultPanel({
  mode,
  raw,
  finalText,
  streaming,
  onCopy,
  onRetranslate,
}: {
  mode: TypelessMode;
  raw: string;
  finalText: string;
  streaming: string;
  onCopy: (text: string) => void;
  onRetranslate: () => void;
}) {
  const shown = streaming || finalText;
  const previewLabel = mode === 'translate' ? 'TRANSLATION PREVIEW' : mode === 'rewrite' ? 'REWRITE PREVIEW' : 'POLISH PREVIEW';
  const previewPlaceholder = mode === 'translate' ? '等待翻译...' : '等待 AI 输出...';
  return (
    <section className="result-panel">
      <div className="section-head">
        <span>处理过程</span>
        <button onClick={() => onCopy(shown)} disabled={!shown}>
          <Copy size={15} /> 复制
        </button>
      </div>
      <div className="process-flow">
        <article>
          <h3>RAW ASR</h3>
          <p>{raw || '等待语音转写...'}</p>
        </article>
        <ArrowRight className="flow-arrow" size={20} />
        <article>
          <h3>{previewLabel}</h3>
          <p>{shown || previewPlaceholder}</p>
          {mode === 'translate' && raw && (
            <button className="soft-action" onClick={onRetranslate}>
              <RotateCcw size={14} /> 再来一种语言
            </button>
          )}
        </article>
        <ArrowRight className="flow-arrow" size={20} />
        <article className="final-step">
          <h3>FINAL INPUT</h3>
          <p>{shown || '等待写入最终输出区...'}</p>
        </article>
      </div>
    </section>
  );
}
