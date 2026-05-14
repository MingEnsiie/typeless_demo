import { useEffect, useMemo, useRef, useState } from 'react';
import { createActor } from 'xstate';
import { toast } from 'sonner';
import { Github, Radio, Sparkles } from 'lucide-react';
import { AppContextSwitcher } from '@/components/AppContextSwitcher';
import { DemoSurface } from '@/components/DemoSurface';
import { DictionaryEditor } from '@/components/DictionaryEditor';
import { HistoryList } from '@/components/HistoryList';
import { HotkeyHint } from '@/components/HotkeyHint';
import { ModelManager } from '@/components/ModelManager';
import { Onboarding } from '@/components/Onboarding';
import { ResultPanel } from '@/components/ResultPanel';
import { SelectionPopover } from '@/components/SelectionPopover';
import { SettingsDialog } from '@/components/SettingsDialog';
import { Toolbar } from '@/components/Toolbar';
import { TranslateBar } from '@/components/TranslateBar';
import { Waveform } from '@/components/Waveform';
import { useAsr } from '@/hooks/useAsr';
import { useHotkey } from '@/hooks/useHotkey';
import { useInject } from '@/hooks/useInject';
import { useLlm } from '@/hooks/useLlm';
import { useRecorder } from '@/hooks/useRecorder';
import { useTextareaSelection } from '@/hooks/useTextareaSelection';
import { findEndpoint } from '@/lib/llm/endpoints';
import { getAppRule } from '@/lib/llm/prompts/app-rules';
import type { RewritePreset } from '@/lib/llm/prompts/rewrite.v1';
import { useConfigStore } from '@/lib/storage/config';
import { loadHistory, saveHistory } from '@/lib/storage/history';
import { typelessMachine } from '@/machine/typeless.machine';
import type { HistoryItem, TypelessMode } from '@/types';

const actor = createActor(typelessMachine).start();

export default function App() {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [snapshot, setSnapshot] = useState(actor.getSnapshot());
  const [draft, setDraft] = useState('');
  const [raw, setRaw] = useState('');
  const [finalText, setFinalText] = useState('');
  const [streaming, setStreaming] = useState('');
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [rewriting, setRewriting] = useState(false);

  const config = useConfigStore();
  const recorder = useRecorder();
  const transcribe = useAsr();
  const llm = useLlm();
  const inject = useInject();
  const selection = useTextareaSelection(textareaRef);

  const rule = useMemo(() => getAppRule(config.appContext), [config.appContext]);
  const llmEndpoint = useMemo(() => findEndpoint(config.endpoints, config.llmEndpointId), [config.endpoints, config.llmEndpointId]);
  const asrEndpoint = useMemo(() => findEndpoint(config.endpoints, config.asrEndpointId), [config.endpoints, config.asrEndpointId]);

  useEffect(() => actor.subscribe((next) => setSnapshot(next)).unsubscribe, []);
  useEffect(() => {
    void loadHistory().then(setHistory);
  }, []);
  useEffect(() => {
    document.documentElement.dataset.theme = config.darkMode ? 'dark' : 'light';
  }, [config.darkMode]);

  const runRecording = async (mode: TypelessMode) => {
    try {
      config.setMode(mode);
      actor.send({ type: 'HOTKEY_DOWN', mode });
      await recorder.start();
    } catch (error) {
      fail(error);
    }
  };

  const stopRecording = async () => {
    if (!recorder.recording) return;
    try {
      actor.send({ type: 'HOTKEY_UP' });
      const audio = await recorder.stop();
      const transcript = await transcribe(audio, asrEndpoint, config.offlineMode);
      setRaw(transcript.text);
      actor.send({ type: 'ASR_DONE', raw: transcript.text });
      setStreaming('');
      const final =
        config.mode === 'translate'
          ? await llm.translate(transcript.text, config.targetLang, rule, config.dictionary, llmEndpoint, setStreaming)
          : await llm.polish(transcript.text, rule, config.dictionary, llmEndpoint, setStreaming);
      await commitFinal(config.mode, transcript.text, final);
    } catch (error) {
      fail(error);
    }
  };

  const commitFinal = async (mode: TypelessMode, inputRaw: string, output: string) => {
    setFinalText(output);
    actor.send({ type: 'LLM_DONE', final: output });
    await inject.append(textareaRef.current, output);
    actor.send({ type: 'INJECT_DONE' });
    const item = await saveHistory({
      id: crypto.randomUUID(),
      mode,
      raw: inputRaw,
      finalText: output,
      appContext: config.appContext,
      targetLang: config.targetLang,
      createdAt: new Date().toISOString(),
    });
    setHistory(item);
    toast.success('已写入演示区和剪贴板');
  };

  const rewriteSelection = async (preset: RewritePreset | string) => {
    if (!selection || rewriting) return;
    try {
      setRewriting(true);
      config.setMode('rewrite');
      actor.send({ type: 'REWRITE_PRESET', selection: selection.text });
      setRaw(selection.text);
      setStreaming('');
      const output =
        preset === 'translate'
          ? await llm.translate(selection.text, config.targetLang, rule, config.dictionary, llmEndpoint, setStreaming)
          : await llm.rewrite(selection.text, preset, config.targetLang, rule, config.dictionary, llmEndpoint, setStreaming);
      setFinalText(output);
      actor.send({ type: 'LLM_DONE', final: output });
      await inject.replaceSelection(textareaRef.current, output, selection.start, selection.end);
      actor.send({ type: 'INJECT_DONE' });
      const item = await saveHistory({
        id: crypto.randomUUID(),
        mode: preset === 'translate' ? 'translate' : 'rewrite',
        raw: selection.text,
        finalText: output,
        appContext: config.appContext,
        targetLang: config.targetLang,
        createdAt: new Date().toISOString(),
      });
      setHistory(item);
      toast.success('选区已替换');
    } catch (error) {
      fail(error);
    } finally {
      setRewriting(false);
    }
  };

  const fail = (error: unknown) => {
    const message = error instanceof Error ? error.message : String(error);
    actor.send({ type: 'FAIL', error: message });
    toast.error(message);
  };

  useHotkey({
    mode: config.mode,
    onDown: runRecording,
    onUp: stopRecording,
    onTranslate: () => runRecording('translate'),
  });

  const stateLabel = snapshot.value.toString();

  return (
    <div className="app-shell">
      <Onboarding open={!config.onboardingDone} onClose={config.completeOnboarding} />
      <header className="topbar">
        <div className="brand">
          <div className="brand-mark">
            <Radio size={20} />
          </div>
          <div>
            <h1>Typeless</h1>
            <span>AI voice input · rewrite · translate</span>
          </div>
        </div>
        <TranslateBar mode={config.mode} targetLang={config.targetLang} onMode={config.setMode} onLang={config.setTargetLang} />
        <Toolbar
          darkMode={config.darkMode}
          offlineMode={config.offlineMode}
          onDark={config.setDarkMode}
          onOffline={config.setOfflineMode}
          onSettings={() => setSettingsOpen(true)}
        />
      </header>

      <main className="workspace">
        <section className="left-column">
          <div className="control-strip">
            <HotkeyHint mode={config.mode} recording={recorder.recording} />
            <AppContextSwitcher value={config.appContext} onChange={config.setAppContext} />
          </div>
          <Waveform levels={recorder.levels} active={recorder.recording || stateLabel === 'polishing'} />
          <DemoSurface
            ref={textareaRef}
            value={draft}
            rule={rule}
            streamingSelection={rewriting}
            onChange={setDraft}
          />
          <SelectionPopover
            selection={selection}
            onPreset={rewriteSelection}
            onCustom={() => rewriteSelection('Make this clearer and more specific.')}
            onClose={() => textareaRef.current?.setSelectionRange(0, 0)}
          />
          <ResultPanel
            mode={config.mode}
            raw={raw}
            finalText={finalText}
            streaming={streaming}
            onCopy={(text) => void inject.copy(text).then(() => toast.success('已复制'))}
            onRetranslate={() => {
              const next = config.targetLang === 'en' ? 'zh' : 'en';
              config.setTargetLang(next);
              if (raw) void llm.translate(raw, next, rule, config.dictionary, llmEndpoint, setStreaming).then(setFinalText);
            }}
          />
        </section>

        <aside className="right-column">
          <section className="status-card">
            <span>当前状态</span>
            <strong>{stateLabel}</strong>
            <p>{snapshot.context.error ?? `${asrEndpoint.label} → ${llmEndpoint.label}`}</p>
            <button onClick={() => void runRecording(config.mode)}>
              <Sparkles size={15} /> 开始录音
            </button>
            <button onClick={() => void stopRecording()} disabled={!recorder.recording}>
              停止并处理
            </button>
          </section>
          <DictionaryEditor terms={config.dictionary} onAdd={config.addDictionaryTerm} onRemove={config.removeDictionaryTerm} />
          <HistoryList
            items={history}
            onUse={(item) => {
              setRaw(item.raw);
              setFinalText(item.finalText);
              setDraft((current) => `${current}${current ? '\n\n' : ''}${item.finalText}`);
            }}
          />
          <ModelManager models={config.models} onDownload={config.simulateModelDownload} />
          <section className="side-panel docs-card">
            <div className="section-head">
              <span>交付</span>
              <Github size={16} />
            </div>
            <a href="/docs/api-keys.md">API key 文档</a>
            <a href="/docs/architecture.md">架构说明</a>
            <a href="/docs/prompts.md">Prompt 说明</a>
          </section>
        </aside>
      </main>

      <SettingsDialog
        open={settingsOpen}
        endpoints={config.endpoints}
        llmEndpointId={config.llmEndpointId}
        asrEndpointId={config.asrEndpointId}
        onClose={() => setSettingsOpen(false)}
        onKey={config.setEndpointKey}
        onModel={config.setEndpointModel}
        onSelect={config.selectEndpoint}
        onTest={(endpoint) => toast.success(`${endpoint.label} 配置已可用；真实网络调用将在执行任务时发生`)}
      />
    </div>
  );
}
