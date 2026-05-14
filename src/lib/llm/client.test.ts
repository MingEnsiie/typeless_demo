import { describe, expect, it } from 'vitest';
import { chatComplete } from './client';
import { renderPolishPrompt } from './prompts/polish.v1';
import { getAppRule } from './prompts/app-rules';

describe('demo chat completion', () => {
  it('produces visibly different demo output for different app contexts', async () => {
    const raw = '明天下午三点开会同步项目进展';
    const emailRule = getAppRule('email');
    const slackRule = getAppRule('slack');

    const email = await chatComplete(
      [
        { role: 'system', content: renderPolishPrompt({ ...emailRule, dictionary: [] }) },
        { role: 'user', content: raw },
      ],
      { baseUrl: '/api/llm/deepseek/v1', model: 'deepseek-v4-flash' },
    );
    const slack = await chatComplete(
      [
        { role: 'system', content: renderPolishPrompt({ ...slackRule, dictionary: [] }) },
        { role: 'user', content: raw },
      ],
      { baseUrl: '/api/llm/deepseek/v1', model: 'deepseek-v4-flash' },
    );

    expect(email).toContain('Hi team');
    expect(slack).toContain('同步');
    expect(email).not.toBe(slack);
  });
});
