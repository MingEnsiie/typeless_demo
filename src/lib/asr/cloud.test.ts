import { describe, expect, it } from 'vitest';
import { mediaFileName } from './cloud';

describe('mediaFileName', () => {
  it('uses an extension that matches the recorded blob type', () => {
    expect(mediaFileName(new Blob(['x'], { type: 'audio/webm' }))).toBe('speech.webm');
    expect(mediaFileName(new Blob(['x'], { type: 'audio/ogg' }))).toBe('speech.ogg');
    expect(mediaFileName(new Blob(['x'], { type: 'audio/wav' }))).toBe('speech.wav');
  });
});
