import type { DictionaryTerm } from '@/types';

export function dictionaryAsTerms(dictionary: DictionaryTerm[]): string[] {
  return dictionary.map((term) => `${term.source} => ${term.replacement}`);
}

export function exportDictionary(dictionary: DictionaryTerm[]): string {
  return JSON.stringify(dictionary, null, 2);
}

export function importDictionary(value: string): DictionaryTerm[] {
  const parsed = JSON.parse(value) as DictionaryTerm[];
  if (!Array.isArray(parsed)) throw new Error('Dictionary must be an array');
  return parsed.filter((term) => term.source && term.replacement);
}
