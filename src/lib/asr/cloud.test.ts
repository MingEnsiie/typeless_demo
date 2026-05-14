import { describe, expect, it } from 'vitest';
import { mediaFileName, transcribeCloud } from './cloud';

describe('mediaFileName', () => {
  it('uses an extension that matches the recorded blob type', () => {
    expect(mediaFileName(new Blob(['x'], { type: 'audio/webm' }))).toBe('speech.webm');
    expect(mediaFileName(new Blob(['x'], { type: 'audio/ogg' }))).toBe('speech.ogg');
    expect(mediaFileName(new Blob(['x'], { type: 'audio/wav' }))).toBe('speech.wav');
  });
});

describe('transcribeCloud', () => {
  it('does not return a canned transcript when a real ASR provider is missing an API key', async () => {
    await expect(
      transcribeCloud(new Blob(['valid-media'], { type: 'audio/webm' }), {
        provider: 'groq',
        apiKey: '',
        model: 'whisper-large-v3-turbo',
        language: 'auto',
      }),
    ).rejects.toThrow('请先在模型与 API 设置里填写 Groq Whisper Turbo 的 ASR API key');
  });
});
