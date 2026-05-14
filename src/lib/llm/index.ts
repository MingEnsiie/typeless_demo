import { getLanguageName } from '@/lib/i18n/languages';
import { presetMap, renderRewritePrompt, type RewritePreset } from '@/lib/llm/prompts/rewrite.v1';
import { renderPolishPrompt } from './prompts/polish.v1';
import { renderTranslatePrompt } from './prompts/translate.v1';
import { chatComplete, type ChatOptions } from './client';

export interface SharedLlmContext {
  tone: string;
  formality: string;
  markdown: boolean;
  dictionary: string[];
  opts: ChatOptions;
}

export const llm = {
  async polish(raw: string, ctx: SharedLlmContext): Promise<string> {
    const sys = renderPolishPrompt(ctx);
    return chatComplete(
      [
        { role: 'system', content: sys },
        { role: 'user', content: raw },
      ],
      ctx.opts,
    );
  },

  async rewrite(
    selection: string,
    instruction: string | RewritePreset,
    ctx: SharedLlmContext & { targetLang: string },
  ): Promise<string> {
    const sys = renderRewritePrompt({ ...ctx, targetLang: getLanguageName(ctx.targetLang) });
    const resolvedInstruction = instruction in presetMap ? presetMap[instruction as RewritePreset] : instruction;
    return chatComplete(
      [
        { role: 'system', content: sys },
        { role: 'user', content: `SELECTION:\n${selection}\n\nINSTRUCTION:\n${resolvedInstruction}` },
      ],
      ctx.opts,
    );
  },

  async translate(raw: string, targetLang: string, ctx: SharedLlmContext): Promise<string> {
    const sys = renderTranslatePrompt({
      targetLang,
      targetLangName: getLanguageName(targetLang),
      tone: ctx.tone,
      formality: ctx.formality,
      dictionary: ctx.dictionary,
    });
    return chatComplete(
      [
        { role: 'system', content: sys },
        { role: 'user', content: raw },
      ],
      ctx.opts,
    );
  },
};
