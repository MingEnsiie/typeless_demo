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
  const stream = useRef<MediaStream | null>(null);
  const recorder = useRef<MediaRecorder | null>(null);
  const chunks = useRef<Blob[]>([]);

  const start = useCallback(async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      throw new Error('当前浏览器不支持麦克风录音');
    }
    stream.current = await navigator.mediaDevices.getUserMedia({ audio: true });
    chunks.current = [];
    const mimeType = preferredMimeType();
    recorder.current = new MediaRecorder(stream.current, mimeType ? { mimeType } : undefined);
    recorder.current.addEventListener('dataavailable', (event) => {
      if (event.data.size > 0) chunks.current.push(event.data);
    });
    recorder.current.start();
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
    const activeRecorder = recorder.current;
    if (!activeRecorder) {
      throw new Error('录音尚未开始');
    }
    const recorded = await new Promise<Blob>((resolve, reject) => {
      activeRecorder.addEventListener(
        'stop',
        () => {
          const type = chunks.current[0]?.type || activeRecorder.mimeType || 'audio/webm';
          cleanup();
          if (chunks.current.length === 0) {
            reject(new Error('没有采集到有效音频'));
            return;
          }
          resolve(new Blob(chunks.current, { type }));
        },
        { once: true },
      );
      activeRecorder.stop();
    });
    return recorded;
  }, []);

  const cleanup = () => {
    stream.current?.getTracks().forEach((track) => track.stop());
    stream.current = null;
    recorder.current = null;
  };

  return { ...state, start, stop };
}

function preferredMimeType(): string | undefined {
  const candidates = ['audio/webm;codecs=opus', 'audio/webm', 'audio/ogg;codecs=opus', 'audio/mp4'];
  return candidates.find((type) => MediaRecorder.isTypeSupported(type));
}
