import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useRecorder } from './useRecorder';

class FakeMediaRecorder extends EventTarget {
  static isTypeSupported(type: string) {
    return type === 'audio/webm;codecs=opus';
  }

  state: RecordingState = 'inactive';

  mimeType: string;

  constructor(_stream: MediaStream, options: MediaRecorderOptions) {
    super();
    this.mimeType = options.mimeType ?? 'audio/webm;codecs=opus';
  }

  start() {
    this.state = 'recording';
  }

  stop() {
    this.state = 'inactive';
    this.dispatchEvent(new BlobEvent('dataavailable', { data: new Blob(['valid-media'], { type: 'audio/webm' }) }));
    this.dispatchEvent(new Event('stop'));
  }
}

describe('useRecorder', () => {
  beforeEach(() => {
    vi.stubGlobal('MediaRecorder', FakeMediaRecorder);
    vi.stubGlobal(
      'BlobEvent',
      class extends Event {
        data: Blob;

        constructor(type: string, init: BlobEventInit) {
          super(type);
          this.data = init.data;
        }
      },
    );
    Object.defineProperty(navigator, 'mediaDevices', {
      configurable: true,
      value: {
        getUserMedia: vi.fn(async () => ({
          getTracks: () => [{ stop: vi.fn() }],
        })),
      },
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('returns recorded MediaRecorder data instead of a placeholder blob', async () => {
    const { result } = renderHook(() => useRecorder());

    await act(async () => {
      await result.current.start();
    });

    let audio: Blob | undefined;
    await act(async () => {
      audio = await result.current.stop();
    });

    expect(audio?.type).toBe('audio/webm');
    expect(audio?.size).toBeGreaterThan(4);
  });
});
