import { describe, expect, it } from 'vitest';
import { getLanguageName, TRANSLATE_LANGS } from './languages';

describe('translation languages', () => {
  it('includes auto plus at least ten target languages', () => {
    expect(TRANSLATE_LANGS[0].code).toBe('auto');
    expect(TRANSLATE_LANGS.length).toBeGreaterThanOrEqual(11);
    expect(getLanguageName('en')).toBe('English');
  });
});
