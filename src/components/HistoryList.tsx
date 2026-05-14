import { Trash2 } from 'lucide-react';
import type { HistoryItem } from '@/types';

export function HistoryList({
  items,
  onUse,
  onDelete,
}: {
  items: HistoryItem[];
  onUse: (item: HistoryItem) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <section className="side-panel">
      <div className="section-head">
        <span>历史会话</span>
        <strong>{items.length}/200</strong>
      </div>
      <div className="history-list">
        {items.length === 0 && <p>还没有历史记录。</p>}
        {items.slice(0, 8).map((item) => (
          <div className="history-row" key={item.id}>
            <button className="history-replay" onClick={() => onUse(item)}>
              <span>{item.mode} · {new Date(item.createdAt).toLocaleTimeString()}</span>
              <strong>{item.finalText}</strong>
            </button>
            <button className="history-delete" aria-label="删除历史会话" onClick={() => onDelete(item.id)}>
              <Trash2 size={15} />
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
