# Typeless Demo Architecture

The app is a single Vite + React SPA. Browser APIs handle hotkeys, microphone state, clipboard writes, local persistence, and the simulated target application textarea.

Core paths:

- Dictation: Space -> recorder -> ASR provider -> polish prompt -> append to textarea and clipboard.
- Selection rewrite: textarea selection -> floating popover -> rewrite or translate prompt -> replace selected range.
- Translation: translate mode or Cmd/Ctrl+Shift+T -> ASR provider -> translate prompt -> translated result panel and textarea.

The Vite dev proxy maps `/api/asr/*` and `/api/llm/*` to Groq, OpenAI, SiliconFlow, DeepSeek, MiMo, and Ollama-compatible endpoints.
