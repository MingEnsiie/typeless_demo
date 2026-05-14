import { describe, expect, it } from 'vitest';
import { replaceRange } from './selection';

describe('replaceRange', () => {
  it('replaces only the selected text and returns the next caret range', () => {
    const result = replaceRange('Hello rough world', 6, 11, 'polished');

    expect(result.value).toBe('Hello polished world');
    expect(result.selectionStart).toBe(14);
    expect(result.selectionEnd).toBe(14);
  });
});
