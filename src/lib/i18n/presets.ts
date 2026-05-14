import type { RewritePreset } from '@/lib/llm/prompts/rewrite.v1';

export const REWRITE_PRESETS: Array<{ id: RewritePreset; label: string; title: string }> = [
  { id: 'formal', label: '正式', title: '更正式' },
  { id: 'casual', label: '口语', title: '更口语' },
  { id: 'shorten', label: '简化', title: '简化' },
  { id: 'expand', label: '扩写', title: '扩写' },
  { id: 'fix-typo', label: '修错', title: '修错' },
  { id: 'translate', label: '译', title: '翻译选区' },
];
