import { describe, expect, it } from 'vitest';
import { appendFinalOutput, replaceRange } from './selection';

describe('replaceRange', () => {
  it('replaces only the selected text and returns the next caret range', () => {
    const result = replaceRange('Hello rough world', 6, 11, 'polished');

    expect(result.value).toBe('Hello polished world');
    expect(result.selectionStart).toBe(14);
    expect(result.selectionEnd).toBe(14);
  });
});

describe('appendFinalOutput', () => {
  it('appends final output with a paragraph break only when needed', () => {
    expect(appendFinalOutput('', 'final')).toBe('final');
    expect(appendFinalOutput('old', 'final')).toBe('old\n\nfinal');
    expect(appendFinalOutput('old\n', 'final')).toBe('old\nfinal');
  });
});
