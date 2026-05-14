export interface AsrOptions {
  provider: 'demo' | 'groq' | 'openai' | 'siliconflow' | 'aliyun' | 'local';
  apiKey?: string;
  model: string;
  language?: string;
}

export interface TranscriptResult {
  text: string;
  durationMs: number;
  provider: string;
}
