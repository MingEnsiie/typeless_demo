import type { HistoryItem } from '@/types';

export function HistoryList({ items, onUse }: { items: HistoryItem[]; onUse: (item: HistoryItem) => void }) {
  return (
    <section className="side-panel">
      <div className="section-head">
        <span>历史会话</span>
        <strong>{items.length}/200</strong>
      </div>
      <div className="history-list">
        {items.length === 0 && <p>还没有历史记录。</p>}
        {items.slice(0, 8).map((item) => (
          <button key={item.id} onClick={() => onUse(item)}>
            <span>{item.mode} · {new Date(item.createdAt).toLocaleTimeString()}</span>
            <strong>{item.finalText}</strong>
          </button>
        ))}
      </div>
    </section>
  );
}
