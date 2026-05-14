export type TypelessMode = 'dictate' | 'rewrite' | 'translate';

export type AppContextId = 'email' | 'slack' | 'wechat' | 'code' | 'notes' | 'casual';

export interface AppRule {
  id: AppContextId;
  label: string;
  tone: string;
  formality: 'formal' | 'neutral' | 'casual';
  markdown: boolean;
  outputGuidance: string;
  placeholder: string;
}

export interface EndpointConfig {
  id: string;
  label: string;
  kind: 'asr' | 'llm';
  baseUrl: string;
  model: string;
  modelOptions?: string[];
  localPath?: string;
  apiKey: string;
  enabled: boolean;
}

export interface DictionaryTerm {
  id: string;
  source: string;
  replacement: string;
}

export interface HistoryItem {
  id: string;
  mode: TypelessMode;
  raw: string;
  finalText: string;
  appContext: AppContextId;
  targetLang?: string;
  createdAt: string;
}

export interface ModelDownload {
  id: string;
  label: string;
  size: string;
  quantization: 'q4' | 'q8' | 'fp16';
  progress: number;
  status: 'not-downloaded' | 'downloading' | 'ready';
}

export interface SelectionSnapshot {
  start: number;
  end: number;
  text: string;
  rect: DOMRect | null;
}
