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
  const audioContext = useRef<AudioContext | null>(null);
  const analyser = useRef<AnalyserNode | null>(null);
  const frequencyData = useRef<Uint8Array | null>(null);

  const start = useCallback(async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      throw new Error('当前页面无法访问麦克风。远程访问时请使用 HTTPS 地址，并在浏览器里允许麦克风权限。');
    }
    stream.current = await navigator.mediaDevices.getUserMedia({ audio: true });
    const audio = setupAnalyser(stream.current);
    audioContext.current = audio?.ctx ?? null;
    analyser.current = audio?.node ?? null;
    frequencyData.current = audio?.data ?? null;
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
      const levels = readLevels(analyser.current, frequencyData.current);
      setState({
        recording: true,
        elapsedMs: Date.now() - startedAt.current,
        levels,
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
    analyser.current?.disconnect();
    void audioContext.current?.close();
    stream.current = null;
    recorder.current = null;
    analyser.current = null;
    audioContext.current = null;
    frequencyData.current = null;
  };

  return { ...state, start, stop };
}

function setupAnalyser(stream: MediaStream): { ctx: AudioContext; node: AnalyserNode; data: Uint8Array } | null {
  const AudioContextCtor = window.AudioContext;
  if (!AudioContextCtor) return null;
  const ctx = new AudioContextCtor();
  const source = ctx.createMediaStreamSource(stream);
  const node = ctx.createAnalyser();
  node.fftSize = 64;
  source.connect(node);
  return { ctx, node, data: new Uint8Array(node.frequencyBinCount) };
}

function readLevels(node: AnalyserNode | null, data: Uint8Array | null): number[] {
  if (!node || !data) return Array.from({ length: 32 }, () => 0);
  node.getByteFrequencyData(data);
  return Array.from(data, (value) => value / 255);
}

function preferredMimeType(): string | undefined {
  const candidates = ['audio/webm;codecs=opus', 'audio/webm', 'audio/ogg;codecs=opus', 'audio/mp4'];
  return candidates.find((type) => MediaRecorder.isTypeSupported(type));
}
