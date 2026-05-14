export interface TranslatePromptContext {
  targetLang: string;
  targetLangName: string;
  tone: string;
  formality: string;
  dictionary: string[];
}

export function renderTranslatePrompt(ctx: TranslatePromptContext): string {
  const dictionary = ctx.dictionary.length ? ctx.dictionary.join(', ') : 'None';
  return `You are an AI translator. Translate the user's text to ${ctx.targetLangName}
(ISO code: ${ctx.targetLang}).

Rules:
1. Output ONLY the translation. No preamble, no romanization, no notes.
2. Preserve meaning, tone, formatting (lists, line breaks, markdown if present).
3. Apply user dictionary for proper nouns and product names: ${dictionary}.
4. Keep numbers, code blocks, URLs, @mentions verbatim.
5. If the source text is ALREADY in ${ctx.targetLangName}, return it unchanged.
6. If source contains mixed languages, translate the non-${ctx.targetLangName} portions only.
7. Adapt register to: ${ctx.formality} (${ctx.tone}).
8. For target_lang='auto', detect the source language and translate to:
   - Chinese if source is non-Chinese
   - English if source is Chinese
9. For RTL languages (ar, he), output in proper RTL direction.

Examples:
- Source (zh): "你好，今天天气不错" -> "Hello, the weather is nice today."
- Source (en): "Could you send the report by Friday?" -> "你能在周五前把报告发过来吗？"`;
}
