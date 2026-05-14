import type { AppContextId } from '@/types';
import { APP_RULES } from '@/lib/llm/prompts/app-rules';

export function AppContextSwitcher({
  value,
  onChange,
}: {
  value: AppContextId;
  onChange: (value: AppContextId) => void;
}) {
  return (
    <div className="segmented" role="tablist" aria-label="app context">
      {APP_RULES.map((rule) => (
        <button key={rule.id} className={value === rule.id ? 'active' : ''} onClick={() => onChange(rule.id)}>
          {rule.label}
        </button>
      ))}
    </div>
  );
}
