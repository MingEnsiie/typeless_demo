# Prompt Contracts

Prompt files live under `src/lib/llm/prompts`.

- `polish.v1.ts`: cleans raw speech into written text while preserving language and meaning.
- `rewrite.v1.ts`: rewrites selected text from a preset or custom spoken instruction.
- `translate.v1.ts`: translates raw speech or selected text to the configured target language.
- `app-rules.ts`: maps target application contexts to tone, formality, and Markdown preferences.

All prompts require output-only responses so the result can be injected directly into the target textarea.
