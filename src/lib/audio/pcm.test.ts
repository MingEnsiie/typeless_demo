import { describe, expect, it } from 'vitest';
import { encodeWav } from './pcm';

describe('encodeWav', () => {
  it('creates a mono 16-bit PCM WAV file', async () => {
    const wav = encodeWav(new Float32Array([0, 0.5, -0.5]), 16000);
    const buf = await wav.arrayBuffer();
    const bytes = new Uint8Array(buf);
    const riff = String.fromCharCode(...bytes.slice(0, 4));
    const wave = String.fromCharCode(...bytes.slice(8, 12));

    expect(wav.type).toBe('audio/wav');
    expect(riff).toBe('RIFF');
    expect(wave).toBe('WAVE');
    expect(buf.byteLength).toBe(44 + 3 * 2);
  });
});
