# Typeless 复刻 · 网页 Demo

单页 Vite + React + TypeScript demo，复刻 Typeless 的核心体验：按住热键说话、ASR 转写、LLM 润色、写入模拟目标应用和剪贴板，并补齐框选改写与语音翻译。

## 启动

```bash
cd /home/mingzh/Documents/Workplace/typeless_reproduce
pnpm install
pnpm dev
```

默认地址：`http://localhost:5173`

## 已实现范围

- Phase 0：Vite/React/TS 工程、Tailwind、Vite dev proxy、依赖和文档。
- Phase 1：状态机、录音交互、波形、热键、ASR/LLM 客户端、润色 prompt、设置面板、错误 toast、历史落库。
- Phase 2：应用上下文、Markdown 结果、用户词典、框选改写浮层、预设/语音指令改写、翻译模式、目标语言、双列结果、深色模式、离线 toggle。
- Phase 3：本地 ASR/Ollama 路径、模型管理 UI、离线翻译路径入口。
- Phase 4：首次引导、API key 文档、PWA 配置、静态部署可构建产物。

没有 API key 时会自动走 demo mock，便于端到端验收 UI；配置 Groq/DeepSeek/Ollama 后会通过 `vite.config.ts` 的 proxy 调用真实 OpenAI 兼容接口。

## 验证

```bash
pnpm test
pnpm build
```

## 文档

- [实施计划](./plan.html)
- [架构说明](./docs/architecture.md)
- [API key 说明](./docs/api-keys.md)
- [Prompt 说明](./docs/prompts.md)
