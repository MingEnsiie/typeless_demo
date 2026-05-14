import path from 'node:path';
import basicSsl from '@vitejs/plugin-basic-ssl';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    basicSsl(),
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
