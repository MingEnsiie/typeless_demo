import { llm } from '@/lib/llm';
import { dictionaryAsTerms } from '@/lib/storage/dictionary';
import type { AppRule, DictionaryTerm, EndpointConfig } from '@/types';
import type { RewritePreset } from '@/lib/llm/prompts/rewrite.v1';

export function useLlm() {
  function ctx(rule: AppRule, dictionary: DictionaryTerm[], endpoint: EndpointConfig, onToken?: (token: string) => void) {
    return {
      tone: rule.tone,
      formality: rule.formality,
      markdown: rule.markdown,
      dictionary: dictionaryAsTerms(dictionary),
      opts: {
        baseUrl: endpoint.baseUrl,
        model: endpoint.model,
        apiKey: endpoint.apiKey,
        onToken,
      },
    };
  }

  return {
    polish: (raw: string, rule: AppRule, dictionary: DictionaryTerm[], endpoint: EndpointConfig, onToken?: (token: string) => void) =>
      llm.polish(raw, ctx(rule, dictionary, endpoint, onToken)),
    rewrite: (
      selection: string,
      instruction: string | RewritePreset,
      targetLang: string,
      rule: AppRule,
      dictionary: DictionaryTerm[],
      endpoint: EndpointConfig,
      onToken?: (token: string) => void,
    ) => llm.rewrite(selection, instruction, { ...ctx(rule, dictionary, endpoint, onToken), targetLang }),
    translate: (
      raw: string,
      targetLang: string,
      rule: AppRule,
      dictionary: DictionaryTerm[],
      endpoint: EndpointConfig,
      onToken?: (token: string) => void,
    ) => llm.translate(raw, targetLang, ctx(rule, dictionary, endpoint, onToken)),
  };
}
