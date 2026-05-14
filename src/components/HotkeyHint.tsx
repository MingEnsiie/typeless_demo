import { Keyboard, Mic } from 'lucide-react';
import type { TypelessMode } from '@/types';

export function HotkeyHint({ mode, recording }: { mode: TypelessMode; recording: boolean }) {
  return (
    <div className="hotkey-hint">
      <div className={recording ? 'pulse-dot active' : 'pulse-dot'} />
      <div>
        <strong>{recording ? '正在输入' : mode === 'translate' ? '翻译模式' : mode === 'rewrite' ? '改写模式' : '听写模式'}</strong>
        <span>
          <Keyboard size={14} /> 左 Alt 按住说话 · <Mic size={14} /> Ctrl + 左 Alt 翻译
        </span>
      </div>
    </div>
  );
}
