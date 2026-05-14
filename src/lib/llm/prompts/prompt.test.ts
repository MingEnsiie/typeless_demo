import { describe, expect, it } from 'vitest';
import { renderPolishPrompt } from './polish.v1';
import { presetMap, renderRewritePrompt } from './rewrite.v1';
import { renderTranslatePrompt } from './translate.v1';

describe('prompt rendering', () => {
  it('renders polish prompt with app context and dictionary terms', () => {
    const prompt = renderPolishPrompt({
      tone: 'professional email',
      formality: 'formal',
      markdown: false,
      dictionary: ['Typeless', 'Qwen'],
    });

    expect(prompt).toContain('professional email');
    expect(prompt).toContain('Typeless, Qwen');
    expect(prompt).toContain('Output plain text');
  });

  it('maps rewrite presets and keeps translate target in the prompt', () => {
    expect(presetMap.formal).toContain('professional');
    const prompt = renderRewritePrompt({
      tone: 'Slack',
      formality: 'casual',
      dictionary: ['MiMo'],
      targetLang: 'English',
    });

    expect(prompt).toContain('MiMo');
    expect(prompt).toContain('English');
  });

  it('renders translate prompt with auto target rules', () => {
    const prompt = renderTranslatePrompt({
      targetLang: 'auto',
      targetLangName: 'Auto',
      tone: 'notes',
      formality: 'neutral',
      dictionary: [],
    });

    expect(prompt).toContain("target_lang='auto'");
    expect(prompt).toContain('Output ONLY the translation');
  });
});
