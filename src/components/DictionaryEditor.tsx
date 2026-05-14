import { Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import type { DictionaryTerm } from '@/types';

export function DictionaryEditor({
  terms,
  onAdd,
  onRemove,
}: {
  terms: DictionaryTerm[];
  onAdd: (term: Omit<DictionaryTerm, 'id'>) => void;
  onRemove: (id: string) => void;
}) {
  const [source, setSource] = useState('');
  const [replacement, setReplacement] = useState('');
  return (
    <section className="side-panel">
      <div className="section-head">
        <span>用户词典</span>
      </div>
      <div className="dictionary-form">
        <input placeholder="原词" value={source} onChange={(event) => setSource(event.target.value)} />
        <input placeholder="标准写法" value={replacement} onChange={(event) => setReplacement(event.target.value)} />
        <button
          onClick={() => {
            if (!source.trim() || !replacement.trim()) return;
            onAdd({ source, replacement });
            setSource('');
            setReplacement('');
          }}
        >
          <Plus size={15} />
        </button>
      </div>
      <div className="term-list">
        {terms.map((term) => (
          <div key={term.id}>
            <span>{term.source}</span>
            <strong>{term.replacement}</strong>
            <button onClick={() => onRemove(term.id)} aria-label="remove dictionary term">
              <Trash2 size={14} />
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
