# API Keys

This demo stores keys in browser localStorage. Use local development keys only.

- Groq: create a key for Whisper transcription and paste it into Settings -> Groq Whisper Turbo.
- DeepSeek: create a chat completion key and paste it into Settings -> DeepSeek V4 Flash.
- OpenAI or SiliconFlow: switch the ASR endpoint in Settings if you prefer those providers.
- Ollama: no key is required. Start Ollama locally and keep the default `qwen3:4b` model.

Without keys, the app runs in demo mode with deterministic mock ASR and LLM output so the UI can be tested end to end.
