import { Languages } from 'lucide-react';
import type { TypelessMode } from '@/types';
import { TRANSLATE_LANGS } from '@/lib/i18n/languages';

export function TranslateBar({
  mode,
  targetLang,
  onMode,
  onLang,
}: {
  mode: TypelessMode;
  targetLang: string;
  onMode: (mode: TypelessMode) => void;
  onLang: (lang: string) => void;
}) {
  return (
    <div className="translate-bar">
      <button className={mode === 'dictate' ? 'active' : ''} onClick={() => onMode('dictate')}>
        听写
      </button>
      <button className={mode === 'translate' ? 'active' : ''} onClick={() => onMode('translate')}>
        <Languages size={16} /> 语音翻译
      </button>
      <select value={targetLang} onChange={(event) => onLang(event.target.value)}>
        {TRANSLATE_LANGS.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.name} · {lang.nativeName}
          </option>
        ))}
      </select>
      <kbd>⌘⇧T</kbd>
    </div>
  );
}
