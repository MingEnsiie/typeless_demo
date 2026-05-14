import { forwardRef } from 'react';
import type { AppRule, SelectionSnapshot } from '@/types';

interface Props {
  value: string;
  rule: AppRule;
  streamingSelection: boolean;
  selection: SelectionSnapshot | null;
  onChange: (value: string) => void;
  onSelect: () => void;
}

export const DemoSurface = forwardRef<HTMLTextAreaElement, Props>(function DemoSurface(
  { value, rule, streamingSelection, selection, onChange, onSelect },
  ref,
) {
  return (
    <section className={streamingSelection ? 'demo-surface streaming-selection' : 'demo-surface'}>
      <div className="section-head">
        <span>最终输出 · 模拟目标应用</span>
        <strong>{rule.label}</strong>
      </div>
      <textarea
        ref={ref}
        value={value}
        placeholder={`最终输出会写入这里。\n\n${rule.placeholder}`}
        onChange={(event) => onChange(event.target.value)}
        onSelect={onSelect}
        onKeyUp={onSelect}
        onPointerUp={onSelect}
      />
      {selection && (
        <div className="selection-inline-bar">
          <span>已选中 {selection.text.length} 字</span>
          <strong>AI 改写选区</strong>
        </div>
      )}
    </section>
  );
});
