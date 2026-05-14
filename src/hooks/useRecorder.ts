import { useCallback, useRef, useState } from 'react';

export interface RecorderState {
  recording: boolean;
  elapsedMs: number;
  levels: number[];
}

export function useRecorder() {
  const [state, setState] = useState<RecorderState>({
    recording: false,
    elapsedMs: 0,
    levels: Array.from({ length: 32 }, () => 0.2),
  });
  const startedAt = useRef(0);
  const timer = useRef<number | null>(null);

  const start = useCallback(async () => {
    startedAt.current = Date.now();
    setState((prev) => ({ ...prev, recording: true, elapsedMs: 0 }));
    timer.current = window.setInterval(() => {
      setState({
        recording: true,
        elapsedMs: Date.now() - startedAt.current,
        levels: Array.from({ length: 32 }, (_, i) => {
          const phase = Date.now() / 180 + i * 0.45;
          return 0.18 + Math.abs(Math.sin(phase)) * 0.78;
        }),
      });
    }, 80);
  }, []);

  const stop = useCallback(async (): Promise<Blob> => {
    if (timer.current) window.clearInterval(timer.current);
    setState((prev) => ({ ...prev, recording: false }));
    return new Blob([new Uint8Array([0, 1, 2, 3])], { type: 'audio/wav' });
  }, []);

  return { ...state, start, stop };
}
