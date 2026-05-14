import { FloatingPortal, offset, flip, shift, useFloating } from '@floating-ui/react';
import { Mic, X } from 'lucide-react';
import { useEffect } from 'react';
import type { SelectionSnapshot } from '@/types';
import { REWRITE_PRESETS } from '@/lib/i18n/presets';
import type { RewritePreset } from '@/lib/llm/prompts/rewrite.v1';

interface Props {
  selection: SelectionSnapshot | null;
  onPreset: (preset: RewritePreset) => void;
  onCustom: () => void;
  onClose: () => void;
}

export function SelectionPopover({ selection, onPreset, onCustom, onClose }: Props) {
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
        <button className="custom-mic" onClick={onCustom}>
          <Mic size={16} /> 按语音指令改写
        </button>
      </div>
    </FloatingPortal>
  );
}
