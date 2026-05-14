import { useCallback, useEffect, useState, type RefObject } from 'react';
import type { SelectionSnapshot } from '@/types';

export function useTextareaSelection(ref: RefObject<HTMLTextAreaElement | null>) {
  const [selection, setSelection] = useState<SelectionSnapshot | null>(null);

  const updateSelection = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    const { selectionStart, selectionEnd, value } = el;
    if (selectionEnd - selectionStart < 2) {
      setSelection(null);
      return;
    }
    setSelection({
      start: selectionStart,
      end: selectionEnd,
      text: value.slice(selectionStart, selectionEnd),
      rect: caretRectInTextarea(el),
    });
  }, [ref]);

  const clearSelection = useCallback(() => {
    const el = ref.current;
    if (el) el.setSelectionRange(0, 0);
    setSelection(null);
  }, [ref]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    el.addEventListener('select', updateSelection);
    el.addEventListener('keyup', updateSelection);
    el.addEventListener('mouseup', updateSelection);
    el.addEventListener('pointerup', updateSelection);
    el.addEventListener('touchend', updateSelection);
    el.addEventListener('input', updateSelection);
    document.addEventListener('selectionchange', updateSelection);
    return () => {
      el.removeEventListener('select', updateSelection);
      el.removeEventListener('keyup', updateSelection);
      el.removeEventListener('mouseup', updateSelection);
      el.removeEventListener('pointerup', updateSelection);
      el.removeEventListener('touchend', updateSelection);
      el.removeEventListener('input', updateSelection);
      document.removeEventListener('selectionchange', updateSelection);
    };
  }, [ref, updateSelection]);

  return { selection, updateSelection, clearSelection };
}

function caretRectInTextarea(el: HTMLTextAreaElement): DOMRect | null {
  const rect = el.getBoundingClientRect();
  const lineHeight = Number.parseFloat(getComputedStyle(el).lineHeight || '22');
  const approximateRows = Math.max(1, el.value.slice(0, el.selectionEnd).split('\n').length);
  return new DOMRect(rect.left + 28, rect.top + 28 + (approximateRows - 1) * lineHeight, 1, lineHeight);
}
