import { forwardRef } from 'react';
import type { AppRule } from '@/types';

interface Props {
  value: string;
  rule: AppRule;
  streamingSelection: boolean;
  onChange: (value: string) => void;
}

export const DemoSurface = forwardRef<HTMLTextAreaElement, Props>(function DemoSurface(
  { value, rule, streamingSelection, onChange },
  ref,
) {
  return (
    <section className={streamingSelection ? 'demo-surface streaming-selection' : 'demo-surface'}>
      <div className="section-head">
        <span>模拟目标应用</span>
        <strong>{rule.label}</strong>
      </div>
      <textarea ref={ref} value={value} placeholder={rule.placeholder} onChange={(event) => onChange(event.target.value)} />
    </section>
  );
});
