import { assign, setup } from 'xstate';
import type { TypelessMode } from '@/types';

interface TypelessContext {
  mode: TypelessMode;
  rawText: string;
  finalText: string;
  error: string | null;
}

type TypelessEvent =
  | { type: 'HOTKEY_DOWN'; mode?: TypelessMode }
  | { type: 'HOTKEY_UP' }
  | { type: 'VAD_END' }
  | { type: 'ASR_DONE'; raw: string }
  | { type: 'LLM_DONE'; final: string }
  | { type: 'INJECT_DONE' }
  | { type: 'REWRITE_PRESET'; selection: string }
  | { type: 'FAIL'; error: string }
  | { type: 'RESET' };

export const typelessMachine = setup({
  types: {} as {
    context: TypelessContext;
    events: TypelessEvent;
  },
}).createMachine({
  id: 'typeless',
  initial: 'idle',
  context: {
    mode: 'dictate',
    rawText: '',
    finalText: '',
    error: null,
  },
  states: {
    idle: {
      on: {
        HOTKEY_DOWN: {
          target: 'recording',
          actions: assign({
            mode: ({ event }) => event.mode ?? 'dictate',
            rawText: '',
            finalText: '',
            error: null,
          }),
        },
        REWRITE_PRESET: {
          target: 'polishing',
          actions: assign({
            mode: 'rewrite',
            rawText: ({ event }) => event.selection,
            finalText: '',
            error: null,
          }),
        },
      },
    },
    recording: {
      on: {
        HOTKEY_UP: 'transcribing',
        VAD_END: 'transcribing',
        FAIL: {
          target: 'idle',
          actions: assign({ error: ({ event }) => event.error }),
        },
      },
    },
    transcribing: {
      on: {
        ASR_DONE: {
          target: 'polishing',
          actions: assign({ rawText: ({ event }) => event.raw }),
        },
        FAIL: {
          target: 'idle',
          actions: assign({ error: ({ event }) => event.error }),
        },
      },
    },
    polishing: {
      on: {
        LLM_DONE: {
          target: 'injecting',
          actions: assign({ finalText: ({ event }) => event.final }),
        },
        FAIL: {
          target: 'idle',
          actions: assign({ error: ({ event }) => event.error }),
        },
      },
    },
    injecting: {
      on: {
        INJECT_DONE: 'idle',
        FAIL: {
          target: 'idle',
          actions: assign({ error: ({ event }) => event.error }),
        },
      },
    },
  },
  on: {
    RESET: {
      target: '.idle',
      actions: assign({ rawText: '', finalText: '', error: null }),
    },
  },
});
