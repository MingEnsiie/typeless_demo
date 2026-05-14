import { useCallback, useEffect, useState, type RefObject } from 'react';
import type { SelectionSnapshot } from '@/types';

export function useTextareaSelection(ref: RefObject<HTMLTextAreaElement | null>): SelectionSnapshot | null {
  const [selection, setSelection] = useState<SelectionSnapshot | null>(null);

  const update = useCallback(() => {
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

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    el.addEventListener('select', update);
    el.addEventListener('keyup', update);
    el.addEventListener('mouseup', update);
    el.addEventListener('input', update);
    return () => {
      el.removeEventListener('select', update);
      el.removeEventListener('keyup', update);
      el.removeEventListener('mouseup', update);
      el.removeEventListener('input', update);
    };
  }, [ref, update]);

  return selection;
}

function caretRectInTextarea(el: HTMLTextAreaElement): DOMRect | null {
  const rect = el.getBoundingClientRect();
  const lineHeight = Number.parseFloat(getComputedStyle(el).lineHeight || '22');
  const approximateRows = Math.max(1, el.value.slice(0, el.selectionEnd).split('\n').length);
  return new DOMRect(rect.left + 28, rect.top + 28 + (approximateRows - 1) * lineHeight, 1, lineHeight);
}
