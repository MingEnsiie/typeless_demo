import path from 'node:path';
import { spawn } from 'node:child_process';
import fs from 'node:fs/promises';
import os from 'node:os';
import { Readable } from 'node:stream';
import basicSsl from '@vitejs/plugin-basic-ssl';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';
import { VitePWA } from 'vite-plugin-pwa';

const localAsrModelPath = '/home/mingzh/Documents/Workplace/QwenAsset/model/Qwen3-ASR-1.7B';
const localAsrPython = path.resolve(__dirname, '../.qwen/bin/python');
const localAsrScript = path.resolve(__dirname, 'scripts/qwen3_asr_transcribe.py');

export default defineConfig({
  plugins: [
    basicSsl(),
    {
      name: 'local-qwen3-asr-api',
      configureServer(server) {
        server.middlewares.use('/api/asr/qwen3-local/v1/audio/transcriptions', async (req, res) => {
          if (req.method !== 'POST') {
            res.statusCode = 405;
            res.end(JSON.stringify({ error: { message: 'Method not allowed' } }));
            return;
          }
          try {
            const request = new Request('http://localhost/api/asr/qwen3-local/v1/audio/transcriptions', {
              method: 'POST',
              headers: req.headers as Record<string, string>,
              body: Readable.toWeb(req),
              duplex: 'half',
            } as unknown as RequestInit & { duplex: 'half' });
            const form = await request.formData();
            const file = form.get('file');
            if (!(file instanceof File)) {
              res.statusCode = 400;
              res.end(JSON.stringify({ error: { message: 'Missing audio file' } }));
              return;
            }
            const ext = path.extname(file.name || 'speech.webm') || '.webm';
            const audioPath = path.join(os.tmpdir(), `typeless-qwen3-asr-${Date.now()}${ext}`);
            await fs.writeFile(audioPath, Buffer.from(await file.arrayBuffer()));
            const output = await runLocalAsr(audioPath, form.get('language')?.toString());
            res.setHeader('Content-Type', 'application/json; charset=utf-8');
            res.end(JSON.stringify({ text: output.text, language: output.language, duration_ms: output.duration_ms }));
          } catch (error) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json; charset=utf-8');
            res.end(JSON.stringify({ error: { message: error instanceof Error ? error.message : String(error) } }));
          }
        });
      },
    },
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Typeless Demo',
        short_name: 'Typeless',
        description: 'AI voice dictation, rewrite, and translation demo',
        theme_color: '#1d4ed8',
        background_color: '#f4f8ff',
        display: 'standalone',
        icons: [],
      },
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  worker: { format: 'es' },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.ts',
  },
  server: {
    proxy: {
      '/api/asr/groq': {
        target: 'https://api.groq.com',
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/api\/asr\/groq/, '/openai'),
      },
      '/api/asr/openai': {
        target: 'https://api.openai.com',
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/api\/asr\/openai/, ''),
      },
      '/api/asr/siliconflow': {
        target: 'https://api.siliconflow.cn',
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/api\/asr\/siliconflow/, ''),
      },
      '/api/llm/deepseek': {
        target: 'https://api.deepseek.com',
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/api\/llm\/deepseek/, ''),
      },
      '/api/llm/mimo': {
        target: 'https://token-plan-cn.xiaomimimo.com',
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/api\/llm\/mimo/, ''),
      },
      '/api/llm/ollama': {
        target: 'http://127.0.0.1:11434',
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/api\/llm\/ollama/, ''),
      },
    },
  },
  optimizeDeps: {
    exclude: ['onnxruntime-web', '@huggingface/transformers'],
  },
});

function runLocalAsr(audioPath: string, language?: string): Promise<{ text: string; language?: string; duration_ms?: number }> {
  return new Promise((resolve, reject) => {
    const args = ['--model-path', localAsrModelPath, '--audio', audioPath];
    if (language && language !== 'auto') args.push('--language', language);
    const child = spawn(localAsrPython, [localAsrScript, ...args], {
      cwd: __dirname,
      env: { ...process.env, TRANSFORMERS_VERBOSITY: 'error' },
    });
    let stdout = '';
    let stderr = '';
    const timer = setTimeout(() => {
      child.kill('SIGTERM');
      reject(new Error('Qwen3-ASR local inference timed out'));
    }, 300_000);
    child.stdout.on('data', (chunk) => {
      stdout += chunk.toString();
    });
    child.stderr.on('data', (chunk) => {
      stderr += chunk.toString();
    });
    child.on('error', (error) => {
      clearTimeout(timer);
      reject(error);
    });
    child.on('close', (code) => {
      clearTimeout(timer);
      if (code !== 0) {
        reject(new Error(stderr || `Qwen3-ASR exited with code ${code}`));
        return;
      }
      try {
        resolve(JSON.parse(stdout.trim().split('\n').at(-1) ?? '{}'));
      } catch {
        reject(new Error(`Invalid Qwen3-ASR response: ${stdout || stderr}`));
      }
    });
  });
}
