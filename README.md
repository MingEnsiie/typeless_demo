# Typeless 复刻 · 网页 Demo

单页 Vite + React + TypeScript demo，复刻 Typeless 的核心体验：按住热键说话、ASR 转写、LLM 润色、写入模拟目标应用和剪贴板，并补齐框选改写、语音指令改写、语音翻译、场景化输出、本地模型调用和历史管理。

## 当前状态

- 主输入：按住 `Left Alt` 说话，松开后自动 ASR -> LLM -> 写入最终输出区。
- 选区改写：在最终输出区框选文字后，可直接使用预设改写或翻译选区。
- 语音指令改写：框选文字后点击“按语音指令改写”，再长按 `Right Alt` 说出改写要求，松开后自动替换原选区。
- 场景化输出：`Email`、`Slack`、`WeChat`、`Code`、`Notes`、`Casual` 具备不同 prompt 规则和输出形态。
- 本地 ASR：已接入 `Qwen3-ASR-1.7B Local`。
- 本地 LLM：已接入 `Qwen3.5-4B Local`，默认关闭 thinking 输出并清洗推理过程。
- 云端兼容：支持 DeepSeek、MiMo、Groq、OpenAI ASR、SiliconFlow ASR、Ollama 备选。
- 模型状态：页面右侧显示当前 ASR/LLM 的服务、模型名、路径或 API 地址。
- 历史会话：支持保存、回放和删除。

## 启动

远程浏览器要使用麦克风，必须走 HTTPS。本项目已启用 Vite basic SSL。

```bash
cd /home/mingzh/Documents/Workplace/typeless_reproduce
pnpm install
pnpm dev --host 0.0.0.0
```

访问地址：

```text
https://10.110.232.76:5173/
```

首次打开需要接受自签名证书，并允许浏览器麦克风权限。

## 本地模型

当前本地模型路径：

```text
ASR: /home/mingzh/Documents/Workplace/QwenAsset/model/Qwen3-ASR-1.7B
LLM: /home/mingzh/Documents/Workplace/QwenAsset/model/Qwen3.5-4B
```

本地模型通过 Vite dev server 的同源 API 调用：

```text
POST /api/asr/qwen3-local/v1/audio/transcriptions
POST /api/llm/qwen35-local/v1/chat/completions
```

实现细节：

- `scripts/qwen3_asr_transcribe.py` 使用 `qwen_asr` 加载本地 ASR，并用 `ffmpeg` 将上传音频转为 16k 单声道 WAV。
- `scripts/qwen35_llm_chat.py` 使用 `vllm` 加载 Qwen3.5-4B，返回 OpenAI-compatible chat completion。
- 本地 LLM 默认注入 no-thinking system instruction，并清洗 `<think>`、`Thinking Process:` 等推理内容。
- `.qwen` Python 环境需要可用，且本机 CUDA / vLLM / qwen-asr / ffmpeg 需要正常。

## 主要功能

### 语音输入

1. 长按 `Left Alt`。
2. 说出内容。
3. 松开按键。
4. 页面显示 `RAW ASR -> POLISH/TRANSLATION PREVIEW -> FINAL INPUT`。
5. 最终结果写入模拟目标应用，并复制到剪贴板。

### 框选改写

1. 在最终输出区框选文字。
2. 选择预设：更正式、更口语、简化、扩写、修错、翻译选区。
3. LLM 改写后替换原选区。

### 语音指令改写

1. 在最终输出区框选文字。
2. 点击“按语音指令改写”。
3. 页面提示长按 `Right Alt`。
4. 按住 `Right Alt` 说出要求，例如“改得更正式一点”。
5. 松开后自动 ASR，并用识别出的指令改写原选区。

### 场景化输出

每个目标应用都有独立输出规则：

- `Email`：专业邮件，适当加入问候、段落、请求、结尾。
- `Slack`：简短团队消息，不使用邮件式问候和签名。
- `WeChat`：自然中文口语消息。
- `Code`：面向开发者，保留代码符号，偏 commit / PR / review 风格。
- `Notes`：结构化笔记，强调标题、要点、行动项。
- `Casual`：自然友好表达，不强行结构化。

## 技术栈

- Vite 6 + React 19 + TypeScript
- XState：输入流程状态机
- Zustand + persist：配置存储
- localforage：历史会话存储
- MediaRecorder：浏览器录音
- Floating UI：选区浮层
- lucide-react：图标
- Vite PWA：PWA 构建
- Vitest + Testing Library：单元测试

## 已实现范围

- Phase 0：Vite/React/TS 工程、Tailwind、Vite dev proxy、依赖和基础文档。
- Phase 1：状态机、录音交互、真实音频上传、音量波形、热键、ASR/LLM 客户端、设置面板、错误 toast、历史落库。
- Phase 2：应用上下文、场景 prompt、Markdown 输出、用户词典、框选改写浮层、语音指令改写、翻译模式、目标语言、流程可视化、深色模式。
- Phase 3：本地 Qwen3-ASR、本地 Qwen3.5-4B、Ollama/DeepSeek/MiMo 备选、模型管理 UI、当前模型信息展示。
- Phase 4：首次引导、API key 文档、PWA 配置、HTTPS 远程访问、完整项目 HTML 报告。

## 验证

```bash
pnpm test
pnpm build
```

当前验证状态：

```text
16 test files passed
27 tests passed
production build passed
```

## 代码规模

统计范围为 `src/` 和 `scripts/` 下的 `.ts`、`.tsx`、`.py` 文件，不包含 `node_modules`、`dist`、报告、文档和缓存。

```text
核心源码文件：64
核心源码总行数：2934
测试代码：551 行
不含测试的业务/实现代码：2383 行
```

## 文档

- [实施计划](./plan.html)
- [架构说明](./docs/architecture.md)
- [API key 说明](./docs/api-keys.md)
- [Prompt 说明](./docs/prompts.md)
- [完整项目 HTML 报告](./docs/typeless-project-report.html)

## 注意事项

- 本地 Qwen3.5-4B 使用 vLLM 加载，冷启动较慢，首次调用可能需要几十秒到一两分钟。
- 当前本地 ASR/LLM 是通过 Vite dev middleware spawn Python 脚本，适合 demo 和本机验收；后续可演进为常驻 FastAPI 服务以减少模型重复加载。
- 远程麦克风访问必须使用 HTTPS，浏览器需要接受自签证书。
