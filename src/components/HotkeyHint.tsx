import { Keyboard, Mic } from 'lucide-react';
import type { TypelessMode } from '@/types';

export function HotkeyHint({ mode, recording }: { mode: TypelessMode; recording: boolean }) {
  return (
    <div className="hotkey-hint">
      <div className={recording ? 'pulse-dot active' : 'pulse-dot'} />
      <div>
        <strong>{recording ? '正在输入' : mode === 'translate' ? '翻译模式' : mode === 'rewrite' ? '改写模式' : '听写模式'}</strong>
        <span>
          <Keyboard size={14} /> Space 按住说话 · <Mic size={14} /> Cmd/Ctrl+Shift+T 翻译
        </span>
      </div>
    </div>
  );
}
