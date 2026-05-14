import type { AsrOptions, TranscriptResult } from './types';

export async function transcribeCloud(audio: Blob, opts: AsrOptions): Promise<TranscriptResult> {
  if (opts.provider === 'demo') {
    await delay(450);
    return {
      text: '嗯 请帮我把这段口语整理成可以直接发送的文字 然后语气自然一点',
      durationMs: 450,
      provider: 'demo',
    };
  }
  if (!opts.apiKey && opts.provider !== 'qwen3-local') {
    throw new Error(`请先在模型与 API 设置里填写 ${providerLabel(opts.provider)} 的 ASR API key`);
  }

  const form = new FormData();
  form.append('file', audio, mediaFileName(audio));
  form.append('model', opts.model);
  if (opts.language && opts.language !== 'auto') form.append('language', opts.language);

  const response = await fetch(providerPath(opts.provider), {
    method: 'POST',
    headers: opts.apiKey ? { Authorization: `Bearer ${opts.apiKey}` } : undefined,
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

function providerLabel(provider: AsrOptions['provider']): string {
  if (provider === 'groq') return 'Groq Whisper Turbo';
  if (provider === 'openai') return 'OpenAI Whisper';
  if (provider === 'siliconflow') return 'SiliconFlow ASR';
  if (provider === 'qwen3-local') return 'Qwen3-ASR-1.7B Local';
  return '当前 ASR 服务';
}

export function mediaFileName(audio: Blob): string {
  if (audio.type.includes('webm')) return 'speech.webm';
  if (audio.type.includes('ogg')) return 'speech.ogg';
  if (audio.type.includes('mpeg')) return 'speech.mp3';
  if (audio.type.includes('mp4')) return 'speech.m4a';
  return 'speech.wav';
}

function providerPath(provider: AsrOptions['provider']): string {
  if (provider === 'groq') return '/api/asr/groq/v1/audio/transcriptions';
  if (provider === 'openai') return '/api/asr/openai/v1/audio/transcriptions';
  if (provider === 'siliconflow') return '/api/asr/siliconflow/v1/audio/transcriptions';
  if (provider === 'qwen3-local') return '/api/asr/qwen3-local/v1/audio/transcriptions';
  return '/api/asr/groq/v1/audio/transcriptions';
}

function delay(ms: number) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}
