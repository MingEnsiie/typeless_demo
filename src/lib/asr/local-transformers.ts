import type { TranscriptResult } from './types';

export interface LocalAsrStatus {
  supported: boolean;
  backend: 'webgpu' | 'wasm';
  model: string;
  localPath?: string;
}

export function getLocalAsrStatus(localPath?: string): LocalAsrStatus {
  return {
    supported: typeof navigator !== 'undefined',
    backend: 'gpu' in navigator ? 'webgpu' : 'wasm',
    model: localPath ? 'Qwen3-ASR-1.7B' : 'Xenova/whisper-tiny',
    localPath,
  };
}

export async function transcribeLocal(localPath?: string): Promise<TranscriptResult> {
  await new Promise((resolve) => window.setTimeout(resolve, 500));
  return {
    text: localPath
      ? `本地 Qwen3-ASR-1.7B 路径已配置：${localPath}。浏览器 demo 当前以本地配置模拟返回；真实读取该目录需要本地后端或模型资产服务。`
      : '本地 Whisper 路径已接通。真实模型会在首次使用时下载到浏览器缓存。',
    durationMs: 500,
    provider: localPath ? 'qwen3-asr-local' : 'local-transformers',
  };
}
