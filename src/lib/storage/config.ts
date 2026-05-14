import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AppContextId, DictionaryTerm, EndpointConfig, ModelDownload, TypelessMode } from '@/types';
import { DEFAULT_ENDPOINTS } from '@/lib/llm/endpoints';

interface ConfigState {
  appContext: AppContextId;
  mode: TypelessMode;
  hotkey: string;
  holdToTalk: boolean;
  offlineMode: boolean;
  darkMode: boolean;
  targetLang: string;
  llmEndpointId: string;
  asrEndpointId: string;
  endpoints: EndpointConfig[];
  dictionary: DictionaryTerm[];
  onboardingDone: boolean;
  models: ModelDownload[];
  setAppContext: (ctx: AppContextId) => void;
  setMode: (mode: TypelessMode) => void;
  setTargetLang: (lang: string) => void;
  setEndpointKey: (id: string, apiKey: string) => void;
  setEndpointModel: (id: string, model: string) => void;
  selectEndpoint: (kind: 'asr' | 'llm', id: string) => void;
  addDictionaryTerm: (term: Omit<DictionaryTerm, 'id'>) => void;
  removeDictionaryTerm: (id: string) => void;
  setDarkMode: (value: boolean) => void;
  setOfflineMode: (value: boolean) => void;
  completeOnboarding: () => void;
  simulateModelDownload: (id: string) => void;
}

export const useConfigStore = create<ConfigState>()(
  persist(
    (set) => ({
      appContext: 'email',
      mode: 'dictate',
      hotkey: 'Space',
      holdToTalk: true,
      offlineMode: false,
      darkMode: false,
      targetLang: 'en',
      llmEndpointId: 'deepseek',
      asrEndpointId: 'groq',
      endpoints: DEFAULT_ENDPOINTS,
      dictionary: [
        { id: 'term-typeless', source: 'typeless', replacement: 'Typeless' },
        { id: 'term-qwen', source: '通义千问', replacement: 'Qwen' },
      ],
      onboardingDone: false,
      models: [
        { id: 'whisper-tiny', label: 'Whisper Tiny WebGPU', size: '151 MB', quantization: 'q8', progress: 0, status: 'not-downloaded' },
        { id: 'whisper-base', label: 'Whisper Base WASM', size: '290 MB', quantization: 'q8', progress: 0, status: 'not-downloaded' },
        { id: 'qwen3-4b', label: 'Ollama qwen3:4b', size: '2.4 GB', quantization: 'q4', progress: 100, status: 'ready' },
      ],
      setAppContext: (appContext) => set({ appContext }),
      setMode: (mode) => set({ mode }),
      setTargetLang: (targetLang) => set({ targetLang }),
      setEndpointKey: (id, apiKey) =>
        set((state) => ({
          endpoints: state.endpoints.map((endpoint) => (endpoint.id === id ? { ...endpoint, apiKey } : endpoint)),
        })),
      setEndpointModel: (id, model) =>
        set((state) => ({
          endpoints: state.endpoints.map((endpoint) => (endpoint.id === id ? { ...endpoint, model } : endpoint)),
        })),
      selectEndpoint: (kind, id) => set(kind === 'asr' ? { asrEndpointId: id } : { llmEndpointId: id }),
      addDictionaryTerm: (term) =>
        set((state) => ({
          dictionary: [{ id: crypto.randomUUID(), ...term }, ...state.dictionary],
        })),
      removeDictionaryTerm: (id) =>
        set((state) => ({
          dictionary: state.dictionary.filter((term) => term.id !== id),
        })),
      setDarkMode: (darkMode) => set({ darkMode }),
      setOfflineMode: (offlineMode) => set({ offlineMode }),
      completeOnboarding: () => set({ onboardingDone: true }),
      simulateModelDownload: (id) =>
        set((state) => ({
          models: state.models.map((model) =>
            model.id === id ? { ...model, progress: 100, status: 'ready' } : model,
          ),
        })),
    }),
    { name: 'typeless-config-v1' },
  ),
);
