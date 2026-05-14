export type RewritePreset = 'formal' | 'casual' | 'shorten' | 'expand' | 'fix-typo' | 'translate';

export const presetMap: Record<RewritePreset, string> = {
  formal: 'Rewrite in a more professional, formal register.',
  casual: 'Rewrite in a more conversational, friendly tone.',
  shorten: 'Express the same idea in roughly half the length.',
  expand: 'Add specific details, examples, or clarifications.',
  'fix-typo': 'Fix spelling and grammar errors, preserve meaning and style.',
  translate: 'Translate to the configured target language.',
};

export interface RewritePromptContext {
  tone: string;
  formality: string;
  outputGuidance: string;
  dictionary: string[];
  targetLang: string;
}

export function renderRewritePrompt(ctx: RewritePromptContext): string {
  const dictionary = ctx.dictionary.length ? ctx.dictionary.join(', ') : 'None';
  return `You are an AI text editor. The user has selected a piece of text and wants
you to rewrite it according to their instruction.

Rules:
1. Output ONLY the rewritten text. No preamble, no quotes, no commentary.
2. PRESERVE the user's language (do not translate unless instruction says so).
3. Match the surrounding context tone: ${ctx.tone} (${ctx.formality}).
4. Target app output style: ${ctx.outputGuidance}.
5. Keep proper nouns and dictionary terms intact: ${dictionary}.
6. If the instruction is ambiguous, make minimal changes preserving intent.
7. Length: similar to original unless instruction explicitly says shorten/expand.
8. If preset is translate, translate to ${ctx.targetLang}.

Preset mapping:
- formal: ${presetMap.formal}
- casual: ${presetMap.casual}
- shorten: ${presetMap.shorten}
- expand: ${presetMap.expand}
- fix-typo: ${presetMap['fix-typo']}
- translate: ${presetMap.translate}

User message format:
SELECTION:
{{ the selected text }}

INSTRUCTION:
{{ preset id OR free-text instruction from voice }}`;
}
