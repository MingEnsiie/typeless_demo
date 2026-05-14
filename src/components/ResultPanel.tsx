import { Copy, RotateCcw } from 'lucide-react';
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
  return (
    <section className="result-panel">
      <div className="section-head">
        <span>处理过程</span>
        <button onClick={() => onCopy(shown)} disabled={!shown}>
          <Copy size={15} /> 复制
        </button>
      </div>
      {mode === 'translate' ? (
        <div className="result-columns">
          <article>
            <h3>RAW</h3>
            <p>{raw || '等待语音转写...'}</p>
          </article>
          <article>
            <h3>TRANSLATION PREVIEW</h3>
            <p>{shown || '等待翻译...'}</p>
            {raw && (
              <button className="soft-action" onClick={onRetranslate}>
                <RotateCcw size={14} /> 再来一种语言
              </button>
            )}
          </article>
        </div>
      ) : (
        <div className="result-columns">
          <article>
            <h3>RAW ASR</h3>
            <p>{raw || '等待语音转写...'}</p>
          </article>
          <article>
            <h3>{mode === 'rewrite' ? 'REWRITE PREVIEW' : 'POLISH PREVIEW'}</h3>
            <p>{shown || '等待 AI 输出...'}</p>
          </article>
        </div>
      )}
    </section>
  );
}
