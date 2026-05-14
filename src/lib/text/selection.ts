export interface ReplaceRangeResult {
  value: string;
  selectionStart: number;
  selectionEnd: number;
}

export function replaceRange(value: string, start: number, end: number, replacement: string): ReplaceRangeResult {
  const safeStart = Math.max(0, Math.min(start, value.length));
  const safeEnd = Math.max(safeStart, Math.min(end, value.length));
  const next = `${value.slice(0, safeStart)}${replacement}${value.slice(safeEnd)}`;
  const caret = safeStart + replacement.length;
  return { value: next, selectionStart: caret, selectionEnd: caret };
}
