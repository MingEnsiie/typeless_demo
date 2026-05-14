import { replaceRange } from '@/lib/text/selection';

export function useInject() {
  async function copy(text: string) {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
    }
  }

  async function append(textarea: HTMLTextAreaElement | null, text: string) {
    if (!textarea) return;
    const spacer = textarea.value && !textarea.value.endsWith('\n') ? '\n\n' : '';
    textarea.value = `${textarea.value}${spacer}${text}`;
    textarea.dispatchEvent(new Event('input', { bubbles: true }));
    await copy(text);
  }

  async function replaceSelection(textarea: HTMLTextAreaElement | null, text: string, start: number, end: number) {
    if (!textarea) return;
    const next = replaceRange(textarea.value, start, end, text);
    textarea.value = next.value;
    textarea.selectionStart = next.selectionStart;
    textarea.selectionEnd = next.selectionEnd;
    textarea.dispatchEvent(new Event('input', { bubbles: true }));
    await copy(text);
  }

  return { append, replaceSelection, copy };
}
