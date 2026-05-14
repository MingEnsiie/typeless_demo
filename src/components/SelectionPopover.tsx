import { FloatingPortal, offset, flip, shift, useFloating } from '@floating-ui/react';
import { Mic, X } from 'lucide-react';
import { useEffect } from 'react';
import type { SelectionSnapshot } from '@/types';
import { REWRITE_PRESETS } from '@/lib/i18n/presets';
import type { RewritePreset } from '@/lib/llm/prompts/rewrite.v1';

interface Props {
  selection: SelectionSnapshot | null;
  voiceInstructionState: 'idle' | 'waiting' | 'recording' | 'processing';
  onPreset: (preset: RewritePreset) => void;
  onCustom: () => void;
  onClose: () => void;
}

export function SelectionPopover({ selection, voiceInstructionState, onPreset, onCustom, onClose }: Props) {
  const { refs, floatingStyles, update } = useFloating({
    placement: 'bottom-start',
    middleware: [offset(8), flip(), shift({ padding: 8 })],
  });

  useEffect(() => {
    if (!selection?.rect) return;
    refs.setReference({
      getBoundingClientRect: () => selection.rect ?? new DOMRect(),
    });
    void update();
  }, [refs, selection, update]);

  if (!selection?.rect) return null;

  return (
    <FloatingPortal>
      <div ref={refs.setFloating} style={floatingStyles} className="selection-popover">
        <header>
          <span>AI 改写选区 · {selection.text.length} 字</span>
          <button onClick={onClose} aria-label="close selection popover">
            <X size={14} />
          </button>
        </header>
        <div className="preset-grid">
          {REWRITE_PRESETS.map((preset) => (
            <button key={preset.id} onClick={() => onPreset(preset.id)}>
              {preset.title}
            </button>
          ))}
        </div>
        <button className="custom-mic" onClick={onCustom} disabled={voiceInstructionState === 'recording' || voiceInstructionState === 'processing'}>
          <Mic size={16} /> {voiceInstructionLabel(voiceInstructionState)}
        </button>
        {voiceInstructionState !== 'idle' && (
          <p className="voice-instruction-hint">{voiceInstructionHint(voiceInstructionState)}</p>
        )}
      </div>
    </FloatingPortal>
  );
}

function voiceInstructionLabel(state: Props['voiceInstructionState']) {
  if (state === 'waiting') return '等待右 Alt 语音指令';
  if (state === 'recording') return '正在听取改写指令';
  if (state === 'processing') return '正在按语音指令改写';
  return '按语音指令改写';
}

function voiceInstructionHint(state: Props['voiceInstructionState']) {
  if (state === 'waiting') return '长按右 Alt 说出改写要求，松开后自动改写选区。';
  if (state === 'recording') return '松开右 Alt 后开始转写并改写选区。';
  return '正在转写语音指令并替换选区。';
}
