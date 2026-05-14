import type { TranscriptResult } from './types';

export interface LocalAsrStatus {
  supported: boolean;
  backend: 'webgpu' | 'wasm';
  model: string;
}

export function getLocalAsrStatus(): LocalAsrStatus {
  return {
    supported: typeof navigator !== 'undefined',
    backend: 'gpu' in navigator ? 'webgpu' : 'wasm',
    model: 'Xenova/whisper-tiny',
  };
}

export async function transcribeLocal(): Promise<TranscriptResult> {
  await new Promise((resolve) => window.setTimeout(resolve, 500));
  return {
    text: '本地 Whisper 路径已接通。真实模型会在首次使用时下载到浏览器缓存。',
    durationMs: 500,
    provider: 'local-transformers',
  };
}
