import { Mic, MousePointer2, Languages, X } from 'lucide-react';

export function Onboarding({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;
  return (
    <div className="onboarding">
      <button onClick={onClose} aria-label="close onboarding">
        <X size={16} />
      </button>
      <h2>Typeless 三步演示</h2>
      <div>
        <article>
          <Mic size={20} />
          <strong>按住 Space</strong>
          <span>说一段口语，松开后自动转写并润色。</span>
        </article>
        <article>
          <MousePointer2 size={20} />
          <strong>框选文字</strong>
          <span>在输入区选中文本，用浮层做正式化、简化、扩写或翻译。</span>
        </article>
        <article>
          <Languages size={20} />
          <strong>翻译模式</strong>
          <span>切换目标语言，使用 Cmd/Ctrl+Shift+T 触发语音翻译。</span>
        </article>
      </div>
    </div>
  );
}
