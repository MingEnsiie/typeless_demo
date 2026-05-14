export const TRANSLATE_LANGS = [
  { code: 'auto', name: '自动', nativeName: 'Auto' },
  { code: 'en', name: '英语', nativeName: 'English' },
  { code: 'zh', name: '中文', nativeName: '中文' },
  { code: 'ja', name: '日语', nativeName: '日本語' },
  { code: 'ko', name: '韩语', nativeName: '한국어' },
  { code: 'fr', name: '法语', nativeName: 'Français' },
  { code: 'es', name: '西语', nativeName: 'Español' },
  { code: 'de', name: '德语', nativeName: 'Deutsch' },
  { code: 'pt', name: '葡语', nativeName: 'Português' },
  { code: 'ru', name: '俄语', nativeName: 'Русский' },
  { code: 'ar', name: '阿语', nativeName: 'العربية' },
] as const;

export type TranslateLangCode = (typeof TRANSLATE_LANGS)[number]['code'];

export function getLanguageName(code: string): string {
  return TRANSLATE_LANGS.find((lang) => lang.code === code)?.nativeName ?? code;
}
