import type { AsrOptions, TranscriptResult } from './types';

export async function transcribeCloud(audio: Blob, opts: AsrOptions): Promise<TranscriptResult> {
  if (opts.provider === 'demo' || !opts.apiKey) {
    await delay(450);
    return {
      text: '嗯 请帮我把这段口语整理成可以直接发送的文字 然后语气自然一点',
      durationMs: 450,
      provider: 'demo',
    };
  }

  const form = new FormData();
  form.append('file', audio, 'speech.wav');
  form.append('model', opts.model);
  if (opts.language && opts.language !== 'auto') form.append('language', opts.language);

  const response = await fetch(providerPath(opts.provider), {
    method: 'POST',
    headers: { Authorization: `Bearer ${opts.apiKey}` },
    body: form,
  });

  if (!response.ok) {
    throw new Error(`ASR ${response.status}: ${await response.text()}`);
  }

  const json = (await response.json()) as { text?: string };
  return {
    text: json.text ?? '',
    durationMs: 0,
    provider: opts.provider,
  };
}

function providerPath(provider: AsrOptions['provider']): string {
  if (provider === 'groq') return '/api/asr/groq/v1/audio/transcriptions';
  if (provider === 'openai') return '/api/asr/openai/v1/audio/transcriptions';
  if (provider === 'siliconflow') return '/api/asr/siliconflow/v1/audio/transcriptions';
  return '/api/asr/groq/v1/audio/transcriptions';
}

function delay(ms: number) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}
